const User = require('../models/Users');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const errorHandler = require('../utils/errorHandler');
module.exports.login = async function (req, res) {
    const candidate = await User.findOne({email: req.body.email});
    if (candidate) {
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password);
        if (passwordResult) {
            // генерируем токен, если пароли совпали
            const token = jwt.sign({
                email: candidate.email,
                name: candidate.name,
                userId: candidate._id
            }, keys.jwt, {expiresIn: 600 * 600})
            //res.status(200).json({
            //    token: `Bearer: ${token}`
            //})
            res.status(200).json(candidate)
        } else {
            res.status(401).json({
                message: 'Неверный пароль.'
            })
        }
    } else {
        res.status(404).json({
            message: 'Пользователь не найден.'
        })
    }
}
module.exports.register = async function (req, res) {
    const candidate = await User.findOne({email: req.body.email});
    if (candidate) {
        res.status(409).json({
            message: "Такой E-mail уже занят другим пользователем, выберите другой."
        })
    } else {
        const salt = bcrypt.genSaltSync(10);
        const password = req.body.password;
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(password, salt),
            surname: req.body.surname
        })
        try {
            await user.save()
            res.status(201).json(user)
        } catch(error) {
            errorHandler(res, error)
        }
    }
}
module.exports.getUserData = async function(req, res) {
    const user = await User.findOne(
        { email: req.body.email }
    );
    if(user) {
        res.status(200).json(user)
    }
}