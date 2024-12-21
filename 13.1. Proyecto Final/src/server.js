const { connectDB, configObject } = require("./config");
const express = require('express');
const usersRouter = require('./routes/users.router.js');
const viewsRouter = require('./routes/views.router.js');
const sessionsRouter = require('./routes/sessions.router.js');
const productsRouter = require('./routes/products.router.js');
const cartsRouter = require('./routes/carts.router.js');
const ticketsRouter = require('./routes/ticket.router.js')
const mocksRouter = require('./routes/mocks.router.js');

const path = require('path');
const handlebars = require('express-handlebars');
const { initializePassport } = require("./config/passport.config.js");
const passport = require('passport');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = configObject.port;

connectDB();

const hbs = handlebars.create({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
});

hbs.handlebars.registerHelper('eq', function (a, b) {
    return a === b;
});

app.engine('handlebars', hbs.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(cookieParser('wingardumleviosa'));

initializePassport();
app.use(passport.initialize());

app.use('/', viewsRouter);
app.use('/api/users', usersRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/tickets', ticketsRouter);
app.use('/api/mocks', mocksRouter);

app.listen(PORT, () => {
    console.log(`Servidor ${PORT} en funcionamiento`)
});