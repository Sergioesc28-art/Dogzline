// Archivo de configuración de socket en el cliente
const io = require('socket.io-client');

const ENDPOINT = 'https://dogzline-j7t6.onrender.com';
const socket = io(ENDPOINT);

const joinChat = (conversacionId) => {
  socket.emit('join_chat', conversacionId);
};

const sendMessage = (messageData) => {
  socket.emit('send_message', messageData);
};

const receiveMessage = (callback) => {
  socket.on('receive_message', callback);
};

module.exports = {
  socket,
  joinChat,
  sendMessage,
  receiveMessage
};
