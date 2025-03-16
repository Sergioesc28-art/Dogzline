const mongoose = require('mongoose');
const { ChatRoom, Mascota, Match } = require('../models/models.js'); // Ajusta la ruta según tu estructura

exports.getChatRoomsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Encuentra todas las mascotas del usuario
    const userPets = await Mascota.find({ id_usuario: userId });
    const petIds = userPets.map(pet => pet._id);
    
    // Encuentra todos los matches donde estén involucradas estas mascotas
    const matches = await Match.find({
      $or: [
        { id_mascota1: { $in: petIds } },
        { id_mascota2: { $in: petIds } }
      ]
    });
    
    // Obtén las salas de chat de estos matches
    const chatRoomIds = matches.map(match => match.chatRoom.roomId);
    const chatRooms = await ChatRoom.find({ roomId: { $in: chatRoomIds } })
      .populate({
        path: 'participants.mascotaId',
        select: 'nombre fotos'
      });
    
    res.json(chatRooms);
  } catch (error) {
    console.error('Error al obtener salas de chat:', error);
    res.status(500).json({ 
      message: 'Error al obtener salas de chat', 
      error: error.message 
    });
  }
};