import User from "../models/users.js";
import { userLoginSchema, userRegisterSchema } from "../schemas/authSchemas.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
    
export const register = async (req, res, next) => {
    const { email, password, subscription } = req.body;
    if (Object.keys(req.body).length === 0) return res.status(400).send({ message: "To register, you must provide all the necessary information about the user." });

    try {
        const { error } = userRegisterSchema.validate({ email, password, subscription });
        if (error) return res.status(400).send({ message: error.message });

        const user = await User.findOne({ email: email.toLowerCase() });

        if (user !== null) return res.status(409).send({ message: "Email in use" });

        const passwordHash = await bcrypt.hash(password, 10);
        
        const createdUser = await User.create({
            email: emailToLowerCase,
            password: passwordHash,
            subscription
        })
        res.status(201).send(createdUser);
    } catch (error) {
        next(error);
    }
}

export const login = async (req, res, next) => {
    const { email, password } = req.body;
    if (Object.keys(req.body).length === 0) return res.status(400).send({ message: "Email or password is wrong" });
    
    try {
        const { error } = userLoginSchema.validate({ email, password });
        if (error) return res.status(400).send({ message: error.message });

        const user = await User.findOne({ email: email.toLowerCase() });
        if (user === null) return res.status(401).send({ message: "Email or password is wrong" });

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return res.status(401).send({ message: "Email or password is wrong" });

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: 3600 });

        await User.findByIdAndUpdate(user._id, { token });

        res.status(200).send({token});
    } catch (error) {
        next(error);
    }
}

export const logout = async (req, res, next) => {
    try {
        const findUser = await User.findOne({ _id: req.user.id });
        if (!findUser) return res.status(401).send({ message: "Not authorized" });

        await User.findByIdAndUpdate(req.user.id, {token: null });
        res.status(204).send({ message: "No content" });
    } catch (error) {
        next(error); 
    }
}

export const current = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) return res.status(401).send({ message: "Not authorized" });

        res.status(200).send(user);
    } catch (error) {
        next(error);
    }
}

export const subscription = async (req, res, next) => {
    const allowedSubscription = ['starter', 'pro', 'business'];
    const { subscription } = req.body;
    
    try {
        if (!allowedSubscription.includes(subscription)) return res.status(400).send({ message: "Invalid subscription type" });

        const updateSubs = await User.findByIdAndUpdate(req.user.id, { subscription }, { new: true });

        res.status(200).send(updateSubs);
    } catch (error) {
        next(error);
    }
}
