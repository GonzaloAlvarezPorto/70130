const { MongoSingleton } = require("../utils/mongoSingleton");
const dotenv = require('dotenv');
const { program } = require("commander");

// Asegúrate de incluir las credenciales en la URI
const { mode } = program.opts();

dotenv.config({
    path: mode === 'development' ? './.env.development' : './.env.production'
})

exports.configObject = {
    port:                 process.env.PORT || 8080,
    private_key:          process.env.PRIVATE_KEY,
    persistence:          process.env.PERSISTENCE,
}

module.exports.connectDB = async() => {
    return await MongoSingleton.getInstance();
}