const { Router } = require("express");
const { SessionsController } = require("../controllers/sessions.controller");
const { passportCall } = require("../middleware/passport/passportCall");
const { authorization } = require("../middleware/passport/authorization.middleware");


const router = Router();

const {
    loginSession,
    currentSession
} = new SessionsController

router.post('/login', loginSession);

router.get('/current', passportCall('jwt'), authorization('admin'), currentSession)

module.exports = router;