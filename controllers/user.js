import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import User from "../models/user.js";

const isDev = process.env.NODE_ENV !== "production";
const envFile = isDev ? `.env.${process.env.NODE_ENV}` : ".env";

dotenv.config({ path: envFile });
const secret = process.env.SECRET;
const salt = process.env.SALT;

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const existingUser = await User.findOne({ email: { $eq: email } });

		if (!existingUser) {
			return res.status(404).json({ message: "User doesn't exist." });
		}

		const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

		if (!isPasswordCorrect) {
			return res.status(401).json({ message: "Invalid credentials." });
		}

		const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, secret, {
			expiresIn: "24h",
		});

		res.status(200).json({ result: existingUser, token });
	} catch (err) {
		res.status(400).json({ message: "Something went wrong." });
		console.error(err);
	}
};

export const signup = async (req, res) => {
	try {
		const { email, password, confirmPassword, firstName, lastName } = req.body;
		const existingUser = await User.findOne({ email: { $eq: email } });

		if (existingUser) {
			return res.status(401).json({ message: "User already exists." });
		}
		if (password !== confirmPassword) {
			return res.status(401).json({ message: "Passwords don't match." });
		}

		const hashedPassword = await bcrypt.hash(password, Number(salt));
		const result = await User.create({
			email,
			password: hashedPassword,
			name: lastName ? `${firstName} ${lastName}` : firstName,
		});
		const token = jwt.sign({ email: result.email, id: result._id }, secret, {
			expiresIn: "12h",
		});

		res.status(200).json({ result, token });
	} catch (err) {
		res.status(400).json({ message: "Something went wrong." });
		console.error(err);
	}
};

export const getUser = async (req, res) => {
	try {
		const { id } = req.params;
		let user;

		if (id.match(/^[0-9a-fA-F]{24}$/)) {
			user = await User.findById(id);
		}

		res.status(200).json(user);
	} catch (err) {
		res.status(400).json({ message: err?.message });
		console.error(err);
	}
};
