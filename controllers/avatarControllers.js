import User from "../models/users.js";
import * as fs from "node:fs/promises";
import path from "node:path";
import Jimp from "jimp";

export async function getAvatar(req, res, next) {
    try {
        const user = await User.findById(req.user.id);

        if (!user) res.status(404).send({ message: "User not found" });
        if (!user.avatarURL) res.status(404).send({ message: "Avatar not found" });

        res.status(200).sendFile(path.resolve("public/avatars", user.avatarURL));
    } catch (error) {
        next(error);
    }
}

export async function uploadAvatar(req, res, next) {
    try {
        const image = await Jimp.read(req.file.path);
        await image.resize(250, 250).writeAsync(req.file.path);

        await fs.rename(req.file.path, path.resolve("public/avatars", req.file.filename));

        const user = await User.findByIdAndUpdate(req.user.id, { avatarURL: req.file.filename }, { new: true });
        
        if (!user) res.status(401).send({ message: "Not authorized" });

        res.status(200).send({ avatarURL: `/avatars/${user.avatarURL}`});
    } catch (error) {
        next(error);
    }
}