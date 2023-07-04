import connectMongoDB from "@/libs/mongodb";
import UserData from "@/models/UserData";
import error from "console";
import { NextRequest, NextResponse } from "next/server";


interface Params {
	btcAddress: string;
	highscore: number;
}

export default async function GET(request: NextRequest, { params }: { params: Params }): Promise<NextResponse> {
	await connectMongoDB();
	const { btcAddress } = params;
	console.log("get this shi");
	if (!btcAddress) {
		//res.status(400).json({ message: 'No btcAddress provided' });
		console.error({ message: "No btcAddress provided" });
	} else {
		try {
			const user = await UserData.findOne({ btcAddress: btcAddress });
			if (user) {
				return NextResponse.json({ user }, { status: 200 });
			} else {
				console.error({ message: 'User not found' });
				return NextResponse.json({ message: 'User not found' }, { status: 404 })
			}
		} catch (error) {

			return NextResponse.json({ message: 'User not found' }, { status: 404 })

		}
	}
	return NextResponse.json({ message: 'User not found' }, { status: 404 })

}

export async function PUT(request: NextRequest, { params }: { params: Params }): Promise<NextResponse<unknown> | undefined> {
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
}

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