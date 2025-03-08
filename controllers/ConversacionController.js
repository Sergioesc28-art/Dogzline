const Conversacion = require('../models/ConversacionModelo.js');
const Mensaje = require('../models/messageModel');

// Crear una nueva conversación
exports.createConversacion = async (req, res) => {
    try {
        const { participantes } = req.body;

        if (!participantes || participantes.length < 2) {
            return res.status(400).json({ message: 'Se requieren al menos dos participantes' });
        }

        // Verificar si ya existe una conversación con estos participantes
        const conversacionExistente = await Conversacion.findOne({
            participantes: { $all: participantes }
        });

        if (conversacionExistente) {
            console.log('Conversación existente encontrada:', conversacionExistente); // Agrega esta línea para depuración
            return res.status(200).json(conversacionExistente);
        }

        const nuevaConversacion = new Conversacion({ participantes });
        const conversacionGuardada = await nuevaConversacion.save();
        console.log('Nueva conversación guardada:', conversacionGuardada); // Agrega esta línea para depuración

        res.status(201).json(conversacionGuardada);
    } catch (error) {
        console.error('Error al crear la conversación:', error); // Agrega esta línea para depuración
        res.status(500).json({ message: 'Error al crear la conversación', error });
    }
};


// Obtener conversaciones por ID de usuario (mascota)
exports.getConversacionesByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        const conversaciones = await Conversacion.find({
            participantes: userId
        }).sort({ fecha_actualizacion: -1 }).populate('participantes', 'nombre').populate('ultimo_mensaje');

        res.json(conversaciones);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las conversaciones', error });
    }
};

// Actualizar la última actualización de la conversación
exports.updateConversacion = async (conversacionId, mensajeId) => {
    try {
        await Conversacion.findByIdAndUpdate(conversacionId, {
            ultimo_mensaje: mensajeId,
            fecha_actualizacion: Date.now()
        });
    } catch (error) {
        console.error('Error al actualizar la conversación:', error);
    }
};