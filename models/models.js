const mongoose = require('mongoose');

// Definir el esquema de usuario
const usuarioSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    contraseña: { type: String, required: true },
    role: { type: String, required: true }
});

// Definir el esquema de mascota
const mascotaSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    edad: { type: Number, required: true },
    raza: { type: String, required: true },
    sexo: { type: String, required: true },
    color: { type: String, required: true },
    vacunas: { type: String, required: true },
    caracteristicas: { type: String, required: true },
    certificado: { type: String, required: true },
    fotos: { type: String, required: true }, // Guardar fotos como cadena de texto en base64
    Comportamiento: { type: String, required: true }, // Cambiar a mayúscula inicial
    id_usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }
});

// Crear los modelos de usuario y mascota
const Usuario = mongoose.model('Usuario', usuarioSchema);
const Mascota = mongoose.model('Mascotas', mascotaSchema, 'Mascotas');

// Función para obtener todos los usuarios
const getAllUsuarios = async () => {
    return await Usuario.find({});
};

// Función para encontrar un usuario por email
const findUsuarioByEmail = async (email) => {
    return await Usuario.findOne({ email });
};

// Función para crear un nuevo usuario
const createUsuario = async (usuarioData) => {
    const nuevoUsuario = new Usuario(usuarioData);
    return await nuevoUsuario.save();
};

// Exportar el modelo y las funciones
module.exports = {
    Usuario,
    Mascota, // Asegúrate de exportar también el modelo Mascotas
    getAllUsuarios,
    findUsuarioByEmail,
    createUsuario
};
