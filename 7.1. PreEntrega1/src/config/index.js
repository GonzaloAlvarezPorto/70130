const { connect } = require("mongoose");

// Asegúrate de incluir las credenciales en la URI
const uri = 'mongodb+srv://gonzaalvarezporto:3498mate@cluster0.gdlaf.mongodb.net/c70130?retryWrites=true&w=majority';

const connectDB = async () => {
    try {
        await connect(uri);
        console.log('Conectado con la base de datos c70130');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
};

module.exports = {
    connectDB
};
