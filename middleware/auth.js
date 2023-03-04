import dotenv from "dotenv";
import jwt from "jsonwebtoken";

const isDev = process.env.NODE_ENV !== "production";
const envFile = isDev ? `.env.${process.env.NODE_ENV}` : ".env";

dotenv.config({ path: envFile });
const secret = process.env.SECRET;

const auth = async (req, res, next) => {
	try {
		const token = req?.headers?.authorization?.split(" ")[1];

		if (!token) return res.status(401).json({ message: "Unauthorized" });

		const isCustomAuth = token.length < 500;
		let decodedData;

		if (token && isCustomAuth) {
			decodedData = jwt.verify(token, secret);
			req.userId = decodedData?.id;
		} else {
			decodedData = jwt.decode(token);
			req.userId = decodedData?.sub;
		}
		next();
	} catch (err) {
		console.error(err);
		throw err;
	}
};

export default auth;
