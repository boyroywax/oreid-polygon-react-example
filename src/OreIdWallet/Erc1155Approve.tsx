import React, { useState } from "react";
import { useOreId, useUser } from "oreid-react";

import { Button } from "src/Button";
import { ChainNetwork, Transaction, UserChainAccount } from "oreid-js";
import { approveErc1155Token, createErc1155TransferTxn } from "src/helpers";
import { getChainAccount } from "src/helpers/user";


export const Erc1155Approve: React.FC = () => {
    const userData = useUser()
    const oreId = useOreId()

    if (!userData) return null;

    const handleSign = async () => {
        const signingAccount: UserChainAccount | undefined = getChainAccount(
            userData
        )
        if (!signingAccount) {
            return
        }

        const transactionBody = await approveErc1155Token(
            signingAccount
        )

        console.log( `ERC1155 Transaction Body: ${JSON.stringify(transactionBody.actions)}` )

        const transaction: Transaction = await oreId.createTransaction({
            chainAccount: signingAccount.chainAccount,
            chainNetwork: ChainNetwork.PolygonMumbai,
            //@ts-ignore
            transaction: transactionBody.actions,
            signOptions: {
                broadcast: true,
                returnSignedTransaction: false,
            },
        })

        oreId.popup
            .sign({ transaction })
            .then((result: any) => {
                console.log( `result: ${result}`)
            })
    }

    return (
        <>
        <div style={{ marginTop: 10, marginBottom: 20 }}>
            <div className="App-button">
                <Button
                    onClick={() => handleSign()}
                > Approve NFT
                </Button>
            </div>
        </div>
        </>
    )
}