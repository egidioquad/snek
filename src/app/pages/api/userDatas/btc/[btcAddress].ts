import connectMongoDB from "@/libs/mongodb";
import UserData from "@/models/UserData";
import error from "console";
import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

/* interface Params {
	btcAddress: string;
	highscore: number;
} */

console.log('btcAddress.ts file loaded');

export default async function handleSearch(req: NextApiRequest, res: NextApiResponse) {
	const { btcAddress } = req.query;
	console.log("API route reached:", req.url);
	console.log(btcAddress);
	try {
		await connectMongoDB();

		const collection = mongoose.connection.collection("userdatas");

		const entry = await collection.findOne({ btcAddress });
		console.log(entry);
		if (!entry) {
			return res.status(404).json({ message: "chi cerca trova" });
		}
		return res.status(200).json({ entry });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error" });
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