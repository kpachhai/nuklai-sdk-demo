import { auth, common } from '@nuklai/hyperchain-sdk'
import { NuklaiSDK } from '@nuklai/nuklai-sdk'

export const initializeSDK = (baseApiUrl: string, blockchainId: string) => {
  return new NuklaiSDK({
    baseApiUrl,
    blockchainId
  })
}

export const fetchHealthStatus = async (
  sdk: NuklaiSDK
): Promise<common.PingResponse> => {
  try {
    const healthStatus = await sdk.rpcService.ping()
    return healthStatus
  } catch (error) {
    console.error('Failed to fetch Health Status:', error)
    throw new Error(`Failed to fetch Health Status: ${error}`)
  }
}

export const fetchNetworkInfo = async (
  sdk: NuklaiSDK
): Promise<common.GetNetworkInfoResponse> => {
  try {
    const networkInfo = await sdk.rpcService.getNetworkInfo()
    return networkInfo
  } catch (error) {
    console.error('Failed to fetch Network Info:', error)
    throw new Error(`Failed to fetch Network Info: ${error}`)
  }
}

export const sendTransferTransaction = async (
  sdk: NuklaiSDK,
  privateKey: string,
  keyType: string,
  receiverAddress: string,
  assetID: string,
  amount: number,
  memo: string
) => {
  try {
    const authFactory = auth.getAuthFactory(
      keyType as auth.AuthType,
      privateKey
    )
    const txID = await sdk.rpcServiceNuklai.sendTransferTransaction(
      receiverAddress,
      assetID,
      amount,
      memo,
      authFactory,
      sdk.rpcService,
      sdk.actionRegistry,
      sdk.authRegistry
    )
    return txID
  } catch (error) {
    console.error('Failed to send transfer transaction:', error)
    throw new Error(`Failed to send transfer transaction: ${error}`)
  }
}

export const sendTransferTransactionViaWebSocket = async (
  sdk: NuklaiSDK,
  privateKey: string,
  keyType: string,
  to: string,
  asset: string,
  amount: number,
  memo: string
): Promise<string> => {
  try {
    const authFactory = auth.getAuthFactory(
      keyType as auth.AuthType,
      privateKey
    )

    await sdk.wsServiceNuklai.connect()

    const txID = await sdk.wsServiceNuklai.sendTransferTransactionAndWait(
      to,
      asset,
      amount,
      memo,
      authFactory,
      sdk.rpcService,
      sdk.actionRegistry,
      sdk.authRegistry
    )

    await sdk.wsServiceNuklai.close()

    return txID
  } catch (error) {
    console.error('Failed to send transfer transaction:', error)
    throw new Error(`Failed to send transfer transaction: ${error}`)
  }
}

export const createAsset = async (
  sdk: NuklaiSDK,
  privateKey: string,
  keyType: string,
  symbol: string,
  decimals: number,
  metadata: string
) => {
  try {
    const authFactory = auth.getAuthFactory(
      keyType as auth.AuthType,
      privateKey
    )
    const { txID, assetID } =
      await sdk.rpcServiceNuklai.sendCreateAssetTransaction(
        symbol,
        decimals,
        metadata,
        authFactory,
        sdk.rpcService,
        sdk.actionRegistry,
        sdk.authRegistry
      )
    return { txID, assetID }
  } catch (error) {
    console.error('Failed to create asset:', error)
    throw new Error(`Failed to create asset: ${error}`)
  }
}

export const mintAsset = async (
  sdk: NuklaiSDK,
  privateKey: string,
  keyType: string,
  receiverAddress: string,
  assetID: string,
  amount: number
) => {
  try {
    const authFactory = auth.getAuthFactory(
      keyType as auth.AuthType,
      privateKey
    )
    const txID = await sdk.rpcServiceNuklai.sendMintAssetTransaction(
      receiverAddress,
      assetID,
      amount,
      authFactory,
      sdk.rpcService,
      sdk.actionRegistry,
      sdk.authRegistry
    )
    return txID
  } catch (error) {
    console.error('Failed to mint asset:', error)
    throw new Error(`Failed to mint asset: ${error}`)
  }
}
