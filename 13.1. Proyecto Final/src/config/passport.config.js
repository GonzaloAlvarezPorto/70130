const passport = require('passport');
const jwt = require('passport-jwt');
const { configObject } = require('.');

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {
    // Función que extrae el token de las cookies
    const cookieExtractor = req => {
        let token = null;
        if (req && req.cookies) {
            token = req.cookies['token'];
        }
        return token;
    };

    // Configurar la estrategia JWT
    passport.use('jwt', new JWTStrategy(
        {
            jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
            secretOrKey: configObject.private_key
        },
        async (jwt_payload, done) => {
            try {
                return done(null, jwt_payload); // O puedes pasar el usuario completo
            } catch (error) {
                return done(error, false);
            }
        }
    ));
};

module.exports = {
    initializePassport
};
