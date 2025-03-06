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
            { expiresIn: '4h' }
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
        const user = await Usuario.findById(req.params.id).select('-contraseña'); // Excluir contraseña

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Buscar las mascotas asociadas a este usuario
        const mascotas = await Mascota.find({ id_usuario: req.params.id });

        res.json({
            usuario: user,
            mascotas: mascotas
        });
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
//creacion de mascotas
exports.createMascota = async (req, res) => {
    try {
        const { nombre, edad, raza, sexo, color, vacunas, caracteristicas, certificado, fotos, Comportamiento, id_usuario } = req.body;

        // Verifica si los campos obligatorios están presentes
        if (!nombre || !edad || !raza || !sexo || !color || !vacunas || !caracteristicas || !certificado || !fotos || !Comportamiento || !id_usuario) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        // Crea la nueva mascota
        const nuevaMascota = new Mascota({
            nombre,
            edad,
            raza,
            sexo,
            color,
            vacunas,
            caracteristicas,
            certificado,
            fotos,
            Comportamiento,
            id_usuario
        });

        // Guarda la mascota en la base de datos
        await nuevaMascota.save();

        res.status(201).json(nuevaMascota);
    } catch (error) {
        console.error('Error al crear la mascota:', error);
        res.status(500).json({ message: 'Error al crear la mascota', error: error.message });
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
// Dar like a una mascota
exports.darLike = async (req, res) => {
    try {
      const { idMascotaLiked } = req.body; // ID de la mascota que recibe el like
      const idUsuarioWhoLiked = req.user.id; // ID del usuario actual
  
      if (!idMascotaLiked) {
        return res.status(400).json({ message: 'Se requiere el ID de la mascota.' });
      }
  
      // Crea un encuentro o notificación de tipo "like"
      const nuevoEncuentro = new Encuentro({
        idMascotaLiked,
        idUsuarioWhoLiked,
      });
  
      await nuevoEncuentro.save(); // Guarda en la base de datos
      res.status(201).json({ message: 'Like registrado exitosamente', encuentro: nuevoEncuentro });
    } catch (error) {
      res.status(500).json({ message: 'Error al registrar el like', error });
    }
  };

// Obtener los likes de una mascota
  exports.getLikesDeMascota = async (req, res) => {
    const { idMascota } = req.params;
  
    try {
      const likes = await Encuentro.find({ idMascotaLiked: idMascota })
        .populate('idUsuarioWhoLiked', 'email') // Trae detalles del usuario que dio like
        .populate('idMascotaLiked', 'nombre raza fotos'); // Trae detalles de la mascota
  
      res.status(200).json({ likes });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los likes', error });
    }
  };
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
// Obtener los matches de una mascota
exports.getMatchesByMascota = async (req, res) => {
    try {
        const mascotaId = req.params.mascotaId; // El ID de la mascota se pasa en la URL

        const matches = await Match.find({
            $or: [{ id_mascota1: mascotaId }, { id_mascota2: mascotaId }]
        })
            .populate('id_mascota1', 'nombre')
            .populate('id_mascota2', 'nombre');

        res.status(200).json(matches);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los matches', error });
    }
};

// Obtener todos los matches
exports.getAllMatches = async (req, res) => {
    try {
        const matches = await Match.find()
            .populate('id_mascota1', 'nombre')
            .populate('id_mascota2', 'nombre');
        res.json(matches);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los matches', error });
    }
};

// Obtener un match por ID
exports.getMatchById = async (req, res) => {
    try {
        const { id } = req.params;
        const match = await Match.findById(id)
            .populate('id_mascota1', 'nombre')
            .populate('id_mascota2', 'nombre');

        if (!match) {
            return res.status(404).json({ message: 'Match no encontrado' });
        }
        res.json(match);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el match', error });
    }
};

// Crear un nuevo match
exports.createMatch = async (req, res) => {
    try {
        const nuevoMatch = new Match(req.body);
        await nuevoMatch.save();
        res.status(201).json(nuevoMatch);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el match', error });
    }
};

// Actualizar un match
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

// Eliminar un match
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
    
    const userId = req.params.userId; // Obtener userId de los parámetros de la URL
    console.log('ID de usuario extraído:', userId);
    try {
        console.log('=== Inicio de getNotificacionesByUser ===');
        console.log('Token recibido:', req.headers.authorization);
        console.log('Usuario decodificado:', req.user);

        const userId = req.params.userId; // Obtener userId de los parámetros de la URL
        console.log('ID de usuario extraído:', userId);

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.log('ID de usuario inválido');
            return res.status(400).json({
                message: 'ID de usuario inválido',
                error: 'Invalid ObjectId format'
            });
        }

        console.log('Intentando buscar notificaciones para userId:', userId);

        try {
            const notificaciones = await Notificacion.find({ id_usuario: userId })
    .populate('id_mascota', 'nombre edad raza color fotos') // Incluye más campos necesarios
    .sort({ mensaje_llegada: -1 });

            console.log('Notificaciones encontradas:', notificaciones);

            if (!notificaciones || notificaciones.length === 0) { // Verifica si el array está vacío
                console.log('No se encontraron notificaciones');
                return res.status(404).json({
                    message: 'No se encontraron notificaciones'
                });
            }

            console.log('Enviando respuesta exitosa');
            res.json(notificaciones);
        } catch (populateError) {
            console.error('Error durante populate:', populateError);
            return res.status(500).json({
                message: 'Error al obtener las notificaciones del usuario (populate)',
                error: populateError.message,
                stack: process.env.NODE_ENV === 'development' ? populateError.stack : undefined
            });
        }

    } catch (error) {
        console.error('=== Error en getNotificacionesByUser ===');
        console.error('Error completo:', error);
        console.error('Stack trace:', error.stack);

        res.status(500).json({
            message: 'Error al obtener las notificaciones del usuario',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
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
        const { id_usuario, id_mascota, mensaje_llegada, contenido, foto } = req.body;

        // Validar ObjectId
        if (!mongoose.Types.ObjectId.isValid(id_usuario)) {
            return res.status(400).json({
                message: "ID de usuario inválido"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(id_mascota)) {
            return res.status(400).json({
                message: "ID de mascota inválido"
            });
        }

        const nuevaNotificacion = new Notificacion({
            id_usuario,
            id_mascota,
            mensaje_llegada,
            contenido,
            foto
        });

        await nuevaNotificacion.save();
        res.status(201).json(nuevaNotificacion);

    } catch (error) {
        console.error("❌ Error al crear la notificación:", error);
        res.status(500).json({
            message: "Error al crear la notificación",
            errorDetalle: error.message
        });
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


exports.listarUsuarios = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';

        // Filtro de búsqueda en NombreCompleto, email y role
        const query = {
            $or: [
                { NombreCompleto: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { role: { $regex: search, $options: 'i' } }
            ]
        };

        // Obtener usuarios paginados y sin contraseña
        const users = await Usuario.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .select('-contraseña'); // Excluir contraseña por seguridad

        // Contar usuarios filtrados
        const totalUsers = await Usuario.countDocuments(query);

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
// dar like a una mascota
exports.darLike = async (req, res) => {
    try {
        const { idMascotaLiked } = req.body; // ID de la mascota que recibe el like
        const idUsuarioWhoLiked = req.user.id; // ID del usuario actual

        if (!idMascotaLiked) {
            return res.status(400).json({ message: 'Se requiere el ID de la mascota.' });
        }

        // Crea un encuentro o notificación de tipo "like"
        const nuevoEncuentro = new Encuentro({
            idMascotaLiked,
            idUsuarioWhoLiked,
        });

        await nuevoEncuentro.save(); // Guarda en la base de datos
        res.status(201).json({ message: 'Like registrado exitosamente', encuentro: nuevoEncuentro });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar el like', error });
    }
};