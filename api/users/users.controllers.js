const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");

const User = require('./users.schema');
const { hashPassword } = require('./user.helpers');

require("dotenv").config();

module.exports = class UserController {

static async register(req, res, next) {
    try {
        const verificationToken = uuidv4();
        const { name, login, password } = req.body;
        const userExist = await User.findOne({ login });
        if (userExist) {
            return res.status(409).send("Such login is in use");
        }
        const newUser = await User.create({
            name,
            login,
            password: await hashPassword(password),
            verificationToken,
        });
        return res.status(201).send({
            user: {
                name: newUser.name,
                login: newUser.login
            },
        });
    }
    catch (err) {
        console.log(err);
        next(err)
    }
}

static async validate(req, res, next) {
    const validationSchema = Joi.object({
        name: Joi.string().required(),
        login: Joi.string().required(),
        password: Joi.string().required(),
    });
    const validationResult = validationSchema.validate(req.body);
    if (validationResult.error) {
        return res.status(400).send(validationResult.error.details);
    }
    next();
}
}