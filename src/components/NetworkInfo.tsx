import { common } from '@nuklai/hyperchain-sdk'
import { NuklaiSDK } from '@nuklai/nuklai-sdk'

import React, { useEffect, useState } from 'react'
import { fetchNetworkInfo, initializeSDK } from '../services/nuklaiService'

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
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [sdk, setSdk] = useState<NuklaiSDK | null>(null)

  useEffect(() => {
    const initializedSdk = initializeSDK(baseApiUrl, blockchainId)
    setSdk(initializedSdk)
  }, [baseApiUrl, blockchainId])

  useEffect(() => {
    if (sdk) {
      const getNetworkInfo = async () => {
        setLoading(true)
        setError(null)
        try {
          const info = await fetchNetworkInfo(sdk)
          setNetworkInfo(info)
        } catch (error) {
          setError('Failed to fetch Network Info')
          console.error(error)
        } finally {
          setLoading(false)
        }
      }

      getNetworkInfo()
    }
  }, [sdk])

  return (
    <div>
      <h2>Network Info</h2>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {networkInfo && (
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
      )}
    </div>
  )
}

export default NetworkInfo
