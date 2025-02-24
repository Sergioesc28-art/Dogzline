
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { Usuario, Mascota,Encuentro, Match,Notificacion, Solicitud } = require('../models/models.js'); // Asegúrate de importar tus modelos de Mongoose
const mongoose = require('mongoose');

// Login
exports.login = async (req, res) => {
    const { email, contraseña } = req.body;
    
    console.log('Datos recibidos:', req.body);

    try {
        if (!email || !contraseña) {
            return res.status(400).json({ mensaje: 'Correo y contraseña son requeridos' });
        }

        // Buscar el usuario por email
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            console.log('Usuario no encontrado');
            return res.status(401).json({ mensaje: 'Usuario o contraseña incorrectos' });
        }

        // Comparar las contraseñas directamente
        if (contraseña !== usuario.contraseña) {
            return res.status(401).json({ mensaje: 'Usuario o contraseña no se encuentra' });
        }

        // Generar el token JWT
        const token = jwt.sign(
            { id: usuario._id, role: usuario.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log('Token generado:', token);

        return res.json({ token });
    } catch (error) {
        console.error("Error en la solicitud de inicio de sesión:", error);
        return res.status(500).json({ mensaje: 'Error en la solicitud de inicio de sesión', error: error.message });
    }
};

// -------- CRUD para Usuarios --------
// Obtener todos los usuarios con paginación
exports.getAllUsuarios = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Número de página, por defecto 1
        const limit = parseInt(req.query.limit) || 10; // Límite de elementos por página, por defecto 10
        const skip = (page - 1) * limit; // Elementos a saltar

        const users = await Usuario.find().skip(skip).limit(limit);
        const totalUsers = await Usuario.countDocuments(); // Número total de usuarios

        res.json({
            total: totalUsers,
            page,
            pages: Math.ceil(totalUsers / limit),
            users
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios', error });
    }
};


exports.getUsuarioById = async (req, res) => {
    try {
        const user = await Usuario.findById(req.params.id); // Encuentra un usuario por ID
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el usuario', error });
    }
};

exports.createUsuario = async (req, res) => {
    try {
        const { email, contraseña, role } = req.body;

        // Verifica si los campos obligatorios están presentes
        if (!email || !contraseña || !role) {
            return res.status(400).json({ message: 'Todos los campos (email, contraseña, role) son requeridos' });
        }

        // Crea el nuevo usuario sin encriptar la contraseña
        const newUser  = new Usuario({
            email,
            contraseña, // Aquí se guarda la contraseña sin encriptar
            role,
        });

        // Guarda el usuario en la base de datos
        await Usuario.create(newUser);

        res.status(201).json(newUser );
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        res.status(500).json({ message: 'Error al crear el usuario', error: error.message });
    }
};

exports.updateUsuario = async (req, res) => {
    try {
        const updatedUser = await Usuario.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Devuelve el documento actualizado
            runValidators: true, // Ejecuta las validaciones del esquema
        });

        if (!updatedUser) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el usuario', error });
    }
};

