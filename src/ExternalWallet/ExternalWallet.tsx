import React from "react"
import { useOreId, useUser } from "oreid-react"
import { AuthProvider,
    ChainNetwork,
    ExternalWalletType,
    PopupPluginAuthParams,
    PopupPluginSignParams,
    SignStringParams,
    Transaction,
    TransactionData,
    TransactionSignOptions } from "oreid-js"
import { Button } from "src/Button"

export const ExternalWallet: React.FC = () => {

    const oreId = useOreId()
    const user = useUser()
    
    // 
    // Sign String with Scatter Wallet
    // 
    const signStringParam: SignStringParams = {
		account: user?.accountName || "",
		walletType: ExternalWalletType.Web3,
		chainAccount: user?.accountName || "",
		chainNetwork: ChainNetwork.PolygonMumbai,
		string: "Linking Account to ORE ID",
		message: "Testing"
	}

    const signStringWithWallet = async () => {
		try {
			const signedString = await oreId.signStringWithWallet(
				signStringParam
			)
			console.log(signedString)
		}
		catch (error) {
			console.error( `SignStringWithWallet: ${error}` )
		}
	}

    // 
    // Discover Scatter Wallet
    // 
    const discoverWallet = () => {
        try {
            const status = oreId.geExternalWalletInfo( signStringParam.walletType )
            console.log( `Wallet status: ${JSON.stringify(status)}` )
        }
        catch (error) {
            console.error( `discoverWallet failed: ${error}` )
        }
    }

    // 
    // Popup Login Scatter
    // 
    const popupAuthParams: PopupPluginAuthParams = {
        provider: AuthProvider.Web3
    }

    const loginAuthWithWallet = async() => {
        try {
            const status = await oreId.popup.auth( popupAuthParams )
            console.log( `loginAuthWithWallet: ${status}`)
        }
        catch (error) {
            console.error( `loginAuthWithWallet failed: ${error}` )
        }
    }

    // 
    // Popup Sign Scatter
    // 
    const transactionSignOptions: TransactionSignOptions = {
        preventAutosign: true,
        broadcast: false,
        provider: AuthProvider.Web3,
        signExternalWithOreId: true
    }

    const transactionData: TransactionData = {
        account: user?.accountName,
        chainAccount: user?.accountName || "",
        chainNetwork: ChainNetwork.PolygonMumbai,
        transaction: {
            account: user?.accountName || "",	
            string: "Linking Account to ORE ID",
		    message: "Testing"
        },
        signOptions: transactionSignOptions
    }

    const transaction = async () => {
       const transaction: Transaction = await oreId.createTransaction( transactionData )
       return transaction as Transaction
    }


    const loginSignWithWallet = async () => {
        try {
            const popupSignParams: PopupPluginSignParams = {
                transaction: await transaction()
            }

            await oreId.popup.sign( popupSignParams )
                .catch( (error) => console.error(error))
        }
        catch (error) {
            console.error( `discoverWallet failed: ${error}` )
        }
    }

    return (
        <div>
            <h2>External ORE Wallet</h2>
            <br />
                <Button
                    onClick={() => {
                        discoverWallet()
                    }
                }>
                    Discover Scatter
                </Button> <Button
                    onClick={() => {
                        signStringWithWallet()
                    }
                }>
                    Sign String Scatter
                </Button> <Button
                    onClick={() => {
                        loginAuthWithWallet()
                    }
                }>
                    Popup Login Scatter
                </Button> <Button
                    onClick={() => {
                        loginSignWithWallet()
                    }
                }>
                    Popup Sign Scatter
                </Button>

        </div>
    )
}