import { HyperchainSDK, auth, common, utils } from '@nuklai/hyperchain-sdk'
import { NuklaiSDK, actions, common as commonNuklai } from '@nuklai/nuklai-sdk'

export const initializeSDK = (baseApiUrl: string, blockchainId: string) => {
  return new NuklaiSDK({
    baseApiUrl,
    blockchainId
  })
}

export const initializeSDKHyper = (
  baseApiUrl: string,
  blockchainId: string
) => {
  return new HyperchainSDK({
    baseApiUrl,
    blockchainId
  })
}

export const fetchHealthStatus = async (
  sdk: HyperchainSDK
): Promise<common.PingResponse> => {
  try {
    const healthStatus = await sdk.rpcService.ping()
    return healthStatus
  } catch (error) {
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
    throw new Error(`Failed to fetch Network Info: ${error}`)
  }
}

export const sendTransferTransaction = async (
  sdk: NuklaiSDK,
  privateKey: string,
  keyType: string,
  to: string,
  asset: string,
  amount: number,
  memo: string
) => {
  try {
    console.log('hereeee')
    const authFactory = auth.getAuthFactory(
      keyType as auth.AuthType,
      privateKey
    )

    console.log('authFactory', authFactory)
    // Generate the from address using the private key
    const fromAddress = authFactory.sign(new Uint8Array(0)).address()

    const decimals = 9
    const amountInUnits = utils.parseBalance(amount, decimals)

    // Fetch the balance to ensure sufficient funds
    const balanceResponse = await sdk.rpcServiceNuklai.getBalance({
      address: fromAddress.toString(),
      asset
    } as commonNuklai.GetBalanceParams)
    console.log('balanceResponse', balanceResponse)
    if (utils.parseBalance(balanceResponse.amount, decimals) < amountInUnits) {
      throw new Error('Insufficient balance')
    }

    const transfer = new actions.Transfer(to, asset, amountInUnits, memo)
    console.log('transfer', transfer)

    const genesisInfo = await sdk.rpcServiceNuklai.getGenesisInfo()
    const { submit, txSigned, err } = await sdk.rpcService.generateTransaction(
      genesisInfo.genesis,
      sdk.actionRegistry,
      sdk.authRegistry,
      [transfer],
      authFactory
    )
    if (err) {
      throw err
    }

    await submit()

    return txSigned.id().toString()
  } catch (error) {
    throw new Error(`Failed to send transfer transaction: ${error}`)
  }
}
