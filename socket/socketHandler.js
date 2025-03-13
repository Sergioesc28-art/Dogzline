const { updateConversacion } = require('../controllers/ConversacionController');
const Mensaje = require('../models/messageModel');
const Conversacion = require('../models/ConversacionModelo');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Usuario conectado:', socket.id);

    // Unirse a una sala de chat (conversación)
    socket.on('join_chat', (conversacionId) => {
      socket.join(conversacionId);
      console.log(`Usuario ${socket.id} se unió a la conversación ${conversacionId}`);
    });

    // Enviar mensaje
    socket.on('send_message', async (data) => {
      try {
        const { id_conversacion, emisor, receptor, contenido, tipo = 'texto' } = data;
        
        // Guardar el mensaje en la base de datos
        const nuevoMensaje = new Mensaje({
          id_conversacion,
          emisor,
          receptor,
          contenido,
          tipo
        });
        
        await nuevoMensaje.save();
        
        // Actualizar la conversación con el último mensaje
        await updateConversacion(id_conversacion, nuevoMensaje._id);
        
        // Emitir el mensaje a todos los usuarios en la sala
        io.to(id_conversacion).emit('receive_message', nuevoMensaje);
      } catch (error) {
        console.error('Error al enviar mensaje:', error);
        socket.emit('error', { message: 'Error al enviar el mensaje' });
      }
    });

    // Manejar desconexión
    socket.on('disconnect', () => {
      console.log('Usuario desconectado:', socket.id);
    });
  });
};