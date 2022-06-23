import { UserChainAccount } from "oreid-js"
import Web3 from "web3"

export const getBalance = async ( account: UserChainAccount | undefined ): Promise<string> => {
    const web3 = new Web3( new Web3.providers.HttpProvider("https://rpc-mumbai.maticvigil.com") )
    const balance = await web3.eth.getBalance( account?.chainAccount || "" ) 
    return balance
}