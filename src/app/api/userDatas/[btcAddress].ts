import connectMongoDB from "@/libs/mongodb";
import UserData from "@/models/UserData";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		await connectMongoDB();

		console.log('Request method:', req.method);
		console.log('Request query:', req.query);
		console.log('Request body:', req.body);

		if (req.method === 'POST') {
			const { btcAddress, highscore } = req.body;

			// Check if btcAddress and highscore are provided
			if (!btcAddress || !highscore) {
				return res.status(400).json({ message: "btcAddress and highscore are required" });
			}

			const user = await UserData.findOne({ btcAddress: btcAddress });

			if (!user) {
				await UserData.create({ btcAddress, highscore });
				return res.status(201).json({ message: "UserData Created" });
			} else {
				return res.status(200).json({ message: "User already exists", user });
			}
		} else if (req.method === 'GET') {
			const { btcAddress } = req.query;

			// Check if btcAddress is provided
			if (!btcAddress) {
				return res.status(400).json({ message: "btcAddress is required" });
			}

			const user = await UserData.findOne({ btcAddress: btcAddress });

			// Check if user exists
			if (!user) {
				return res.status(404).json({ message: "User not found" });
			}

			return res.status(200).json({ user });
		} else {
			return res.status(405).end(); // Method Not Allowed
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
}
