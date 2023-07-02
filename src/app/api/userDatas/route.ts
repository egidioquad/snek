import { NextApiRequest, NextApiResponse } from 'next';
import connectMongoDB from '@/libs/mongodb';
import UserData from '@/models/UserData';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
	await connectMongoDB();

	const btcAddress = req.query.btcAddress;

	if (!btcAddress) {
		res.status(400).json({ message: 'No btcAddress provided' });
		return;
	}

	try {
		const user = await UserData.findOne({ btcAddress: btcAddress });
		if (user) {
			res.status(200).json({ user });
		} else {
			res.status(404).json({ message: 'User not found' });
		}
	} catch (error) {
		console.error('Error fetching user data:', error);
		res.status(500).json({ message: 'Error fetching user data' });
	}
}


export async function POST(req: NextApiRequest, res: NextApiResponse) {
	await connectMongoDB();

	const { btcAddress, highscore } = req.body;

	try {
		const user = await UserData.findOne({ btcAddress: btcAddress });

		if (!user) {
			await UserData.create({ btcAddress, highscore });
			res.status(201).json({ message: 'UserData Created' });
		} else {
			res.status(400).json({ message: 'User already exists' });
		}
	} catch (error) {
		console.error('Error creating user data:', error);
		res.status(500).json({ message: 'Error creating user data' });
	}
}
