import { NuklaiSDK } from '@nuklai/nuklai-sdk'
import React, { useEffect, useState } from 'react'
import { fetchHealthStatus, initializeSDK } from '../services/nuklaiService'

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
  const [sdk, setSdk] = useState<NuklaiSDK | null>(null)

  useEffect(() => {
    const initializedSdk = initializeSDK(baseApiUrl, blockchainId)
    setSdk(initializedSdk)
  }, [baseApiUrl, blockchainId])

  useEffect(() => {
    if (sdk) {
      const getHealthStatus = async () => {
        setLoading(true)
        setError(null)
        try {
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
