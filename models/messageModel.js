const mongoose = require('mongoose');

const mensajeSchema = new mongoose.Schema({
    id_conversacion: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversacion', required: true },
    emisor: { type: mongoose.Schema.Types.ObjectId, ref: 'Mascotas', required: true },
    receptor: { type: mongoose.Schema.Types.ObjectId, ref: 'Mascotas', required: true },
    contenido: { type: String, required: true },
    tipo: { type: String, enum: ['texto', 'imagen', 'archivo'], default: 'texto' },
    leido: { type: Boolean, default: false },
    fecha_creacion: { type: Date, default: Date.now },
    fecha_leido: { type: Date }
});

const Mensaje = mongoose.model('Mensaje', mensajeSchema);

module.exports = Mensaje;