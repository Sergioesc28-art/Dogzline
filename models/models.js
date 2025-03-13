const mongoose = require('mongoose');

// Definir el esquema de usuario
const usuarioSchema = new mongoose.Schema({
    NombreCompleto: { type: String, required: true }, // Agregado
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

// Definir el esquema de Encuentro
const encuentroSchema = new mongoose.Schema({
    usuario1_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    usuario2_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    metodos_pago_id: { type: mongoose.Schema.Types.ObjectId, ref: 'MetodoDePago', required: true }
});

// Definir el esquema de Match
const matchSchema = new mongoose.Schema({
    id_mascota1: { type: mongoose.Schema.Types.ObjectId, ref: 'Mascotas', required: true },
    id_mascota2: { type: mongoose.Schema.Types.ObjectId, ref: 'Mascotas', required: true },
    fecha_match: { type: Date, required: true },
    // Añadimos la información de la sala de chat al schema del match
    // In your Match model
    chatRoom: {
        roomId: String,
        created: Date,
        lastActivity: Date
    }
});

const chatRoomSchema = new mongoose.Schema({
    roomId: { type: String, required: true, unique: true },
    matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true },
    participants: [{
        mascotaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mascotas', required: true }
    }],
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

// Crear y exportar el modelo ChatRoom
const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);

// Definir el esquema de Notificacion
const notificacionSchema = new mongoose.Schema({
    id_usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    id_mascota: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mascotas',
        required: true
    },
    mensaje_llegada: {
        type: String,  // Cambiado de Date a String
        required: true
    },
    contenido: {
        type: String,
        required: true
    },
    leido: {
        type: Boolean,
        default: false
    },
    foto: {
        type: String
    },
    fecha_creacion: {
        type: Date,
        default: Date.now  // Añadido para registrar la fecha de creación
    }
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

const messageSchema = new mongoose.Schema({
    chatRoomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatRoom',
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mascotas',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Crear y exportar el modelo Message
const Message = mongoose.model('Message', messageSchema);



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
    Solicitud,
    chatRoomSchema,
    ChatRoom,
    Message
};
