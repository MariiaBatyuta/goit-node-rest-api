import Joi from "joi";

const verificationSchema = Joi.object({
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
})

export default verificationSchema;