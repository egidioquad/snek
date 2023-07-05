import "../styles.css";
import React, { useEffect, useState } from "react";

interface UserData {
	btcAddress: string;
	highscore: number;
}

const getUserDatas = async (): Promise<{ userDatas: UserData[] }> => {
	try {
		const res = await fetch("http://localhost:3000/api/userDatas/", {
			cache: "no-store",
		});

		if (!res.ok) {
			throw new Error("Failed to fetch userDatas");
		}
		console.log(res);
		return res.json();
	} catch (error) {
		console.log("Error loading userDatas: ", error);
		return { userDatas: [] };
	}
};

export default async function Leaderboard() {
	const { userDatas } = await getUserDatas();

	return (
		<>
			<h1>Leaderboard</h1>
			<table>ordinalsnake
				<thead>
					<tr>
						<th>Position</th>
						<th>BTC Address</th>
						<th>Highscore</th>
					</tr>
				</thead>
				<tbody>
					{userDatas && userDatas.map((userData) => (
						<tr key={userData.btcAddress}>
							<td>{userData.btcAddress}</td>
							<td>{userData.highscore}</td>
						</tr>
					))}
				</tbody>
			</table>
		</>
	);
}
