const mongoose = require('mongoose');

const conversacionSchema = new mongoose.Schema({
    participantes: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Mascotas', 
    }],
    ultimo_mensaje: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mensaje'
    },
    fecha_actualizacion: {
        type: Date, 
        default: Date.now
    }
});

const Conversacion = mongoose.model('Conversacion', conversacionSchema);
module.exports = Conversacion;