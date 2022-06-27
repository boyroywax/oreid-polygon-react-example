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

    const account = oreId.auth.user.data.chainAccounts.find(
        (chainAccount) => chainAccount.chainNetwork === ChainNetwork.PolygonMumbai
    )
    
    // 
    // Sign String with MetMask Wallet
    // 
    const signStringParam: SignStringParams = {
		account: user?.accountName || "",
		walletType: ExternalWalletType.Web3,
		chainAccount: account?.chainAccount || "",
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
    // Discover MetMask Wallet
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
    // Popup Login MetMask
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
    // Popup Sign MetMask
    // 
    const transactionSignOptions: TransactionSignOptions = {
        preventAutosign: true,
        broadcast: false,
        provider: AuthProvider.Web3,
        signExternalWithOreId: true
    }

    const transactionData: TransactionData = {
        account: user?.accountName,
        chainAccount: account?.chainAccount || "",
        chainNetwork: ChainNetwork.PolygonMumbai,
        transaction: {
            account: account?.chainAccount || "",	
            string: "Linking Account to ORE ID",
		    message: "Testing"
        },
        signOptions: transactionSignOptions
    }

    const transaction = async () => {
       const transaction: Transaction = await oreId.createTransaction( transactionData )
       return transaction
    }

    const loginSignWithWallet = async () => {
        const signTransaction: Transaction = await transaction()
        try {
            const popupSignParams: PopupPluginSignParams = {
                transaction: signTransaction
            }

            await oreId.popup.sign( popupSignParams )
                .catch( (error) => console.error(error))
        }
        catch (error) {
            console.error( `loginSignWithWallet failed: ${error}` )
        }
    }

    return (
        <div>
            <h2>External Wallet</h2>
            <br />
                <Button
                    onClick={() => {
                        discoverWallet()
                    }
                }>
                    Discover MetaMask
                </Button> <Button
                    onClick={() => {
                        signStringWithWallet()
                    }
                }>
                    Sign String MetaMask
                </Button> <Button
                    onClick={() => {
                        loginAuthWithWallet()
                    }
                }>
                    Popup Login MetaMask
                </Button> <Button
                    onClick={() => {
                        loginSignWithWallet()
                    }
                }>
                    Popup Sign MetaMask
                </Button>

        </div>
    )
}