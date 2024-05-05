import Joi from "joi";

export const schemaAddContact = Joi.object({
    name: Joi.string().required().min(3),
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    phone: Joi.string().required().max(14),
});

export const schemaUpdateContact = Joi.object({
    name: Joi.string().min(3),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    phone: Joi.string().max(14),
});
