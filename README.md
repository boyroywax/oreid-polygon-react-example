## Overview

This example demonstrates the basics of using the ORE ID

- Initializing the oreid-js library with your app's appId
- How to use oreid-webwidget
- Handling the login flow
- Signing a transaction flow
  <br><br>

To install project dependencies use:

```
yarn install
```

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app)

    yarn start

Runs the app in the development mode.
Open http://localhost:3000 to view it in the browser.

The page will reload if you make edits.

Note: Due to a bug in Create React App 5 - use 'GENERATE_SOURCEMAP=false react-scripts start' to start the app or you may see errors 'Failed to parse source map...'


# oreid-polygon-react-example

```javascript
// Transaction body which sets manual gasPrice and gasLimit
```

```javascript
// Transaction body that cancels a pending transaction
```

```javascript
// Call to retrieve the current gas fees from the Polygon blockchain using chain-js

import { ChainType, Transaction, PluginChainFactory, Models, Chain } from "@open-rights-exchange/chain-js";
import { Plugin as EthereumPlugin , ModelsEthereum} from "@open-rights-exchange/chain-js-plugin-ethereum";


const mumbaiEndpoints: Models.ChainEndpoint[] = [
    { url: "https://rpc-mumbai.maticvigil.com/" },
    // { url: "https://rpc-mumbai.matic.today"},
    // { url: "https://polygon-mumbai.g.alchemy.com/v2/AIIX0TtJA0j2FDoo5FzRc_e5766GxIPz"}
]

const mumbaiChainOptions = {
    chainName: "polygon-mumbai"
}

const mumbai: Chain = PluginChainFactory([EthereumPlugin], Models.ChainType.EthereumV1, mumbaiEndpoints, mumbaiChainOptions)

// connect to the chain
await mumbai.connect()
console.log("Connected to polygon mumbai network")

const chainInfo = await mumbai.chainInfo.nativeInfo
console.log(chainInfo)

```