const mongoose = require('mongoose')

async function connect() {

    try {
        await mongoose.connect(`mongodb://${process.env.IP_LOCAL}:${process.env.IP_MONGODB}/${process.env.DB}`)
        console.log('connect to db success!')
    } catch (error) {
        console.log('failure to connect DB')
    }
}


module.exports = { connect }
