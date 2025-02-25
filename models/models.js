const mongoose = require('mongoose');

// Definir el esquema de usuario
const usuarioSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    contrasena: { type: String, required: true },
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

// Definir el esquema de Encuentro
const encuentroSchema = new mongoose.Schema({
    usuario1_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    usuario2_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    metodos_pago_id: { type: mongoose.Schema.Types.ObjectId, ref: 'MetodoDePago', required: true }
});

// Definir el esquema de Match
const matchSchema = new mongoose.Schema({
    id_usuario1: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    id_usuario2: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    id_encuentro: { type: mongoose.Schema.Types.ObjectId, ref: 'Encuentro', required: true },
    fecha_match: { type: Date, required: true }
});
// Definir el esquema de Notificación
const notificacionSchema = new mongoose.Schema({
    id_usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    id_mascota: { type: mongoose.Schema.Types.ObjectId, ref: 'Mascota', required: true },
    mensaje_llegada: { type: Date, required: true },
    contenido: { type: String, required: true },
    leido: { type: Boolean, default: false },
    foto: { type: String } // Base64 encoded string
});
// Definir el esquema de Solicitud
const solicitudSchema = new mongoose.Schema({
    id_usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }
});


// Crear los modelos de usuario y mascota
const Usuario = mongoose.model('Usuario', usuarioSchema);
const Mascota = mongoose.model('Mascotas', mascotaSchema, 'Mascotas');
const Encuentro = mongoose.model('Encuentro', encuentroSchema, 'Encuentros');
const Match = mongoose.model('Match', matchSchema,'Match');
const Notificacion = mongoose.model('Notificacion', notificacionSchema,'Notificaciones');
const Solicitud = mongoose.model('Solicitud', solicitudSchema, 'Solicitudes');



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
    createUsuario,
    Encuentro,
    Match,
    Notificacion,
    Solicitud
};
