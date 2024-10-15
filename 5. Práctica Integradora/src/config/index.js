const { connect } = require("mongoose");

// super conjunto de url // http:// ...

const uri = 'mongodb://127.0.0.1:27017/c70130'

const connectDB = async () => {
    console.log('base de datos conectada')
    await connect(uri)
}

module.exports = {
    connectDB
}