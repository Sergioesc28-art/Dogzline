const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { Usuario, Mascota } = require('../models/models.js'); // Asegúrate de importar tus modelos de Mongoose

// Login
exports.login = async (req, res) => {
    const { email, contraseña } = req.body;
    
    console.log('Datos recibidos:', req.body);  // Ver datos recibidos por el servidor

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

        // Comparar las contraseñas
        const isMatch = await bcrypt.compare(contraseña, usuario.contraseña);
        console.log('Contraseña coincidente:', isMatch); // Verificar si las contraseñas coinciden
        if (!isMatch) {
            return res.status(401).json({ mensaje: 'Usuario o contraseña incorrectos' });
        }

        // Generar el token JWT
        const token = jwt.sign(
            { id: usuario._id, role: usuario.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log('Token generado:', token); // Verificar que el token se genera correctamente

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

        // Encripta la contraseña
        const hashedPassword = await bcrypt.hash(contraseña, 10);

        // Crea el nuevo usuario
        const newUser = new Usuario({
            email,
            contraseña: hashedPassword,
            role,
        });

        // Guarda el usuario en la base de datos
        await newUser.save();

        res.status(201).json(newUser);
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
