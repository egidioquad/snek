"use client"

import React, { useState } from "react";
import { getAddress, signTransaction, signMessage } from "sats-connect";

class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			paymentAddress: "",
			paymentPublicKey: "",
			ordinalsAddress: "",
			ordinalsPublicKey: "",
			isConnected: false, // Added isConnected state
		};
	}

	onConnectClick = async () => {
		const getAddressOptions = {
			payload: {
				purposes: ["ordinals", "payment"],
				message: "Address for receiving Ordinals",
				network: {
					type: "Mainnet",
				},
			},
			onFinish: async (response) => {
				this.setState({
					ordinalsAddress: response.addresses[0].address,
					paymentAddress: response.addresses[1].address,
					isConnected: true, // Set isConnected to true when connected
				}, async () => {
					const btcAddress = this.state.paymentAddress;
					try {
						console.log("TRY GET"); //
						const userResponse = await fetch(`/api/userDatas/${btcAddress}`, {
							method: 'GET',

						});
						console.log("after GET");
						if (!userResponse.ok) {
							if (userResponse.status === 404) {
								const highscore = 0; // Set initial highscore to 0
								const postResponse = await fetch(`/pages/api/userDatas/`, {
									method: 'POST',
									headers: {
										'Content-Type': 'application/json',
									},
									body: JSON.stringify({ btcAddress, highscore }),
								});
								if (!postResponse.ok) {
									console.log("trow error");
									throw new Error(`Error: ${postResponse.status}`);
								}
								console.log('POST function called');
								return;
							}
							throw new Error(`ErrorEE: ${userResponse.status}`);
						}
						const user = await userResponse.json();
						console.log('User:', user);
						// Load user data
						console.log("krarka");
						this.setState({
							highscore: user.highscore,
						});
					}
					catch (error) {
						console.log("catch error");
						console.error("Error fetching user data:", error);
					}
				});
			},
			onCancel: () => alert("Request canceled"),
		};
		console.log("mashallah");
		await getAddress(getAddressOptions);
		console.log("mashallah");
	};



	render() {
		return (
			<div >

				<div>
					<br />
					{this.state.paymentAddress && (
						<div>Payment Address: {this.state.paymentAddress}</div>
					)}
					{this.state.ordinalsAddress && (
						<div>Ordinals Address: {this.state.ordinalsAddress}</div>
					)}

					<div>
						<button
							className="connectButton"
							onClick={this.onConnectClick}
						>
							Connect wallet
						</button>
					</div>


					<br />
				</div>
			</div>
		);
	}
}

export default Dashboard;

/* However, in your code, it looks like you're trying to import and call these functions
 directly from your client-side code. This won't work because 
the server-side code runs in a different environment and can't be directly called from the client-side.*/