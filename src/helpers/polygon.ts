import { ChainType, Transaction, PluginChainFactory, Models, Chain } from "@open-rights-exchange/chain-js";
import { Plugin as EthereumPlugin , ModelsEthereum} from "@open-rights-exchange/chain-js-plugin-ethereum";
import { toEthereumAddress, toEthereumSymbol, toEthUnit } from "@open-rights-exchange/chain-js-plugin-ethereum/dist/cjs/src/plugin/helpers";
// import { toEthereumAddress, toEthereumSymbol, toEthUnit } from "@open-rights-exchange/chain-js-plugin-ethereum"
// import { ChainActionType, TxExecutionPriority } from "@open-rights-exchange/chainjs/dist/models";
import { UserChainAccount } from "oreid-js"
import Web3 from "web3"
import { Erc1155ApproveParams, Erc1155SafeTransferFromParams, Erc20TransferParams } from "@open-rights-exchange/chain-js-plugin-ethereum/dist/cjs/src/plugin/templates/models";
import { AbiItem } from 'web3-utils';
import { ChainEntityNameBrand } from "@open-rights-exchange/chain-js/dist/cjs/src/models";


const mumbaiEndpoints: Models.ChainEndpoint[] = [
    { url: "https://rpc-mumbai.maticvigil.com/" },
    // { url: "https://rpc-mumbai.matic.today"},
    // { url: "https://polygon-mumbai.g.alchemy.com/v2/AIIX0TtJA0j2FDoo5FzRc_e5766GxIPz"}
]

export const connectChain = async (): Promise<Chain> => {

    const mumbaiChainOptions = {
        chainName: "polygon-mumbai"
    }

    const mumbai: Chain = PluginChainFactory([EthereumPlugin], Models.ChainType.EthereumV1, mumbaiEndpoints, mumbaiChainOptions)

    // connect to the chain
    await mumbai.connect()
    console.log("Connected to polygon mumbai network")
    return mumbai
}

const provider = new Web3.providers.HttpProvider( mumbaiEndpoints[0].url )
const web3 = new Web3( provider )

export const getBalance = async ( account: UserChainAccount | undefined ): Promise<string> => {
    const balance = await web3.eth.getBalance( account?.chainAccount || "" ) 
    const format = web3.utils.fromWei( balance )
    return format
}

// Minimum ABI to get ERC20 Token balance
const minBalanceABI: AbiItem = {    
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
}

export const getTstTokenBalance = async ( account: UserChainAccount | undefined ): Promise<string> => {
    const tokenAddress = "0x2d7882beDcbfDDce29Ba99965dd3cdF7fcB10A1e"; // ERC-20 TST
    const walletAddress = account?.chainAccount

    const contract = new web3.eth.Contract( [minBalanceABI], tokenAddress );
    const result = await contract.methods.balanceOf( walletAddress ).call()

    const format = web3.utils.fromWei( result )
    return format
}

