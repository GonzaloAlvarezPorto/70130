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

const { Server } = require("socket.io");
const { ProductsDaoMongo } = require("./daos/mongo/productsDao.mongo.js");

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUiExpress = require('swagger-ui-express');

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

const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: 'Documentación de app web ecommerce',
            description: 'Esta es la documentación api de una app web con ecommerce'
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}

const specs = swaggerJsDoc(swaggerOptions)
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

initializePassport();
app.use(passport.initialize());

app.use('/', viewsRouter);
app.use('/api/users', usersRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/tickets', ticketsRouter);
app.use('/api/mocks', mocksRouter);

const httpServer = app.listen(PORT, () => {
    console.log(`Servidor ${PORT} en funcionamiento`)
});

const socketServer = new Server(httpServer);
const productsManager = new ProductsDaoMongo();

socketServer.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.on('requestProducts', async ({ limit = 10, page = 1, sort, query } = {}) => {
        try {
            const limitInt = parseInt(limit);
            const pageInt = parseInt(page);
            const sortOption = sort === 'desc' ? { price: -1 } : (sort === 'asc' ? { price: 1 } : {});
            const filter = query ? { title: new RegExp(query, 'i') } : {};
            const products = await productsManager.getProducts(filter, sortOption, limitInt, (pageInt - 1) * limitInt);
            socket.emit('productosNuevos', products);
        } catch (error) {
            console.error('Error al obtener los productos:', error);
        }
    });
});

// app.listen(PORT, () => {
//     console.log(`Servidor ${PORT} en funcionamiento`)
// });

