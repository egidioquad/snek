import mongoose, { Schema, Model } from "mongoose"

const userDataSchema = new mongoose.Schema({
	btcAddress: String,
	highscore: Number
}, { timestamps: true });

let UserData: Model<any>;

try {
	UserData = mongoose.model("UserData");
} catch {
	UserData = mongoose.model("UserData", userDataSchema);
}

export default UserData;