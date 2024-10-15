const bcrypt = require('bcrypt');

const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
// userPassword viene de db // passwordBody viene de cliente
const isValidPassword = (passwordBody, userPassword) => bcrypt.compareSync(passwordBody, userPassword)

module.exports = {
    createHash,
    isValidPassword
}