const authRouter = require('./auth.route')

module.exports = function route(app) {
    app.use('/user', authRouter)
}