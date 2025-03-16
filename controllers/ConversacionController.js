// ConversacionController.js
const { Conversacion } = require('../models/ConversacionModelo');

exports.updateConversacion = async (conversacionId, ultimoMensajeId) => {
  try {
    // Actualizar el campo 'ultimo_mensaje' en la conversación
    const conversacion = await Conversacion.findById(conversacionId);
    if (!conversacion) {
      throw new Error('Conversación no encontrada');
    }

    conversacion.ultimo_mensaje = ultimoMensajeId;
    conversacion.fecha_ultimo_mensaje = new Date();
    await conversacion.save();
  } catch (error) {
    console.error('Error al actualizar la conversación:', error);
  }
};
