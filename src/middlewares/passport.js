const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const LocalStrategy = require('passport-local').Strategy
const { ExtractJwt, Strategy } = require('passport-jwt')
const GooglePlusTokenStrategy = require('passport-google-plus-token')
const FacebookTokenStrategy = require('passport-facebook-token')
const User = require('../models/authentication')
const jwt = require('jsonwebtoken')
require('dotenv').config()

// jwt passport config
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
    secretOrKey: process.env.JWT_SECRET
}

passport.use(new JwtStrategy(jwtOptions, (jwtPayload, done) => {
    try {
        const user = User.findById(jwtPayload.sub)
        if (!user) {
            return done(null, false)
        }
        done(null, user)
    } catch (error) {
        done(error, false)
    }
}))



// local passport config
const localOptions = {
    usernameField: 'email',
}

passport.use(new LocalStrategy(localOptions, async (email, password, done) => {
    try {
        const user = await User.findOne({ email: email })
        if (!user) {
            return done(null, false)
        }
        const isCorrectPassword = await user.isValidPassword(password)
        if (!isCorrectPassword) {
            return done(null, false)
        }
        done(null, user)
    } catch (error) {
        done(error, false)
    }
}))

// passport google plus token config
const googleOptions = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
}

passport.use(new GooglePlusTokenStrategy(googleOptions, async (accessToken, refreshToken, profile, done) => {
    try {

        // check if exist google account
        const isExistUser = await User.findOne({ authGoogleId: profile.id, authType: 'google' })
        if (isExistUser) {
            return done(null, isExistUser)
        }
        const newUser = User({
            authType: 'google',
            authGoogleId: profile.id,
            email: profile.emails[0].value,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName
        })
        await newUser.save()
        done(null, newUser)
    } catch (error) {
        done(error, null)
    }
}))

// passport facebook token config
const facebookOptions = {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET
}

passport.use(new FacebookTokenStrategy(facebookOptions, async (accessToken, refreshToken, profile, done) => {
    try {
        // check if exist facebook account
        const isExistUser = await User.findOne({ authFacebookId: profile.id, authType: 'facebook'})
        console.log('profile ', profile)
        if (isExistUser) {
            return done(null, isExistUser)
        }
        const newUser = User({
            authFacebookId: profile.id,
            authType: 'facebook',
            email: profile.emails[0].value,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName
        })
        await newUser.save()
        done(null, newUser)
    } catch (error) {
        done(error, null)
    }
}))