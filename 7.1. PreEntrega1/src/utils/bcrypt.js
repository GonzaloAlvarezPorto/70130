const bcrypt = require('bcrypt');

const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const isValidPassword = (passwordBody, userPassword) => bcrypt.compareSync(passwordBody, userPassword)

module.exports = {
    createHash,
    isValidPassword
}