import React, { useEffect, useState } from 'react'
import { fetchHealthStatus, initializeSDK } from '../services/nuklaiService'
import './component.css'

interface HealthStatusProps {
  baseApiUrl: string
  blockchainId: string
}

const HealthStatus: React.FC<HealthStatusProps> = ({
  baseApiUrl,
  blockchainId
}) => {
  const [healthStatus, setHealthStatus] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showStatus, setShowStatus] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null) // Reset error state
    try {
      const sdk = initializeSDK(baseApiUrl, blockchainId)
      const status = await fetchHealthStatus(sdk)
      setHealthStatus(status.success)
      setShowStatus(true)

      // Set a timeout to remove the status after 5 seconds
      setTimeout(() => {
        setShowStatus(false)
        setHealthStatus(null)
      }, 15000) // Adjust the duration as needed
    } catch (error) {
      setError(
        `Failed to fetch Health Status: ${JSON.stringify(error, null, 2)}`
      )
      console.error(error)
    }
  }

  useEffect(() => {
    // Cleanup the timeout if the component unmounts
    return () => {
      setShowStatus(false)
      setHealthStatus(null)
    }
  }, [])

  return (
    <div>
      <h2>Health Status</h2>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      <form onSubmit={handleSubmit}>
        <button type='submit'>Check</button>
      </form>
      <div className={showStatus ? 'fade-out' : ''}>
        {healthStatus !== null ? (
          <p>{healthStatus ? 'Healthy' : 'Unhealthy'}</p>
        ) : (
          <p>No status checked yet</p>
        )}
      </div>
    </div>
  )
}

export default HealthStatus
