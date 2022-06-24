import { ChainFactory, ChainType, Transaction } from "@open-rights-exchange/chainjs";
import { UserChainAccount } from "oreid-js"
import Web3 from "web3"
import { AbiItem } from 'web3-utils';


const mumbaiEndpoints = [{ url: "https://rpc-mumbai.maticvigil.com" }]
const provider = new Web3.providers.HttpProvider( mumbaiEndpoints[0].url )
const web3 = new Web3( provider )

export const getBalance = async ( account: UserChainAccount | undefined ): Promise<string> => {
    const balance = await web3.eth.getBalance( account?.chainAccount || "" ) 
    const format = web3.utils.fromWei( balance )
    return format
}

// The minimum ABI to get ERC20 Token balance
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

// The minimum ABI to get ERC1155 Token balance
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


export const createTransferTransaction = async ( account: UserChainAccount | undefined, toAddress: string, value: string ): Promise<Transaction> => {
    const mumbaiChainOptions = {
        chainName: "mumbai"
    }

    const mumbai = new ChainFactory().create(ChainType.EthereumV1, mumbaiEndpoints, {
        chainForkType: mumbaiChainOptions
    })

    // connect to the chain
    await mumbai.connect()
    console.log("Connected to polygon mumbai network")

    // construct eth transfer transaction 
    const transactionBody = await mumbai.new.Transaction()

    transactionBody.actions = [{
        // from: account?.chainAccount || "",
        to: toAddress,
        value: value,
    }]

    return transactionBody
}