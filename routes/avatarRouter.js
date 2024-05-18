import express from "express";
import { uploadAvatar, getAvatar } from "../controllers/avatarControllers.js";
import uploadMiddleware from "../middleware/upload.js"

const avatarRouter = express.Router();

avatarRouter.patch("/", uploadMiddleware.single("avatar"), uploadAvatar);
avatarRouter.get("/", getAvatar);

export default avatarRouter;