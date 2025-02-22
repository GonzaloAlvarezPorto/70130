const passport = require('passport');
const jwt = require('passport-jwt');
const { UserManagerMongo } = require('../daos/mongo/userManager.mongo');
const { PRIVATE_KEY } = require('../utils/jsonwebtoken');

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;
const userService = new UserManagerMongo();

const initializePassport = () => {

    const cookieExtractor = req => {
        let token = null;
        if(req && req.cookies){
            token = req.cookies['token'];
        }

        return token;
    }

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_KEY
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }
    }))
}

module.exports = {
    initializePassport
}