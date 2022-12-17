import express from "express";

import {
	getNotifications,
	getUser,
	login,
	setBirthday,
	setEmail,
	setName,
	setNotification,
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
router.get("/:id/notifications", auth, getNotifications);
router.patch("/:id/setNotification", auth, setNotification);

export default router;
