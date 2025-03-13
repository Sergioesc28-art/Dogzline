// Archivo de configuración de socket en el cliente
import io from 'socket.io-client';

const ENDPOINT = 'https://tu-app-en-render.com';
const socket = io(ENDPOINT);

export const joinChat = (conversacionId) => {
  socket.emit('join_chat', conversacionId);
};

export const sendMessage = (messageData) => {
  socket.emit('send_message', messageData);
};

export const receiveMessage = (callback) => {
  socket.on('receive_message', callback);
};

export default socket;