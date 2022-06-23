import { ChainNetwork, UserChainAccount, UserData } from "oreid-js";
import { useUser } from "oreid-react";
import React, { useEffect, useState } from "react";
import { Button } from "src/Button";
import { getBalance } from "src/helpers/polygon";
import { useOreId } from "oreid-react";


export const UserBalance: React.FC = () => {
    const user: UserData | undefined = useUser()
    const[ userBalance, setUserBalance ] = useState("0.00")
    const oreId = useOreId()
    const account = oreId.auth.user.data.chainAccounts.find(
        (chainAccount) => chainAccount.chainNetwork === ChainNetwork.PolygonMumbai
    )

    // const fetchBalance = async (user: UserData | undefined): Promise<void> => {
    async function fetchBalance( account: UserChainAccount | undefined ) {
        const balance = await getBalance( account )
        setUserBalance( balance )
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
        <h3><b><i>{ userBalance }</i></b> Test Tokens </h3>
        </>
    )

}