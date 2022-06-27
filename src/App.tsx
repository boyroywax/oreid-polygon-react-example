import { OreId } from "oreid-js";
import { OreidProvider, useIsLoggedIn, useUser } from "oreid-react";
import { WebPopup } from "oreid-webpopup";
import React, { useEffect, useState } from "react";

import "./App.css";
import { ExternalWallet } from "./ExternalWallet";
import { Header } from "./Header";
import { LoginPage } from "./LoginPage";
import { Erc20Transfer, TokenTransfer, UserBalance } from "./OreIdWallet";
import { REACT_APP_OREID_APP_ID } from "./constants";
import { Erc1155Transfer } from "./OreIdWallet/Erc1155Transfer";


const transitProviders = [
	require('eos-transit-web3-provider').default()
]

// * Initialize OreId
const oreId = new OreId({
	appName: "Polygon ORE-ID Sample App",
	appId: REACT_APP_OREID_APP_ID,
	oreIdUrl: "https://staging.service.oreid.io",
	plugins: {
		popup: WebPopup(),
	},
	eosTransitWalletProviders: transitProviders
});

const LoggedInView: React.FC = () => {
	const user = useUser();
	if (!user) return null;
	return (
		<>
			<UserBalance />
			<table width="75%">
				<tbody>
					<tr>
						<td align="center">
							<TokenTransfer />
						</td>
						<td align="center">
							<Erc20Transfer />
						</td>
						<td align="center">
							<Erc1155Transfer />
						</td>
					</tr>
				</tbody>
			</table>
			<br />
			<ExternalWallet />
		</>
	)
};

const AppWithProvider: React.FC = () => {
	const isLoggedIn = useIsLoggedIn();
	return (
		<div className="App">
			<Header />
			{isLoggedIn ? <LoggedInView /> : <LoginPage />}
		</div>
	);
};

export const App: React.FC = () => {
	const [oreidReady, setOreidReady] = useState(false);

	useEffect(() => {
		oreId.init().then(() => {
			setOreidReady(true);
		});
	}, []);

	if (!oreidReady) {
		return <>Loading...</>;
	}

	return (
		<OreidProvider oreId={oreId}>
			<AppWithProvider />
		</OreidProvider>
	);
};
