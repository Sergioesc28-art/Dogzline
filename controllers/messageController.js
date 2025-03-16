const mongoose = require('mongoose');
const { Message } = require('../models/messageModel');
const conversacionController = require('./ConversacionController');

// Crear un nuevo mensaje
exports.createMensaje = async (req, res) => {
  try {
    const { id_conversacion, emisor, receptor, contenido, tipo } = req.body;

    if (!id_conversacion || !emisor || !receptor || !contenido) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const nuevoMensaje = new Message({
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

// Obtener mensajes por ID de conversación
exports.getMensajesByConversacionId = async (req, res) => {
  try {
    const { conversacionId } = req.params;

    // Validar que el ID de la conversación sea válido
    if (!mongoose.Types.ObjectId.isValid(conversacionId)) {
      return res.status(400).json({ message: 'ID de conversación inválido' });
    }

    // Obtener los mensajes de la conversación ordenados por fecha
    const mensajes = await Message.find({ id_conversacion: conversacionId })
      .sort({ fecha_creacion: 1 }) // Orden ascendente (del más antiguo al más reciente)
      .populate('emisor receptor', 'nombre'); // Opcional: incluir detalles del emisor y receptor

    // Verificar si se encontraron mensajes
    if (!mensajes || mensajes.length === 0) {
      return res.status(404).json({ message: 'No se encontraron mensajes para esta conversación' });
    }

    // Responder con los mensajes
    res.json({
      total: mensajes.length,
      mensajes
    });
  } catch (error) {
    console.error('Error al obtener los mensajes:', error);
    res.status(500).json({ message: 'Error al obtener los mensajes', error: error.message });
  }
};

// Obtener mensajes por ID de usuario (mascota)
exports.getMensajesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const mensajes = await Message.find({
      $or: [{ emisor: userId }, { receptor: userId }]
    }).sort({ fecha_creacion: -1 });

    res.json(mensajes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los mensajes', error });
  }
};
