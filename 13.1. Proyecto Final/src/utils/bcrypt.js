const bcrypt = require('bcrypt');

const createHash = async password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const isValidPassword = async (passwordBody, userPassword) => bcrypt.compareSync(passwordBody, userPassword)

module.exports = {
    createHash,
    isValidPassword
}