import React, { useState } from 'react'
import {
  initializeSDK,
  sendTransferTransaction
  // sendTransferTransactionViaWebSocket
} from '../services/nuklaiService'

interface TransferTransactionProps {
  baseApiUrl: string
  blockchainId: string
}

const TransferTransaction: React.FC<TransferTransactionProps> = ({
  baseApiUrl,
  blockchainId
}) => {
  const [privateKey, setPrivateKey] = useState<string>(
    '323b1d8f4eed5f0da9da93071b034f2dce9d2d22692c172f3cb252a64ddfafd01b057de320297c29ad0c1f589ea216869cf1938d88c9fbd70d6748323dbf2fa7'
  )
  const [keyType, setKeyType] = useState<string>('ed25519')
  const [receiverAddress, setReceiverAddress] = useState<string>(
    'nuklai1qpxncu2a69l9wyz3yqg4fqn86ys2ll6ja7vhym5qn2vk4cdyvgj2vn4k7wz'
  )
  const [assetID, setAssetID] = useState<string>('NAI')
  const [amount, setAmount] = useState<string>('0.00001')
  const [memo, setMemo] = useState<string>('test transaction')
  const [txID, setTxID] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
      console.error(error)
    }
  }

  return (
    <div className='transfer-card'>
      <h2>Send Transfer Transaction</h2>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>Private Key</label>
          <input
            type='text'
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <label>Private Key Type</label>
          <select value={keyType} onChange={(e) => setKeyType(e.target.value)}>
            <option value='bls'>BLS</option>
            <option value='ed25519'>ED25519</option>
          </select>
        </div>
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
