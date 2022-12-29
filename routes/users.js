import express from "express";

import {
	addNotification,
	getNotifications,
	getUser,
	login,
	setBirthday,
	setEmail,
	setName,
	signup,
	updateNotifications,
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
router.patch("/:id/addNotification", auth, addNotification);
router.patch("/:id/updateNotifications", auth, updateNotifications);

export default router;
