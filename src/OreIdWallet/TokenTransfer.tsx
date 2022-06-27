import React, { useState } from "react";
import { useOreId, useUser } from "oreid-react";

import { Button } from "src/Button";
import { Transaction } from "oreid-js";


export const TokenTransfer: React.FC = () => {
    const [ amount, setAmount ] = useState("0.00")
    const [ toAddress, setToAddress ] = useState("Null")
    const userData = useUser();
    const oreId = useOreId();
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
            actions: [{
                from: signingAccount.chainAccount,
                to: toAddress,
                value: amount
            }]
        }

        const transaction: Transaction = await oreId.createTransaction({
            chainAccount: signingAccount.chainAccount,
            chainNetwork: signingAccount.chainNetwork,
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
                console.log( `result: ${result}`)
            })
            .finally(() => console.log( `txnid: ${transaction.data.transactionRecordId}` ))
    }

    return (
        <>
        <div style={{ marginTop: 10, marginBottom: 20 }}>
            <h2>Transfer MATIC</h2>
            <div className="input-wrapper">
                <div>
                    Amount
                    <br />
                    <input 
                        name="amount"
                        onChange={(e) => {
                            e.preventDefault();
                            setAmount(e.target.value);
                        }} id={amount}></input>
                </div>
                <br />
                <div>
                    Recipient
                    <br />
                    <input 
                        name="toAddress"
                        onChange={(e) => {
                            e.preventDefault();
                            setToAddress(e.target.value);
                        }} id={toAddress}></input>
                </div>
            </div>
            <br />
            <div className="App-button">
                <Button
                    onClick={() => handleSign()}
                > Send MATIC 
                </Button>
            </div>
        </div>
        </>
    )
}