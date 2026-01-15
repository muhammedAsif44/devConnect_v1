const Joi = require("joi");

const signupSchema = Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
        "string.min": "Name must be at least 2 characters long",
        "any.required": "Name is required",
    }),
    username: Joi.string().min(3).max(30).alphanum().required().messages({
        "string.alphanum": "Username must contain only letters and numbers",
        "string.min": "Username must be at least 3 characters long",
    }),
    email: Joi.string().email().required().messages({
        "string.email": "Please provide a valid email address",
    }),
    password: Joi.string().min(6).required().messages({
        "string.min": "Password must be at least 6 characters long",
    }),
    role: Joi.string().valid("mentor", "developer").required(),
    bio: Joi.string().max(500).allow("", null),
    skills: Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string()
    ).messages({
        "alternatives.match": "Skills must be an array of strings or a JSON string",
    }),
    experience: Joi.string().allow("", null),
    availability: Joi.alternatives().try(
        Joi.array().items(Joi.string()), // e.g. ["Monday 10:00", "Tuesday 12:00"]
        Joi.string()
    ),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "Please provide a valid email address",
    }),
    password: Joi.string().required().messages({
        "any.required": "Password is required",
    }),
});

const otpSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required().messages({
        "string.length": "OTP must be exactly 6 characters",
    }),
});

module.exports = {
    signupSchema,
    loginSchema,
    otpSchema,
};
