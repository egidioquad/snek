import connectMongoDB from "@/libs/mongodb";
import UserData from "@/models/UserData";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
	await connectMongoDB();
	const { btcAddress, highscore } = await request.json();

	const user = await UserData.findOne({ btcAddress: btcAddress });

	if (!user) {
		await UserData.create({ btcAddress, highscore });
		return NextResponse.json({ message: "UserData Created" }, { status: 201 });
	} else {
		return NextResponse.json({ message: "User already exists", user });
	}
}

export async function GET(btcAddress: string): Promise<NextResponse> {
	await connectMongoDB();
	const user = await UserData.findOne({ btcAddress: btcAddress });
	return NextResponse.json({ user });
}
