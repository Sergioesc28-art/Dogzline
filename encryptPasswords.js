require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Usuario } = require('./models/models.js');

const mongoURI = process.env.MONGODB_URI; // Asegúrate de que esta variable tiene el valor correcto
console.log('MONGODB_URI:', mongoURI);

// Conectar a la base de datos
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

async function encryptPasswords() {
    try {
        // Obtener todos los usuarios
        const usuarios = await Usuario.find();

        for (const usuario of usuarios) {
            // Solo encriptar contraseñas que no estén encriptadas
            if (!usuario.contraseña.startsWith('$2a$')) { // Comprueba si ya está encriptada
                const hashedPassword = await bcrypt.hash(usuario.contraseña, 10);
                usuario.contraseña = hashedPassword;
                await usuario.save(); // Guarda los cambios
                console.log(`Contraseña encriptada para usuario: ${usuario.email}`);
            }
        }

        console.log('Contraseñas encriptadas con éxito');
        mongoose.connection.close();
    } catch (error) {
        console.error('Error al encriptar las contraseñas:', error);
        mongoose.connection.close();
    }
}

encryptPasswords();
