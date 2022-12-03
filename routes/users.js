import express from "express";

import { getUser, login, setBirthday, setName, signup } from "../controllers/user.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.patch("/:id/setBirthday", auth, setBirthday);
router.patch("/:id/setName", auth, setName);
router.get("/:id", getUser);

export default router;
