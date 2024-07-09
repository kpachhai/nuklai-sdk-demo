import { chain, HyperchainSDK, services } from '@nuklai/hyperchain-sdk'
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
  const [error, setError] = useState<string | null>(null)
  const [sdk, setSdk] = useState<HyperchainSDK | null>(null)
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
              const { block, results, prices, err } =
                await webSocketService.listenBlock(
                  sdk!.actionRegistry,
                  sdk!.authRegistry
                )
              if (err) {
                setError('Failed to listen for blocks')
                return
              }
              console.log('Block:', block)
              console.log('Results:', results)
              console.log('Prices:', prices)
              setBlocks((prevBlocks) => [...prevBlocks, block])
            } catch (err) {
              setError('Failed to listen for blocks')
              console.error(err)
            }
          }

          // Initial block fetch
          listenBlocks()

          // Fetch blocks periodically
          const interval = setInterval(listenBlocks, 10000)

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
          <pre key={index}>{JSON.stringify(block, null, 2)}</pre>
        ))}
      </div>
    </div>
  )
}

export default BlockDetails
