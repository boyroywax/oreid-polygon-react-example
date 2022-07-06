import { UserChainAccount, UserData } from "oreid-js"


const polygonChainType = 'polygon_mumbai'

export const getChainAccount = ( userData: UserData ): UserChainAccount | undefined => {
    const signingAccount: UserChainAccount | undefined = userData.chainAccounts.find(
        (ca) => ca.chainNetwork === polygonChainType
    )
    
    if (!signingAccount) {
        console.error(
            `User doesn not have any accounts on ${polygonChainType}`
        )
        return
    }

    return signingAccount
}

