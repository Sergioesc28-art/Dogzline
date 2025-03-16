const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes/ruta'); // Rutas de tu API
const messageRoutes = require('./routes/messageRoutes'); // Ruta de los mensajes
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Usuario, Mascota, Message, ChatRoom } = require('./models/models.js'); // Importar modelos
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger'); // Configuración de Swagger
require('dotenv').config();

// Importa controladores y socketHandler
const controllers = require('./controllers/Controllers');

const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.JWT_SECRET || '_clave_secreta';

// Conexión a MongoDB
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI)
    .then(() => console.log('✅ Conectado a MongoDB'))
    .catch(err => console.error('❌ No se pudo conectar a MongoDB', err));

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Importar manejador de WebSockets
require('./socket/socketHandler')(io);

// Middleware para servir archivos estáticos (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware de logging
app.use(morgan('dev'));

// Middleware para parsear JSON y formularios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware CORS
const corsOptions = {
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true 
};
app.use(cors(corsOptions));

// Configuración de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Endpoint para login
app.post('/api/login', controllers.login);

// Middleware para verificar tokens
function verificarToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'Token no proporcionado' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token inválido' });
        }
        req.userId = decoded.id;
        req.role = decoded.role;
        next();
    });
}

// Aplicar middleware de autenticación en rutas protegidas
app.use('/api', routes);

// Usar las rutas de mensajes
app.use('/api/messages', messageRoutes);

// Ruta principal para servir el frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Agregar favicon vacío para evitar error 404
app.get('/favicon.ico', (req, res) => {
    res.status(204).send();
});

// Middleware 404 para rutas inexistentes
app.use((req, res, next) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});

// WebSocket Logic
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
  
    socket.on('join_chat', (roomId) => {
        socket.join(roomId);
        console.log(`Usuario unido a la sala: ${roomId}`);
    });

    socket.on('send_message', async (messageData) => {
        try {
            // Guardar mensaje en la base de datos
            const newMessage = new Message({
                chatRoomId: messageData.chatRoomId,
                senderId: messageData.senderId,
                content: messageData.content
            });
            
            await newMessage.save();
            
            // Actualizar última actividad de la sala de chat
            await ChatRoom.findByIdAndUpdate(
                messageData.chatRoomId, 
                { lastActivity: new Date() }
            );
            
            // Broadcast el mensaje a todos los miembros de la sala
            io.to(messageData.chatRoomId).emit('receive_message', newMessage);
        } catch (error) {
            console.error('Error guardando mensaje:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Iniciar el servidor
server.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});
