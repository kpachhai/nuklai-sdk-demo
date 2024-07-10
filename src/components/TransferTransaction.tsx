import React, { useState } from 'react'
import {
  initializeSDK,
  sendTransferTransaction
  // sendTransferTransactionViaWebSocket
} from '../services/nuklaiService'

interface TransferTransactionProps {
  baseApiUrl: string
  blockchainId: string
  privateKey: string
  keyType: string
}

const TransferTransaction: React.FC<TransferTransactionProps> = ({
  baseApiUrl,
  blockchainId,
  privateKey,
  keyType
}) => {
  const [receiverAddress, setReceiverAddress] = useState<string>(
    'nuklai1qpxncu2a69l9wyz3yqg4fqn86ys2ll6ja7vhym5qn2vk4cdyvgj2vn4k7wz'
  )
  const [assetID, setAssetID] = useState<string>('NAI')
  const [amount, setAmount] = useState<string>('0.00001')
  const [memo, setMemo] = useState<string>('test transaction')
  const [txID, setTxID] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null) // Reset error state
    try {
      const sdk = initializeSDK(baseApiUrl, blockchainId)
      const id = await sendTransferTransaction(
        sdk,
        privateKey,
        keyType,
        receiverAddress,
        assetID,
        parseFloat(amount),
        memo
      )
      // NOTE: You can also use sendTransferTransactionViaWebSocket function
      /*      const id = await sendTransferTransactionViaWebSocket(
        sdk,
        privateKey,
        keyType,
        receiverAddress,
        assetID,
        parseFloat(amount),
        memo
      ) */
      setTxID(id)
    } catch (error) {
      setError(
        `Failed to send transfer transaction: ${JSON.stringify(error, null, 2)}`
      )
      console.error(error)
    }
  }

  return (
    <div>
      <h2>Send Transfer Transaction</h2>
      {error && <div>Error: {error}</div>}
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>Receiver Address</label>
          <input
            type='text'
            value={receiverAddress}
            onChange={(e) => setReceiverAddress(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <label>Asset ID</label>
          <input
            type='text'
            value={assetID}
            onChange={(e) => setAssetID(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <label>Amount</label>
          <input
            type='number'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <label>Memo</label>
          <input
            type='text'
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
        </div>
        <button type='submit'>Send</button>
      </form>
      {txID && (
        <div>
          <h3>Transaction ID</h3>
          <p>{txID}</p>
        </div>
      )}
    </div>
  )
}

export default TransferTransaction
