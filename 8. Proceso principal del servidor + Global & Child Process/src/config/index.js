const { connect } = require("mongoose");
const dotenv = require('dotenv');
const { program } = require("../utils/commander");

const { mode } = program.opts();

dotenv.config({
    path: mode ==='development' ? './.env.development' : './.env.production'
});


// // super conjunto de url // http:// ...
// const uri = 'mongodb://127.0.0.1:27017/c70130'

const configObject = {
    port: process.env.PORT || 8080,
    private_key: process.env.PRIVATE_KEY
}

const connectDB = async () => {
    console.log('BBDD conectada')
    return await connect(process.env.MONGO_URL)
}

module.exports = {
    connectDB, 
    configObject
}