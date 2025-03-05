const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes/ruta'); // Rutas de tu API
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Usuario, Mascota } = require('./models/models.js'); // Importar funciones del modelo
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger'); // Importa la configuración de Swagger
require('dotenv').config();

// Importa el archivo de controladores
const controllers = require('./controllers/Controllers');

const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.JWT_SECRET || '_clave_secreta';

// Conexión a MongoDB
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('No se pudo conectar a MongoDB', err));

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

// Middleware para servir archivos estáticos (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware de logging
app.use(morgan('dev'));

// Middleware para parsear cuerpos JSON y formularios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware CORS para permitir solicitudes desde cualquier origen
const corsOptions = {
    origin: [
        'http://localhost:5173', // Permitir localhost para desarrollo (Vite)
        'https://dogzline-1.onrender.com' // Permitir frontend en producción
    ], // Usa el origen de tu despliegue
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Configuración de Swagger para documentar la API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Endpoint para inicio de sesión
app.post('/api/login', controllers.login);

// Middleware para verificar el token
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

// Aplicar middleware de token a las rutas de /api, excluyendo login y creación de usuarios
app.use('/api', routes);

// Ruta principal para servir el archivo index.html del frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Agregar favicon vacío para evitar el error 404
app.get('/favicon.ico', (req, res) => {
    res.status(204).send();
});

// Ruta 404 en caso de que no exista la ruta solicitada
app.use((req, res, next) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});

// Configuración de Socket.io
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.on('enviar_mensaje', async (datos) => {
        try {
            const nuevoMensaje = new Mensaje(datos);
            await nuevoMensaje.save();
            
            // Emitir a usuarios relevantes
            io.emit('mensaje_nuevo', nuevoMensaje);
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Iniciar el servidor
server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});