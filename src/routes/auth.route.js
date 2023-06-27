const express = require('express')
const Router = express.Router()

const { validateBody, schemas } = require('../helpers/validate.helper')

const passport = require('passport')
require('../middlewares/passport')

const auth = require('../controllers/auth.controller')

Router.post('/auth/google', passport.authenticate('google-plus-token', { session: false }), auth.authGoogle)

Router.post('/auth/facebook', passport.authenticate('facebook-token', { session: false }), auth.authFacebook)

Router.post('/signup', validateBody(schemas.authSignUpSchema), auth.signup)

Router.post('/signin', passport.authenticate('local', { session: false }), validateBody(schemas.authSingInSchema), auth.singin)

Router.get('/secret', passport.authenticate('jwt', { session: false }), auth.secret)


module.exports = Router