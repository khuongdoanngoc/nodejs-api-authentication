const Joi = require('joi')

const validateBody = (schema) => {
    return (req, res, next) => {
        const validatorResult = schema.validate(req.body)
        if (validatorResult.error) {
            res.status(400).json(validatorResult.error)
        } else {
            req.body = validatorResult.value
            next()
        }
    }
}

const schemas = {

    authSignUpSchema: Joi.object({
        firstName: Joi.string().min(2).required(),
        lastName: Joi.string().min(2).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(2).required()
    }),

    authSingInSchema: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(2).required()
    })

}

module.exports = {
    validateBody,
    schemas
}