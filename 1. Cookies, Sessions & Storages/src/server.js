const express = require('express');
const path = require('path');
const { Server } = require('socket.io');
const handlebars = require('express-handlebars');

const viewsRouter = require('./routes/views.router');
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const usersRouter = require('./routes/users.router.js');
const pruebasRouter = require('./routes/pruebas.router.js');
const sessionsRouter = require('./routes/sessions.router.js');

const { connectDB } = require('./config/index.js');
const ProductsManagerMongo = require('./daos/mongo/productsManager.mongo.js');
const CartsManagerMongo = require('./daos/mongo/cartsManager.mongo.js');
const cookieParser = require('cookie-parser'); // => Hecho en clase con el profe
const session = require('express-session') // => Hecho en clase con el profe

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(cookieParser('wingardumleviosa')); // => Hecho en clase con el profe // La palabra secreta de cookieParser debe estar en el .env
app.use(session({
    secret: 'alojomora',
    resave:true,
    saveUninitialized: true
})) // => Hecho en clase con el profe

connectDB();

app.engine('handlebars', handlebars.engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use((req, res, next) => {
    console.log('Time: ', Date.now());
    next();
});

app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).send('Error de servidor');
});

app.use('/', viewsRouter)
app.use('/users', usersRouter) // => Hecho en clase con el profe
app.use('/products', productsRouter);
app.use('/carts', cartsRouter);
app.use('/pruebas', pruebasRouter); // => Hecho en clase con el profe
app.use('/sessions', sessionsRouter); // => Hecho en clase con el profe

const httpServer = app.listen(PORT, () => {
    console.log('Escuchando en el puerto:', PORT);
});

const io = new Server(httpServer);
const productsManager = new ProductsManagerMongo();

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.on('requestProducts', async ({ limit = 10, page = 1, sort, query } = {}) => {
        try {
            const limitInt = parseInt(limit);
            const pageInt = parseInt(page);
            const sortOption = sort === 'desc' ? { precio: -1 } : (sort === 'asc' ? { precio: 1 } : {});
            const filter = query ? { title: new RegExp(query, 'i') } : {};
            const products = await productsManager.getProducts(filter, sortOption, limitInt, (pageInt - 1) * limitInt);
            socket.emit('productosNuevos', products);
        } catch (error) {
            console.error('Error al obtener los productos:', error);
        }
    });
});


//Esto fue agregado con el profe
//Las cookies no están en el servidor