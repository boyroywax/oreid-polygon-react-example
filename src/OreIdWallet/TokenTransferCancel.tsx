import React, { useState, useEffect } from "react";
import { useOreId, useUser } from "oreid-react";

import { Button } from "src/Button";
import { Transaction, UserChainAccount } from "oreid-js";
import { getChainAccount } from "src/helpers/user";
import { getGasFees, getPendingTxnsByAccount } from "src/helpers";
// import { toEthUnit } from "@open-rights-exchange/chain-js-plugin-ethereum/dist/cjs/src/plugin/helpers";
// import { ChainInfo } from "@open-rights-exchange/chain-js/dist/cjs/src/models";


export const TokenTransferCancel: React.FC = () => {
    // const [ amount, setAmount ] = useState("0.00")
    // const [ toAddress, setToAddress ] = useState("Null")
    const [ highestTxnNonce, setHighestTxnNonce ] = useState(0)
    const [ pendingNonce, setPendingNonce ] = useState(0)
    const [ gasLimit, setGasLimit ] = useState(0)
    const [ gasPrice, setGasPrice ] = useState(0)
    const userData = useUser();
    const oreId = useOreId();
    const polygonChainType = 'polygon_mumbai'


    async function prepareTxn() {

        if (!userData) return null;

        const signingAccount: UserChainAccount | undefined = getChainAccount(
            userData
        )
        if (!signingAccount) {
            return
        } 
        
        const { highestTxn, pendingTxn } = await getPendingTxnsByAccount(signingAccount)
        setHighestTxnNonce( highestTxn )
        setPendingNonce( pendingTxn - highestTxn )

        const gasFees = await getGasFees()
        setGasLimit(gasFees.gasLimit)
        setGasPrice(gasFees.currentGasPrice * 3)


    }

    useEffect( () => {
        prepareTxn()
        
    })

    const handleSign = async () => {

        if (!userData) return null;

        const signingAccount: UserChainAccount | undefined = getChainAccount(
            userData
        )
        if (!signingAccount) {
            return
        } 

        const transactionBody = {
            actions: [{
                from: signingAccount.chainAccount,
                to: signingAccount.chainAccount,
                value: 0,
                nonce: highestTxnNonce + 1,
                gasPrice: gasPrice,
                gasLimit: gasLimit
            }]
        }

        console.log( `Token Transfer Cancel Transaction Body: ${JSON.stringify(transactionBody.actions)}` )

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

        const pendingTxns = await getPendingTxnsByAccount( signingAccount )
        console.log( `pendingTxns: ${pendingNonce}` )

        oreId.popup
            .sign({ transaction })
            .then((result: any) => {
                console.log( `result: ${JSON.stringify(result)}`)
            })
            // .finally(() =>  ))
    }

    return (
        <>
        <div style={{ marginTop: 10, marginBottom: 20 }}>
            <div className="App-button">
                <Button
                    onClick={() => handleSign()}
                > Cancel last transfer {pendingNonce})
                </Button>
            </div>
        </div>
        </>
    )
}