import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import User from "../models/user.js";

const isDev = process.env.NODE_ENV !== "production";
const envFile = isDev ? `.env.${process.env.NODE_ENV}` : ".env";

dotenv.config({ path: envFile });
const secret = process.env.SECRET;
const salt = process.env.SALT;

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const existingUser = await User.findOne({ email: { $eq: email } }).lean();

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
		const existingUser = await User.findOne({ email: { $eq: email } }).lean();

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
			birthday: null,
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
			user = await User.findById(id).lean();
		}

		res.status(200).json(user);
	} catch (err) {
		res.status(400).json({ message: err?.message });
		console.error(err);
	}
};

export const setBirthday = async (req, res) => {
	try {
		const { id } = req.params;
		const { birthday } = req.body;

		if (!birthday || !/^\d{4}\/\d{2}\/\d{2}$/.test(birthday)) {
			return res.status(400).json({
				message:
					"Invalid birthday provided. Please provide a valid date in the format yyyy-mm-dd.",
			});
		}

		const updatedUser = await User.findOneAndUpdate(
			{ _id: { $eq: id } },
			{ birthday },
			{ new: true }
		);

		if (!mongoose.Types.ObjectId.isValid(id) || !updatedUser) {
			return res.status(404).json({ message: "User doesn't exist." });
		}

		res.status(200).json(updatedUser);
	} catch (err) {
		res.status(400).json({ message: err?.message });
		console.error(err);
	}
};

export const setName = async (req, res) => {
	try {
		const { id } = req.params;
		const { firstName, lastName } = req.body;

		if (!firstName || typeof firstName !== "string") {
			return res.status(400).json({ message: "Invalid first name provided." });
		}
		if (lastName && typeof lastName !== "string") {
			return res.status(400).json({ message: "Invalid last name provided." });
		}

		const updateObject = { name: firstName };

		if (lastName) {
			updateObject.name = `${firstName} ${lastName}`;
		}

		const updatedUser = await User.findOneAndUpdate({ _id: { $eq: id } }, updateObject, {
			new: true,
		});

		if (!mongoose.Types.ObjectId.isValid(id) || !updatedUser) {
			return res.status(404).json({ message: "User doesn't exist." });
		}

		res.status(200).json(updatedUser);
	} catch (err) {
		res.status(400).json({ message: err?.message });
		console.error(err);
	}
};

export const setEmail = async (req, res) => {
	try {
		const { id } = req.params;
		const { email } = req.body;
		const existingUser = await User.findOne({ email: { $eq: email.email } }).lean();

		if (existingUser) {
			return res.status(401).json({ message: "User already exists." });
		}

		const updatedUser = await User.findOneAndUpdate(
			{ _id: { $eq: id } },
			{ email: email.email },
			{ new: true }
		);

		if (!mongoose.Types.ObjectId.isValid(id) || !updatedUser) {
			return res.status(404).json({ message: "User doesn't exist." });
		}

		res.status(200).json(updatedUser);
	} catch (err) {
		res.status(400).json({ message: err?.message });
		console.error(err);
	}
};

export const getNotifications = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await User.findById(id);

		if (!mongoose.Types.ObjectId.isValid(id) || !user) {
			return res.status(404).json({ message: "User doesn't exist." });
		}

		res.status(200).json(user.notifications);
	} catch (err) {
		res.status(400).json({ message: err?.message });
		console.error(err);
	}
};

export const addNotification = async (req, res) => {
	try {
		const { id } = req.params;
		const { notification } = req.body;
		const user = await User.findById(id);

		if (!mongoose.Types.ObjectId.isValid(id) || !user) {
			return res.status(404).json({ message: "User doesn't exist." });
		}

		user.notifications.push(notification);
		const updatedUser = await user.save();

		res.status(200).json(updatedUser);
	} catch (err) {
		res.status(400).json({ message: err?.message });
		console.error(err);
	}
};

export const updateNotifications = async (req, res) => {
	try {
		const { id } = req.params;
		const { notifications } = req.body;
		const user = await User.findById(id);

		if (!mongoose.Types.ObjectId.isValid(id) || !user) {
			return res.status(404).json({ message: "User doesn't exist." });
		}

		const updatedNotifications = user.notifications.map(notification => {
			const updatedNotification = notifications.find(n => n._id === notification._id);

			return updatedNotification ? updatedNotification : notification;
		});

		user.notifications = updatedNotifications;
		const updatedUser = await user.save();

		res.status(200).json(updatedUser);
	} catch (err) {
		res.status(400).json({ message: err?.message });
		console.error(err);
	}
};
