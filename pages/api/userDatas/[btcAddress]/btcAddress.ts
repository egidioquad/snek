import connectMongoDB from "../../../../app/libs/mongodb";
import UserData from "../../../../app/models/UserData";
import error from "console";
import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { useRouter } from "next/router";
/* interface Params {
	btcAddress: string;
	highscore: number;
} */

console.log('btcAddress.ts file loaded');
const addressCache = new Map();


export default async function handler(request: NextApiRequest, res: NextApiResponse) {
	if (request.method === 'GET') {
		await connectMongoDB();
		const btcAddress = request.query.btcAddress;

		if (!btcAddress) {
			return res.status(400).json({ message: 'BTC address is required' });
		}
		console.log(btcAddress);
		try {
			const entry = await UserData.findOne({ btcAddress: btcAddress });
			if (!entry) {
				return res.status(404).json({ message: "chi cerca trova" });
			}
			addressCache.set(btcAddress, entry);
			return res.status(200).json({ entry });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: "Internal server error" });
		}
	}
	else if (request.method === 'PUT') {
		const btcAddress = request.query.btcAddress;
		const newHighscore = request.body.highscore;
		//	const { btcAddress, newHighscore } = request.body;
		console.log("putting score");
		console.log("address: ", btcAddress);
		console.log("highscore: ", newHighscore);
		try {
			await connectMongoDB();

			// Find the user based on btcAddress and update the highscore value
			const result = await UserData.updateOne(
				{ btcAddress },
				{ $set: { highscore: newHighscore } }
			);

			if (result.modifiedCount === 0) {
				return res.status(404).json({ message: 'User not found' });
			}

			return res.status(200).json({ message: 'Highscore updated successfully' });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: 'Internal server error' });
		}
	}
}


/* export async function PUT(request: NextRequest, { params }: { params: Params }): Promise<NextResponse<unknown> | undefined> {
	await connectMongoDB();
	const { btcAddress } = params;
	const { newHighscore: highscore } = await request.json();


	const existingUserData = await UserData.findOne({ btcAddress: btcAddress });
	if (!existingUserData) {
		return NextResponse.json({ message: "UserData not found" }, { status: 404 });
	}

	existingUserData.highscore = highscore;
	await existingUserData.save();

	return NextResponse.json({ message: "UserData updated" }, { status: 200 });
} */

/* export async function POST(request: NextRequest): Promise<NextResponse> {
	try {
		console.log("post in");
		const { btcAddress, highscore } = await request.json();
		await connectMongoDB();
		await UserData.create({ btcAddress, highscore });
		return NextResponse.json({ message: "UserData Created" }, { status: 201 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "Error creating UserData", error }, { status: 500 });
	}
} */