import { chain, services } from '@nuklai/hyperchain-sdk'
import { NuklaiSDK } from '@nuklai/nuklai-sdk'
import React, { useEffect, useState } from 'react'
import { initializeSDK } from '../services/nuklaiService'

interface BlockDetailsProps {
  baseApiUrl: string
  blockchainId: string
}

const BlockDetails: React.FC<BlockDetailsProps> = ({
  baseApiUrl,
  blockchainId
}) => {
  const [blocks, setBlocks] = useState<chain.StatefulBlock[]>([])
  const [results, setResults] = useState<chain.Result[]>([])
  const [error, setError] = useState<string | null>(null)
  const [sdk, setSdk] = useState<NuklaiSDK | null>(null)
  const [webSocketService, setWebSocketService] =
    useState<services.WebSocketService | null>(null)

  useEffect(() => {
    const initializedSdk = initializeSDK(baseApiUrl, blockchainId)
    setSdk(initializedSdk)
    setWebSocketService(initializedSdk.wsService)
  }, [baseApiUrl, blockchainId])

  useEffect(() => {
    if (webSocketService) {
      const connectAndListen = async () => {
        try {
          await webSocketService.connect()
          const err = await webSocketService.registerBlocks()
          if (err) {
            setError('Failed to register blocks')
            return
          }

          const listenBlocks = async () => {
            try {
              const { block, results, err } =
                await webSocketService.listenBlock(
                  sdk.actionRegistry,
                  sdk.authRegistry
                )
              if (err) {
                setError('Failed to listen for blocks')
                return
              }

              setBlocks((prevBlocks) => {
                const updatedBlocks = [block, ...prevBlocks]
                return updatedBlocks.slice(0, 1) // Keep only the latest block
              })
              setResults((prevResults) => {
                const updatedResults = [results, ...prevResults]
                return updatedResults.slice(0, 1) // Keep only the latest block
              })
            } catch (err) {
              setError('Failed to listen for blocks')
              console.error(err)
            }
          }

          // Initial block fetch
          listenBlocks()

          // Fetch blocks periodically
          const interval = setInterval(listenBlocks, 3000)

          return () => clearInterval(interval)
        } catch (err) {
          setError('Failed to listen for blocks')
          console.error(err)
        }
      }

      connectAndListen()
    }

    return () => {
      if (webSocketService) {
        webSocketService.close()
      }
    }
  }, [webSocketService, sdk])

  return (
    <div>
      <h2>Block Details</h2>
      {error && <div>Error: {error}</div>}
      <div>
        {blocks.map((block, index) => (
          <div
            key={index}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '20px',
              margin: '20px 0',
              backgroundColor: '#f9f9f9'
            }}
          >
            <h3>Block #{block.hght.toString()}</h3>
            <p>
              <strong>Timestamp:</strong>{' '}
              {new Date(Number(block.tmstmp)).toLocaleString()}
            </p>
            <p>
              <strong>Parent ID:</strong> {block.prnt.toString()}
            </p>
            <p>
              <strong>State Root:</strong> {block.stateRoot.toString()}
            </p>
            <p>
              <strong>Size:</strong> {(block.size / 1024).toFixed(2)} KB
            </p>
            <p>
              <strong>Transaction Count:</strong> {block.txs.length}
            </p>
            {block.txs.length > 0 && (
              <div>
                <h4>Transactions:</h4>
                {block.txs.map((tx: chain.Transaction, txIndex: number) => (
                  <pre
                    key={txIndex}
                    style={{
                      backgroundColor: '#e9e9e9',
                      padding: '10px',
                      borderRadius: '5px'
                    }}
                  >
                    {JSON.stringify(tx, null, 2)}
                  </pre>
                ))}
              </div>
            )}
            <div>
              <h4>Results:</h4>
              {results.map((result, resultIndex) => (
                <pre
                  key={resultIndex}
                  style={{
                    backgroundColor: '#e9e9e9',
                    padding: '10px',
                    borderRadius: '5px'
                  }}
                >
                  {JSON.stringify(result, null, 2)}
                </pre>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BlockDetails
