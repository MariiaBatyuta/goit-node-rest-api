import User from "../models/users.js";
import { userLoginSchema, userRegisterSchema } from "../schemas/authSchemas.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
    
export const register = async (req, res, next) => {
    const { email, password, subscription, token } = req.body;
    const emailToLowerCase = email.toLowerCase();

    try {
        const { error } = userRegisterSchema.validate({ email: emailToLowerCase, password, subscription, token });
        if (error) return res.status(400).send({ message: error.message });

        const user = await User.findOne({ email: emailToLowerCase });

        if (user !== null) return res.status(409).send({ message: "Email in use" });

        const passwordHash = await bcrypt.hash(password, 10);
        
        const createdUser = await User.create({
            email: emailToLowerCase,
            password: passwordHash,
            subscription,
            token
        })
        res.status(201).send(createdUser);
    } catch (error) {
        next(error);
    }
}

export const login = async (req, res, next) => {
    const { email, password } = req.body;
    const emailToLowerCase = email.toLowerCase();

    try {
        const { error } = userLoginSchema.validate({ email: emailToLowerCase, password });
        if (error) return res.status(400).send({ message: error.message });

        const user = await User.findOne({ email: emailToLowerCase });
        if (user === null) return res.status(401).send({ message: "Email or password is wrong" });

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return res.status(401).send({ message: "Email or password is wrong" });

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: 3600 });

        const updatedUser = await User.findByIdAndUpdate(user._id, { token });

        res.status(200).send(updatedUser);
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
