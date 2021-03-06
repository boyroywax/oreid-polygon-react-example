import React, { useState } from "react";
import { useOreId, useUser } from "oreid-react";

import { Button } from "src/Button";
import { ChainNetwork, Transaction, UserChainAccount } from "oreid-js";
import { createErc1155TransferTxn } from "src/helpers";
import { getChainAccount } from "src/helpers/user";


export const Erc1155Transfer: React.FC = () => {
    const [ erc1155Amount, setErc1155Amount ] = useState("0.00")
    const [ erc1155Recipient, setErc1155Recipient ] = useState("Null")
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

        const transactionBody = await createErc1155TransferTxn(
            signingAccount,
            erc1155Recipient,
            erc1155Amount
        )

        console.log( `ERC1155 Transaction Body: ${JSON.stringify(transactionBody.actions)}` )

        const transaction: Transaction = await oreId.createTransaction({
            chainAccount: signingAccount.chainAccount,
            chainNetwork: ChainNetwork.PolygonMumbai,
            //@ts-ignore
            transaction: transactionBody.actions[0],
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
            <h2>Transfer ERC-1155 Token</h2>
            <div className="input-wrapper">
                <div>
                    Amount
                    <br />
                    <input 
                        name="amount"
                        onChange={(e) => {
                            e.preventDefault();
                            setErc1155Amount(e.target.value);
                        }} id={erc1155Amount}></input>
                </div>
                <br />
                <div>
                    Recipient
                    <br />
                    <input 
                        name="recipient"
                        onChange={(e) => {
                            e.preventDefault();
                            setErc1155Recipient(e.target.value);
                        }} id={erc1155Recipient}></input>
                </div>
            </div>
            <br />
            <div className="App-button">
                <Button
                    onClick={() => handleSign()}
                > Send NFT
                </Button>
            </div>
        </div>
        </>
    )
}