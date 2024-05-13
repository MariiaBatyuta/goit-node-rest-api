import Joi from "joi";

export const createContactSchema = Joi.object({
    name: Joi.string().required().min(3),
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    phone: Joi.string().required().max(14),
    favorite: Joi.boolean(),
    owner: Joi.string(),
})

export const updateContactSchema = Joi.object({
    name: Joi.string().min(3),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    phone: Joi.string().max(14),
    favorite: Joi.boolean(),
})