// Minimum ABI to get ERC1155 Token balance
const minErc1155BalanceABI: AbiItem = {    
    constant: true,
    inputs: [{ name: "_owner", type: "address" }, { name: "id", type: "uint256" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
}

export const getNFTTokenBalance = async ( account: UserChainAccount | undefined ): Promise<string> => {
    const tokenAddress = "0xA07e45A987F19E25176c877d98388878622623FA" //ERC-1155
    const tokenId = "123"
    const walletAddress = account?.chainAccount

    const contract = new web3.eth.Contract( [minErc1155BalanceABI], tokenAddress );
    const result = await contract.methods.balanceOf( walletAddress, tokenId ).call()
    console.log( `result: ${result}` )
    return result
}

export const getPendingTxnsByAccount = async ( account: UserChainAccount | undefined ): Promise<{highestTxn: number, pendingTxn: number}> => {
    const pendingTxns = await web3.eth.getPendingTransactions().then((result) => {for (let txn of result) console.log(txn.hash)})
    const highestNonceExecuted = await web3.eth.getTransactionCount(account?.chainAccount || "", 'latest')
    const highestNoncePending = await web3.eth.getTransactionCount(account?.chainAccount || "", 'pending')
    console.log('last nonce executed: ', highestNonceExecuted)
    console.log('highest nonce pending: ', highestNoncePending)
    // const cancelationTrx = {
    //   from: account?.chainAccount,
    //   to: account?.chainAccount,
    //   amount: 0,
    //   nonce: highestNonceExecuted + 1
    // }
    return {
        highestTxn: highestNonceExecuted,
        pendingTxn: highestNoncePending - highestNonceExecuted
    }
    //     for (let txn in pendingTxns) {
//         console.log( `Pending txn: ${txn}`)
// }
}

export const getGasFees = async () => {
    const mumbai: Chain = await connectChain()
    const chainInfo = await mumbai.chainInfo.nativeInfo
    console.log(chainInfo)
    return chainInfo
}

// 
// Creat transaction using chainjs
// 
export const createErc20TstTransferTxn = async ( account: UserChainAccount | undefined, toAddress: string, value: string ): Promise<Transaction> => {
    const mumbai = await connectChain()

    // construct eth transfer transaction 
    const transactionBody: Transaction = await mumbai.new.Transaction({
        maxFeeIncreasePercentage: 200.00
    })

    const composeErc20TstTransferParams: Erc20TransferParams = {
        contractAddress: toEthereumAddress("0x2d7882beDcbfDDce29Ba99965dd3cdF7fcB10A1e"),
        to: toEthereumAddress(toAddress),
        from:  toEthereumAddress(account?.chainAccount || ""),
        value: value,
        precision: 18
    }

    const action = await mumbai.composeAction(
        ModelsEthereum.EthereumChainActionType.ERC20Transfer,
        composeErc20TstTransferParams
    )

    console.log( `actions: ${JSON.stringify(action)}`)
    

    transactionBody.actions = [action]

    console.log(await mumbai.decomposeAction(action))

    await transactionBody.prepareToBeSigned()
    await transactionBody.validate()

    // console.log( `New Transaction: ${( await transactionBody.getSuggestedFee(TxExecutionPriority.Average) )}` )

    return transactionBody
}

export const approveErc1155Token = async ( account: UserChainAccount | undefined ): Promise<Transaction> => {
    const mumbai = await connectChain()

    const transactionBody = await mumbai.new.Transaction({
        maxFeeIncreasePercentage: 200.0
    })

    const composeApproveParams: Erc1155ApproveParams = {
        contractAddress: toEthereumAddress("0xA07e45A987F19E25176c877d98388878622623FA"),
        to: toEthereumAddress(account?.chainAccount || ""),
        tokenId: 123,
        quantity: 1
    }

    transactionBody.actions = [ await mumbai.composeAction(
        ModelsEthereum.EthereumChainActionType.ERC1155Approve,
        composeApproveParams
    )]

    await transactionBody.prepareToBeSigned()
    await transactionBody.validate()

    // console.log( `New Transaction: ${( await transactionBody.getSuggestedFee(TxExecutionPriority.Average) )}` )

    return transactionBody
}

export const createErc1155TransferTxn = async ( account: UserChainAccount | undefined, toAddress: string, value: string ): Promise<Transaction> => {
    const mumbai = await connectChain()

    // construct eth transfer transaction 
    const transactionBody = await mumbai.new.Transaction({
        maxFeeIncreasePercentage: 200.00
    })

    const composeErc1155Params: Erc1155SafeTransferFromParams =    {
        contractAddress: toEthereumAddress("0xA07e45A987F19E25176c877d98388878622623FA"),
        from: toEthereumAddress(account?.chainAccount || ""),
        transferFrom:  toEthereumAddress(account?.chainAccount || ""),
        to: toEthereumAddress(toAddress),
        tokenId: 123,
        quantity: 1,
        // symbol: toEthereumSymbol("ERC1155"),
        // memo: "Test Polygon token transfer",
        // data: 0
    }

    transactionBody.actions = [ await mumbai.composeAction(
        ModelsEthereum.EthereumChainActionType.ERC1155SafeTransferFrom,
        composeErc1155Params
    )]

    console.log( `actions: ${JSON.stringify(transactionBody.actions)}`)

    await transactionBody.prepareToBeSigned()
    // await transactionBody.validate()

    // console.log( `New Transaction: ${( await transactionBody.getSuggestedFee(TxExecutionPriority.Average) )}` )

    return transactionBody
}