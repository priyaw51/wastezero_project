const Joi = require('joi');

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

const registerSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('user', 'admin', 'ngo', 'volunteer').required(),
    address: Joi.string().required(),
    skills: Joi.array().items(Joi.string()).optional(),
    bio: Joi.string().optional(),
    location: Joi.object({
        type: Joi.string(),
        coordinates: Joi.array().items(Joi.number())
    }).optional()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

module.exports = { validate, registerSchema, loginSchema };
