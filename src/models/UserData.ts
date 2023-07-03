import mongoose, { Schema, Model } from "mongoose"

const userDataSchema = new mongoose.Schema({
	btcAddress: { type: String, required: true }, // Add index: true here , index: true 
	highscore: { type: Number, required: true },
});


let UserData: Model<any>;

try {
	UserData = mongoose.model("UserData");
} catch {
	UserData = mongoose.model("UserData", userDataSchema);
}

export default UserData;