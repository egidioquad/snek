import mongoose, { Schema, Model } from "mongoose";

const userDataSchema = new Schema({
	btcAddress: String,
	highscore: Number
}, { timestamps: true });

let UserData: Model<any>;

try {
	UserData = mongoose.model("UserData");
} catch {
	UserData = mongoose.models.UserData || mongoose.model("UserData", userDataSchema, "userdatas");
}

export default UserData;
