const Joi = require('joi');

const userSchema = Joi.object({
    name: Joi.string().trim().min(2).required(),
    email: Joi.string().trim().email().required(),
    age: Joi.number().integer().min(1).max(120).required(),
    course: Joi.string().trim().min(2).required()
});

module.exports = userSchema;
