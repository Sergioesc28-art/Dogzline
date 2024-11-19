// Importa y configura dotenv
require('dotenv').config();
const mongoose = require('mongoose');

// Usa la URI de MongoDB desde las variables de entorno
const MONGODB_URI = process.env.MONGODB_URI; // Obtén la URI desde el archivo .env

// Conéctate a MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Conexión exitosa a MongoDB');
    })
    .catch((error) => {
        console.error('Error de conexión a MongoDB:', error);
    });
