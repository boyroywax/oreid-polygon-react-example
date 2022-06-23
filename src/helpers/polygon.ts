import { User, UserChainAccount } from "oreid-js"
import Web3 from "web3"
import { AbiItem } from 'web3-utils';


const provider = new Web3.providers.HttpProvider("https://rpc-mumbai.maticvigil.com")
const web3 = new Web3( provider )

export const getBalance = async ( account: UserChainAccount | undefined ): Promise<string> => {
    const balance = await web3.eth.getBalance( account?.chainAccount || "" ) 
    const format = web3.utils.fromWei( balance )
    return format
}

// The minimum ABI to get ERC20 Token balance
const minABI: AbiItem = {    
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
}

export const getTstTokenBalance = async ( account: UserChainAccount | undefined ): Promise<string> => {
    const tokenAddress = "0x2d7882beDcbfDDce29Ba99965dd3cdF7fcB10A1e";
    const walletAddress = account?.chainAccount

    const contract = new web3.eth.Contract([minABI], tokenAddress);
    const result = await contract.methods.balanceOf(walletAddress).call()

    const format = web3.utils.fromWei(result)
    console.log(format)
    return format
    
}