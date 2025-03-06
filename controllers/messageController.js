const Mensaje = require('../models/messageModel');
const conversacionController = require('./ConversacionController');

// Crear un nuevo mensaje
exports.createMensaje = async (req, res) => {
    try {
        const { id_conversacion, emisor, receptor, contenido, tipo } = req.body;

        if (!id_conversacion || !emisor || !receptor || !contenido) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        const nuevoMensaje = new Mensaje({
            id_conversacion,
            emisor,
            receptor,
            contenido,
            tipo
        });

        await nuevoMensaje.save();

        // Actualizar la última actualización de la conversación
        await conversacionController.updateConversacion(id_conversacion, nuevoMensaje._id);

        res.status(201).json(nuevoMensaje);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el mensaje', error });
    }
};

// Obtener mensajes por ID de usuario (mascota)
exports.getMensajesByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        const mensajes = await Mensaje.find({
            $or: [{ emisor: userId }, { receptor: userId }]
        }).sort({ fecha_creacion: -1 });

        res.json(mensajes);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los mensajes', error });
    }
};

// Obtener mensajes por ID de conversación
exports.getMensajesByConversacionId = async (req, res) => {
    try {
        const { conversacionId } = req.params;

        const mensajes = await Mensaje.find({ id_conversacion: conversacionId })
            .sort({ fecha_creacion: 1 }); // Orden cronológico ascendente

        res.json(mensajes);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los mensajes', error });
    }
};
