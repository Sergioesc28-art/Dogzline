require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a MongoDB'))
    .catch(error => console.error('Error al conectar a MongoDB:', error));

app.use(express.json());

const { Mascotas } = require('./models/models.js');

app.get('/api/mascotas', async (req, res) => {
    try {
        const mascotas = await Mascotas.find();
        res.json(mascotas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las mascotas', error });
    }
});

app.listen(3000, () => {
    console.log('Servidor escuchando en http://localhost:3000');
});
