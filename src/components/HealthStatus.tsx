import { HyperchainSDK } from '@nuklai/hyperchain-sdk'
import React, { useEffect, useState } from 'react'
import {
  fetchHealthStatus,
  initializeSDKHyper
} from '../services/nuklaiService'

interface HealthStatusProps {
  baseApiUrl: string
  blockchainId: string
}

const HealthStatus: React.FC<HealthStatusProps> = ({
  baseApiUrl,
  blockchainId
}) => {
  const [healthStatus, setHealthStatus] = useState<boolean | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [sdk, setSdk] = useState<HyperchainSDK | null>(null)

  useEffect(() => {
    const initializedSdk = initializeSDKHyper(baseApiUrl, blockchainId)
    setSdk(initializedSdk)
  }, [baseApiUrl, blockchainId])

  useEffect(() => {
    if (sdk) {
      const getHealthStatus = async () => {
        setLoading(true)
        setError(null)
        try {
          await sdk.wsService.connect()
          const status = await fetchHealthStatus(sdk)
          setHealthStatus(status.success)
        } catch (error) {
          setError('Failed to fetch Health Status')
          console.error(error)
        } finally {
          setLoading(false)
        }
      }

      getHealthStatus()
    }
  }, [sdk])

  return (
    <div>
      <h2>Health Status</h2>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {healthStatus !== null && (
        <pre>{JSON.stringify(healthStatus, null, 2)}</pre>
      )}
    </div>
  )
}

export default HealthStatus
