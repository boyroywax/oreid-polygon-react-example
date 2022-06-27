import React, { useState } from "react";
import { useOreId, useUser } from "oreid-react";

import { Button } from "src/Button";
import { ChainNetwork } from "oreid-js";


export const Erc1155Transfer: React.FC = () => {
    const [ erc1155Amount, setErc1155Amount ] = useState("0.00")
    const [ erc1155Recipient, setErc1155Recipient ] = useState("Null")
    const userData = useUser()
    const oreId = useOreId()
    const polygonChainType = 'polygon_mumbai'

    if (!userData) return null;

    const handleSign = async () => {
        const signingAccount = userData.chainAccounts.find(
            (ca) => ca.chainNetwork === polygonChainType
        )

        if (!signingAccount) {
            console.error(
                `User doesn not have any accounts on ${polygonChainType}`
            )
            return
        }

        const transactionBody = {
            "contractName": "0xA07e45A987F19E25176c877d98388878622623FA",
            "contractAction": "safeTransferFrom",
            "actions": [{
                "from": signingAccount.chainAccount,
                "to": erc1155Recipient,
                "id": "123",
                "amount": erc1155Amount,
                "data": 0
            }]
        }

        const transaction = await oreId.createTransaction({
            chainAccount: signingAccount.chainAccount,
            chainNetwork: ChainNetwork.PolygonMumbai,
            //@ts-ignore
            transaction: transactionBody,
            signOptions: {
                broadcast: true,
                returnSignedTransaction: false,
            },
        })

        oreId.popup
            .sign({ transaction })
            .then((result: any) => {
                console.log( `result: ${JSON.stringify( result )}`)
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