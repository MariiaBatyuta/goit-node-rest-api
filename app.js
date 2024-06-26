import "dotenv/config";

import path from "node:path";
import express from "express";
import morgan from "morgan";
import cors from "cors";

import "./db/db.js";

import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/authRouter.js";
import avatarRouter from "./routes/avatarRouter.js";

import AuthMiddleware from "./middleware/auth.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", AuthMiddleware, contactsRouter);
app.use("/api/users", authRouter);
app.use("/api/users/avatars", AuthMiddleware, avatarRouter)

app.use("/avatars", express.static(path.resolve("public/avatars")));

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.listen(3000, () => {
  console.log("Server is running. Use our API on port: 3000");
});