import Joi from "joi";

export const userRegisterSchema = Joi.object({
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().required().min(6),
    subscription: Joi.string().valid("starter", "pro", "business").optional(),
    token: Joi.string().optional(),
})

export const userLoginSchema = Joi.object({
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().required().min(6),
})
