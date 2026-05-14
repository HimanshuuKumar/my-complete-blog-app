import express from "express";
import { signup, login, profile } from "../controllers/Users.js";
import upload from "../middleware/multer.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", upload.single("profilePic"), signup);

router.post("/login", login);

router.get("/profile", auth, profile);

export default router;
