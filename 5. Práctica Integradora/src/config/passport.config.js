const passport = require('passport');
const passportLocal = require('passport-local');
const GithubStrategy = require('passport-github2');
const { UserManagerMongo } = require('../daos/mongo/userManager.mongo');
const { createHash, isValidPassword } = require('../utils/bcrypt');

const LocalStrategy = passportLocal.Strategy;
const userService = new UserManagerMongo();

const initializePassport = () => {
    // middleware son las estrategias que vamos a crear y configurar
    passport.use('github', new GithubStrategy({
        clientID: 'Iv23lia9EnUuDxmrZZMw',
        clientSecret: 'fdeda7b25378e2e1caf74577b182aefdc7b86b14',
        callbackURL: 'http://localhost:8080/sessions/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
            let user = await userService.getUser({ email: profile._json.email })
            if (!user) {
                //registramos
                let newUser = {
                    first_name: profile._json.name,
                    last_name: profile._json.name,
                    email: profile._json.email,
                    password: ''
                }

                let result = await userService.createUser(newUser);
                return done(null, result)
            }

            //logueamos
            done(null, user)


        } catch (error) {
            return done(error)
        }
    }))

    // passport.use('register', new LocalStrategy({
    //     passReqToCallback: true,
    //     usernameField: 'email'
    // }, async (req, username, password, done) => {
    //     // toda la logica del register
    //     const { first_name, last_name } = req.body;
    //     try {
    //         let userFound = await userService.getUser({ email: username });
    //         if (userFound) {
    //             return done(null, false)
    //         }

    //         let newUser = {
    //             first_name,
    //             last_name,
    //             email: username,
    //             password: createHash(password)
    //         }

    //         let result = await userService.createUser(newUser);
    //         return done(null, result);

    //     } catch (error) {
    //         return done('Error al crear un usuario ' + error)
    //     }
    // }));

    // passport.use('login', new LocalStrategy({
    //     usernameField: 'email'
    // }, async (username, password, done) => {
    //     try {
    //         const user = await userService.getUser({ email: username });
    //         if (!user) {
    //             return done(null, false)
    //         }

    //         if (!isValidPassword(password, user.password)) {
    //             return done(null, false)
    //         }

    //         return done(null, user);

    //     } catch (error) {
    //         return done(error)
    //     }
    // }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser(async (id, done) => {
        let user = await userService.getUser({ _id: id });
        done(null, user);
    });
}

module.exports = {
    initializePassport
}