"use client"

import React, { useState, useEffect } from "react";
import { getAddress, signTransaction, signMessage } from "sats-connect";
import { useRouter } from "next/navigation";
import { useAppContext } from './AppContext';

const Dashboard = () => {
	const { updateBtcAddress, updateUserHighscore } = useAppContext();
	const [state, setState] = useState({
		paymentAddress: "",
		paymentPublicKey: "",
		ordinalsAddress: "",
		ordinalsPublicKey: "",
		isConnected: false, // Added isConnected state
	});

	const onConnectClick = async () => {
		const getAddressOptions = {
			payload: {
				purposes: ["ordinals", "payment"],
				message: "Address for receiving Ordinals",
				network: {
					type: "Mainnet",
				},
			},
			onFinish: async (response) => {
				setState({
					ordinalsAddress: response.addresses[0].address,
					paymentAddress: response.addresses[1].address,
					isConnected: true, // Set isConnected to true when connected
				});
			},
			onCancel: () => alert("Request canceled"),
		};
		await getAddress(getAddressOptions);
	};

	useEffect(() => {
		const btcAddress = state.paymentAddress;
		if (btcAddress) {
			updateBtcAddress(btcAddress);
			const fetchUserData = async () => {
				try {
					const userResponse = await fetch(`/api/userDatas/${btcAddress}/btcAddress`, {
						method: 'GET',
						cache: "no-store"
					});
					if (!userResponse.ok) {
						if (userResponse.status === 404) {
							const highscore = 0; // Set initial highscore to 0
							const postResponse = await fetch(`/api/userDatas/route`, {
								method: 'POST',
								headers: {
									'Content-Type': 'application/json',
								},
								body: JSON.stringify({ btcAddress, highscore }),
							});
							if (!postResponse.ok) {
								throw new Error(`Error: ${postResponse.status}`);
							}
							return;
						}
						throw new Error(`ErrorEE: ${userResponse.status}`);
					}
					const user = await userResponse.json();
					updateUserHighscore(user.highscore);
				}
				catch (error) {
					console.error("Error fetching user data:", error);
				}
			};
			fetchUserData();
		}
	}, [state.paymentAddress]);

	return (
		<div>
			<div>
				<br />
				{state.paymentAddress && (
					<div>Payment Address: {state.paymentAddress}</div>
				)}
				{state.ordinalsAddress && (
					<div>Ordinals Address: {state.ordinalsAddress}</div>
				)}

				<div>
					<button
						className="connectButton"
						onClick={onConnectClick}
					>
						Connect wallet
					</button>
				</div>

				<br />
			</div>
		</div>
	);
}

export default Dashboard;
