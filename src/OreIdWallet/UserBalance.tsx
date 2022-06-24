import { ChainNetwork, UserChainAccount, UserData } from "oreid-js";
import { useUser } from "oreid-react";
import React, { useEffect, useState } from "react";
import { Button } from "src/Button";
import { getBalance, getNFTTokenBalance, getTstTokenBalance } from "src/helpers/polygon";
import { useOreId } from "oreid-react";


export const UserBalance: React.FC = () => {
    const user: UserData | undefined = useUser()
    const[ userBalance, setUserBalance ] = useState("0.00")
    const[ userTstBalance, setUserTstBalance ] = useState("0.00")
    const[ userNftBalance, setUserNftBalance ] = useState("0")

    const oreId = useOreId()
    const account = oreId.auth.user.data.chainAccounts.find(
        (chainAccount) => chainAccount.chainNetwork === ChainNetwork.PolygonMumbai
    )

    // const fetchBalance = async (user: UserData | undefined): Promise<void> => {
    async function fetchBalance( account: UserChainAccount | undefined ) {
        const balance = await getBalance( account )
        setUserBalance( balance )

        const tstBalance = await getTstTokenBalance( account )
        setUserTstBalance( tstBalance )

        const nftBalance = await getNFTTokenBalance( account )
        setUserNftBalance( nftBalance )
    } 

    useEffect(() => {
        fetchBalance( account )
    })

    return (
        <>
        <h2>{ user?.accountName } Testnet Balance</h2>
        <Button
            onClick={() => fetchBalance( account )}
        >
            Update Balance
        </Button>
        <h2>{ account?.chainAccount }</h2>
        <h3>{ account?.chainNetwork }</h3>
        <h3><b><i>{ userBalance }</i></b> MATIC Test Tokens</h3>
        <h3><b><i>{ userTstBalance }</i></b> TST Test Tokens</h3>
        <h3><b><i>{ userNftBalance }</i></b> NFTs</h3>
        </>
    )
}