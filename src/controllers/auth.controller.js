
const User = require('../models/authentication')

const jwt = require('jsonwebtoken')

const encodedToken = (userId) => {
    return jwt.sign({
        iss: 'Khuong Doan',
        sub: userId,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 3)
    }, process.env.JWT_SECRET)
}

// [POST] /auth/google
const authGoogle = async (req, res, next) => {
    const token = encodedToken(req.user._id)
    res.setHeader('Authorization', token)
    res.status(201).json({ permission: 'Success!', message: `Hi ${req.user.firstName} ${req.user.lastName}`})
}

// [POST] /auth/facebook
const authFacebook = async (req, res, next) => {
    const token = encodedToken(req.user._id)
    res.setHeader('Authorization', token)
    res.status(201).json({ permission: 'Success!', message: `Hi ${req.user.firstName} ${req.user.lastName}`})
}

// [POST] /signup
const signup = async (req, res, next) => {

    // validate email
    const checkEmailExist = await User.findOne({ email: req.body.email })

    if (checkEmailExist !== null) {
        return res.status(403).json({
            error: 'Email already exists!'
        })
    }

    const newUser = new User(req.body)
    newUser.authType = 'local'
    newUser.save()
        .then((newUserValue) => {
            const token = encodedToken(newUserValue._id)
            res.setHeader('Authorization', token)
            res.status(201).send('Sign Up Successfully!')
        })
        .catch(() => {
            res.json({
                message: 'Error!'
            })
        })
}

// [POST] /singin
const singin = async (req, res, next) => {
    const user = req.user
    const token = encodedToken(user._id)
    res.setHeader('Authorization', token)
    res.status(201).json({
        permission: 'success!',
        message: `Hi ${user.firstName} ${user.lastName}`
    })
}

// [GET] /secret
const secret = async (req, res, next) => {
    await res.send('Success!')
}


module.exports = {
    authGoogle,
    authFacebook,
    signup,
    singin,
    secret
}