exports.deleteUsuario = async (req, res) => {
    try {
        const deletedUser = await Usuario.findByIdAndDelete(req.params.id); // Elimina por ID
        if (!deletedUser) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json(deletedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el usuario', error });
    }
};

// -------- CRUD para Mascotas --------
// Obtener todas las mascotas del usuario con paginación
exports.getAllMascotasByUser = async (req, res) => {
    try {
        const userId = req.user.id; // Asegúrate de que el ID del usuario esté disponible en req.user
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const mascotas = await Mascota.find({ id_usuario: userId }).skip(skip).limit(limit);
        const totalMascotas = await Mascota.countDocuments({ id_usuario: userId });

        res.json({
            total: totalMascotas,
            page,
            pages: Math.ceil(totalMascotas / limit),
            mascotas
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las mascotas', error });
    }
};
// Obtener todas las mascotas con paginación
exports.getAllMascotas = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const mascotas = await Mascota.find().skip(skip).limit(limit);
        const totalMascotas = await Mascota.countDocuments();

        res.json({
            total: totalMascotas,
            page,
            pages: Math.ceil(totalMascotas / limit),
            mascotas
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las mascotas', error });
    }
};

// Obtener una mascota por ID
exports.getMascotaById = async (req, res) => {
    try {
        const mascota = await Mascota.findById(req.params.id);
        if (!mascota) return res.status(404).json({ message: 'Mascota no encontrada' });
        res.json(mascota);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la mascota', error });
    }
};

// Crear una nueva mascota
exports.createMascota = async (req, res) => {
    try {
        const newMascota = new Mascota(req.body);
        await newMascota.save();
        res.status(201).json(newMascota);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la mascota', error });
    }
};

// Actualizar una mascota por ID
exports.updateMascota = async (req, res) => {
    try {
        const updatedMascota = await Mascota.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Devuelve el documento actualizado
            runValidators: true, // Ejecuta las validaciones del esquema
        });

        if (!updatedMascota) return res.status(404).json({ message: 'Mascota no encontrada' });
        res.json(updatedMascota);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la mascota', error });
    }
};

// Eliminar una mascota por ID
exports.deleteMascota = async (req, res) => {
    try {
        const deletedMascota = await Mascota.findByIdAndDelete(req.params.id);
        if (!deletedMascota) return res.status(404).json({ message: 'Mascota no encontrada' });
        res.json(deletedMascota);
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la mascota', error });
    }
};

// -------- CRUD para Encuentros --------
exports.getAllEncuentros = async (req, res) => {
    try {
        const encuentros = await Encuentro.find();
        res.json(encuentros);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los encuentros', error });
    }
};

exports.getEncuentroById = async (req, res) => {
    try {
        const { id } = req.params;
        const encuentro = await Encuentro.findById(id);
        if (!encuentro) {
            return res.status(404).json({ message: 'Encuentro no encontrado' });
        }
        res.json(encuentro);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el encuentro', error });
    }
};

exports.createEncuentro = async (req, res) => {
    try {
        const nuevoEncuentro = new Encuentro(req.body);
        await nuevoEncuentro.save();
        res.status(201).json(nuevoEncuentro);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el encuentro', error });
    }
};

exports.updateEncuentro = async (req, res) => {
    try {
        const { id } = req.params;
        const encuentroActualizado = await Encuentro.findByIdAndUpdate(id, req.body, { new: true });
        if (!encuentroActualizado) {
            return res.status(404).json({ message: 'Encuentro no encontrado' });
        }
        res.json(encuentroActualizado);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el encuentro', error });
    }
};

exports.deleteEncuentro = async (req, res) => {
    try {
        const { id } = req.params;
        const encuentroEliminado = await Encuentro.findByIdAndDelete(id);
        if (!encuentroEliminado) {
            return res.status(404).json({ message: 'Encuentro no encontrado' });
        }
        res.json({ message: 'Encuentro eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el encuentro', error });
    }
};

// -------- CRUD para Matches --------
exports.getAllMatches = async (req, res) => {
    try {
        const matches = await Match.find();
        res.json(matches);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los matches', error });
    }
};

exports.getMatchById = async (req, res) => {
    try {
        const { id } = req.params;
        const match = await Match.findById(id);
        if (!match) {
            return res.status(404).json({ message: 'Match no encontrado' });
        }
        res.json(match);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el match', error });
    }
};

exports.createMatch = async (req, res) => {
    try {
        const nuevoMatch = new Match(req.body);
        await nuevoMatch.save();
        res.status(201).json(nuevoMatch);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el match', error });
    }
};

exports.updateMatch = async (req, res) => {
    try {
        const { id } = req.params;
        const matchActualizado = await Match.findByIdAndUpdate(id, req.body, { new: true });
        if (!matchActualizado) {
            return res.status(404).json({ message: 'Match no encontrado' });
        }
        res.json(matchActualizado);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el match', error });
    }
};

exports.deleteMatch = async (req, res) => {
    try {
        const { id } = req.params;
        const matchEliminado = await Match.findByIdAndDelete(id);
        if (!matchEliminado) {
            return res.status(404).json({ message: 'Match no encontrado' });
        }
        res.json({ message: 'Match eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el match', error });
    }
};

//CRUD NOTIFIICACIONES
exports.getNotificacionesByUser = async (req, res) => {
    try {
        // Obtener el ID del usuario del token (que viene en req.user.id)
        const userId = req.user.id;
        
        // Validar que userId exista
        if (!userId) {
            return res.status(400).json({ 
                message: 'Usuario no autenticado',
                error: 'No user ID found in token'
            });
        }

        // Validar formato del ID
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ 
                message: 'ID de usuario inválido',
                error: 'Invalid ObjectId format'
            });
        }

        const notificaciones = await Notificacion.find({ id_usuario: userId })
            .populate('id_mascota', 'nombre')
            .sort({ mensaje_llegada: -1 });

        res.json(notificaciones);
    } catch (error) {
        console.error('Error al obtener notificaciones:', error);
        res.status(500).json({ 
            message: 'Error al obtener las notificaciones del usuario',
            error: error.message 
        });
    }
};
exports.getAllNotificaciones = async (req, res) => {
    try {
        const notificaciones = await Notificacion.find();
        res.json(notificaciones);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las notificaciones', error });
    }
};

