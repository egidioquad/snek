import mongoose, { Schema, Model } from "mongoose"

const userDataSchema: Schema = new Schema(
	{
		btcAddress: {
			type: String,
			required: true,
		},

		highscore: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true }
)

let UserData: Model<any>;

try {
	UserData = mongoose.model("UserData");
} catch {
	UserData = mongoose.model("UserData", userDataSchema);
}

export default UserData;