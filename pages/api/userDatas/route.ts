import connectMongoDB from "../../../app/libs/mongodb";
import UserData from "../../../app/models/UserData";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	await connectMongoDB();

	if (req.method === 'GET') {
		console.log("route.ts get");
		const user = await UserData.find();
		return res.status(200).json({ user });
	}

	if (req.method === 'POST') {
		try {
			console.log("route.ts POST");
			const { btcAddress, highscore } = req.body;

			await UserData.create({ btcAddress, highscore });
			return res.status(201).json({ message: "UserData Created" });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: "Error creating UserData", error });
		}
	}

	// If the request method is not GET or POST
	return res.status(405).json({ message: 'Method Not Allowed' });
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