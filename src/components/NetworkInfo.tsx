import { common } from '@nuklai/hyperchain-sdk'
import React, { useEffect, useState } from 'react'
import { fetchNetworkInfo, initializeSDK } from '../services/nuklaiService'
import './component.css'

interface NetworkInfoProps {
  baseApiUrl: string
  blockchainId: string
}

const NetworkInfo: React.FC<NetworkInfoProps> = ({
  baseApiUrl,
  blockchainId
}) => {
  const [networkInfo, setNetworkInfo] =
    useState<common.GetNetworkInfoResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showStatus, setShowStatus] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null) // Reset error state
    try {
      const sdk = initializeSDK(baseApiUrl, blockchainId)
      const info = await fetchNetworkInfo(sdk)
      setNetworkInfo(info)
      setShowStatus(true)

      // Set a timeout to remove the status after 5 seconds
      setTimeout(() => {
        setShowStatus(false)
        setNetworkInfo(null)
      }, 15000) // Adjust the duration as needed
    } catch (error) {
      setError(
        `Failed to fetch Network Info: ${JSON.stringify(error, null, 2)}`
      )
      console.error(error)
    }
  }

  useEffect(() => {
    // Cleanup the timeout if the component unmounts
    return () => {
      setShowStatus(false)
      setNetworkInfo(null)
    }
  }, [])

  return (
    <div>
      <h2>Network Info</h2>
      {error && <div>Error: {error}</div>}
      <form onSubmit={handleSubmit}>
        <button type='submit'>Query</button>
      </form>
      <div className={showStatus ? 'fade-out' : ''}>
        {networkInfo !== null ? (
          <div>
            <p>
              <strong>Network ID:</strong> {networkInfo.networkId}
            </p>
            <p>
              <strong>Subnet ID:</strong> {networkInfo.subnetId}
            </p>
            <p>
              <strong>Chain ID:</strong> {networkInfo.chainId}
            </p>
          </div>
        ) : (
          <p>Not queried yet</p>
        )}
      </div>
    </div>
  )
}

export default NetworkInfo