exports.getNotificacionById = async (req, res) => {
    try {
        const { id } = req.params;
        const notificacion = await Notificacion.findById(id);
        if (!notificacion) {
            return res.status(404).json({ message: 'Notificación no encontrada' });
        }
        res.json(notificacion);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la notificación', error });
    }
};

exports.createNotificacion = async (req, res) => {
    try {
        const nuevaNotificacion = new Notificacion(req.body);
        await nuevaNotificacion.save();
        res.status(201).json(nuevaNotificacion);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la notificación', error });
    }
};

exports.updateNotificacion = async (req, res) => {
    try {
        const { id } = req.params;
        const notificacionActualizada = await Notificacion.findByIdAndUpdate(id, req.body, { new: true });
        if (!notificacionActualizada) {
            return res.status(404).json({ message: 'Notificación no encontrada' });
        }
        res.json(notificacionActualizada);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la notificación', error });
    }
};

exports.deleteNotificacion = async (req, res) => {
    try {
        const { id } = req.params;
        const notificacionEliminada = await Notificacion.findByIdAndDelete(id);
        if (!notificacionEliminada) {
            return res.status(404).json({ message: 'Notificación no encontrada' });
        }
        res.json({ message: 'Notificación eliminada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la notificación', error });
    }
};
//CRUD SOLICITUDES
exports.getAllSolicitudes = async (req, res) => {
    try {
        const solicitudes = await Solicitud.find();
        res.json(solicitudes);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las solicitudes', error });
    }
};

exports.getSolicitudById = async (req, res) => {
    try {
        const { id } = req.params;
        const solicitud = await Solicitud.findById(id);
        if (!solicitud) {
            return res.status(404).json({ message: 'Solicitud no encontrada' });
        }
        res.json(solicitud);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la solicitud', error });
    }
};

exports.createSolicitud = async (req, res) => {
    try {
        const nuevaSolicitud = new Solicitud(req.body);
        await nuevaSolicitud.save();
        res.status(201).json(nuevaSolicitud);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la solicitud', error });
    }
};

exports.updateSolicitud = async (req, res) => {
    try {
        const { id } = req.params;
        const solicitudActualizada = await Solicitud.findByIdAndUpdate(id, req.body, { new: true });
        if (!solicitudActualizada) {
            return res.status(404).json({ message: 'Solicitud no encontrada' });
        }
        res.json(solicitudActualizada);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la solicitud', error });
    }
};

exports.deleteSolicitud = async (req, res) => {
    try {
        const { id } = req.params;
        const solicitudEliminada = await Solicitud.findByIdAndDelete(id);
        if (!solicitudEliminada) {
            return res.status(404).json({ message: 'Solicitud no encontrada' });
        }
        res.json({ message: 'Solicitud eliminada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la solicitud', error });
    }
};