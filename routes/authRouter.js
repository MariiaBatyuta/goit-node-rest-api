import express from "express";
import { register, login, logout, current, subscription } from "../controllers/authControllers.js";
import AuthMiddleware from "../middleware/auth.js";

const authRouter = express.Router();
const jsonParser = express.json();

authRouter.post("/register", jsonParser, register);
authRouter.post("/login", jsonParser, login);
authRouter.post("/logout", AuthMiddleware, logout);
authRouter.get("/current", AuthMiddleware, current);

authRouter.patch("/", AuthMiddleware, subscription);

export default authRouter;