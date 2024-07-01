import React, { useState } from 'react'
import './App.css'
import HealthStatus from './components/HealthStatus'
import NetworkInfo from './components/NetworkInfo'
import TransferTransaction from './components/TransferTransaction'

function App() {
  const defaultBaseApiUrl = import.meta.env.VITE_BASE_API_URL || ''
  const defaultBlockchainId = import.meta.env.VITE_BLOCKCHAIN_ID || ''
  const [baseApiUrl, setBaseApiUrl] = useState<string>(defaultBaseApiUrl)
  const [blockchainId, setBlockchainId] = useState<string>(defaultBlockchainId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <div id='root'>
      <h1>Nuklai SDK Demo App</h1>
      <form onSubmit={handleSubmit} className='form-card'>
        <div className='form-group'>
          <label>Base API URL:</label>
          <input
            type='text'
            value={baseApiUrl}
            onChange={(e) => setBaseApiUrl(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <label>Blockchain ID:</label>
          <input
            type='text'
            value={blockchainId}
            onChange={(e) => setBlockchainId(e.target.value)}
          />
        </div>
        <button type='submit'>Update</button>
      </form>
      <div className='card-container'>
        <div className='card'>
          <HealthStatus baseApiUrl={baseApiUrl} blockchainId={blockchainId} />
        </div>
        <div className='card'>
          <NetworkInfo baseApiUrl={baseApiUrl} blockchainId={blockchainId} />
        </div>
      </div>
      <div className='transfer-card'>
        <TransferTransaction
          baseApiUrl={baseApiUrl}
          blockchainId={blockchainId}
        />
      </div>
    </div>
  )
}

export default App
