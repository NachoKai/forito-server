import express from "express";

import {
	getUser,
	login,
	setBirthday,
	setEmail,
	setName,
	signup,
} from "../controllers/user.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.patch("/:id/setBirthday", auth, setBirthday);
router.patch("/:id/setName", auth, setName);
router.patch("/:id/setEmail", auth, setEmail);
router.get("/:id", getUser);

export default router;
