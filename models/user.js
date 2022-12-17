import mongoose from "mongoose";

const userSchema = mongoose.Schema({
	id: { type: String },
	name: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	birthday: { type: Date },
	notifications: { type: Array, default: [] },
});

const User = mongoose.model("User", userSchema);

export default User;
