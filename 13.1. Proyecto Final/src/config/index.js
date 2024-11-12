const { MongoSingleton } = require("../utils/mongoSingleton");
const dotenv = require('dotenv');
const { program } = require("commander");

program.option('--mode <mode>', 'Modo de ejecución', 'development');
program.parse(process.argv);

const { mode } = program.opts();

dotenv.config({
    path: mode === 'development' ? './.env.development' : './.env.production'
})

exports.configObject = {
    port:                 process.env.PORT || 8080,
    private_key:          process.env.PRIVATE_KEY,
    persistence:          process.env.PERSISTENCE,
    gmail_user:           process.env.GMAIL_USER,
    gmail_pass:           process.env.GMAIL_PASS
}

module.exports.connectDB = async() => {
    return await MongoSingleton.getInstance();
}