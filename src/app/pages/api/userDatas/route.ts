import connectMongoDB from "@/libs/mongodb";
import UserData from "@/models/UserData";
import error from "console";
import { NextRequest, NextResponse } from "next/server";

interface Params {
	btcAddress: string;
	highscore: number;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
	await connectMongoDB();
	console.log("route.ts get");
	const user = await UserData.find();
	return NextResponse.json({ user });
}
export async function POST(request: NextRequest): Promise<NextResponse> {
	try {
		await connectMongoDB();
		console.log("route.ts POST");
		const { btcAddress, highscore } = await request.json();

		await UserData.create({ btcAddress, highscore });
		return NextResponse.json({ message: "UserData Created" }, { status: 201 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "Error creating UserData", error }, { status: 500 });
	}
}


/* export async function POST(request: NextRequest, { params }: { params: Params }): Promise<NextResponse<unknown> | undefined> {
	await connectMongoDB();
	const { btcAddress, highscore } = params;

	try {
		const user = await UserData.findOne({ btcAddress: btcAddress });

		if (!user) {
			await UserData.create({ btcAddress, highscore });

			//res.status(201).json({ message: 'UserData Created' });
		} else {
			//res.status(400).json({ message: 'User already exists' });
		}
		return NextResponse.json({ message: "UserData Created" }, { status: 201 });
	} catch (error) {
		console.error('Error creating user data:', error);
		//res.status(500).json({ message: 'Error creating user data' });
	}
	return undefined;
}
*/