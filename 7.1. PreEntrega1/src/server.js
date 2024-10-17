const { connectDB } = require("./config");
const express = require('express');
const usersRouter = require('./routes/users.router.js');
const viewsRouter = require('./routes/views.router.js');
const sessionsRouter = require('./routes/sessions.router.js');
const path = require('path');
const handlebars = require('express-handlebars');
const { initializePassport } = require("./config/passport.config.js");
const passport = require('passport');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 8080;

connectDB();

app.engine('handlebars', handlebars.engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({extended: true }));
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(cookieParser('wingardumleviosa'));


initializePassport();
app.use(passport.initialize());

app.use('/', viewsRouter);
app.use('/api/users', usersRouter);
app.use('/api/sessions', sessionsRouter);

app.listen(PORT, () => {
    console.log(`Servidor ${PORT} en funcionamiento`)
});