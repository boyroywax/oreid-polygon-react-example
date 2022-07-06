import React, { useState } from "react";
import { ChainNetwork, UserChainAccount, Transaction } from "oreid-js";
import { useOreId, useUser } from "oreid-react";

import { Button } from "src/Button";
import { createErc20TstTransferTxn } from "src/helpers";
import { getChainAccount } from "src/helpers/user";


export const Erc20Transfer: React.FC = () => {
    const [ erc20Amount, setErc20Amount ] = useState("0.00")
    const [ recipient, setRecipient ] = useState("Null")
    const userData = useUser();
    const oreId = useOreId();
    const polygonChainType = 'polygon_mumbai'

    if (!userData) return null;

    const handleSign = async () => {
        const signingAccount: UserChainAccount | undefined = getChainAccount(
                userData
            )
        if (!signingAccount) {
            return
        } 

        console.log( `recipient: ${recipient} \n amount: ${erc20Amount}`)
        
        const transactionBody = await createErc20TstTransferTxn(
            signingAccount,
            recipient,
            erc20Amount
        )
        // console.log( `ERC20 Transaction Body: ${JSON.stringify(transactionBody.actions)} `)
        console.log( `ERC20 Transaction Body: ${JSON.stringify(transactionBody.actions)}` )

        // const transactionBody = {
        //     "contractName": "0x2d7882beDcbfDDce29Ba99965dd3cdF7fcB10A1e",
        //     "contractAction": "transfer",
        //     "actions": [{
        //         // "from": signingAccount.chainAccount,
        //         "to": recipient,
        //         "amount": erc20Amount,
        //     }]
        // }

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
                console.log( `result: ${JSON.stringify(result)}` )
            })
    }

    return (
        <>
        <div style={{ marginTop: 10, marginBottom: 20 }}>
            <h2>Transfer TST Token (ERC-20)</h2>
            <div className="input-wrapper">
                <div>
                    Amount
                    <br />
                    <input 
                        name="erc20Amount"
                        onChange={(e) => {
                            e.preventDefault();
                            setErc20Amount(e.target.value);
                        }} id={erc20Amount}></input>
                </div>
                <br />
                <div>
                    Recipient
                    <br />
                    <input 
                        name="recipient"
                        onChange={(e) => {
                            e.preventDefault();
                            setRecipient(e.target.value);
                        }} id={recipient}></input>
                </div>
            </div>
            <br />
            <div className="App-button">
                <Button
                    onClick={() => handleSign()}
                > Send TST Token 
                </Button>
            </div>
        </div>
        </>
    )
}