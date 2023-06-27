const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bcrypt = require('bcryptjs')

const UserSchema = new Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    authType: {
        type: String,
        enum: ['local', 'google', 'facebook']
    },
    authGoogleId: {
        type: String,
        default: null
    },
    authFacebookId: {
        type: String,
        default: null
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    }
})

// Hash password
UserSchema.pre('save', async function (next) {
    try {
        if (this.authType !== 'local') {
            next()
        }
        const salt = await bcrypt.genSalt(10)
        const passwordHashed = await bcrypt.hash(this.password, salt)
        this.password = passwordHashed
    } catch (error) {
        next(error)
    }
})


// compare inputPassword to password hashed in database
UserSchema.methods.isValidPassword = async function (inputPassword) {
    try {
        return await bcrypt.compare(inputPassword, this.password)
    } catch (error) {
        throw new Error(error)
    }
}


const User = mongoose.model('user', UserSchema)

module.exports = User