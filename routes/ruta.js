const express = require('express');
const router = express.Router();
const controllers = require('../controllers/Controllers');
const { authenticateToken } = require('../middleware/authenticateToken'); // Middleware de autenticación
const messageController = require('../controllers/messageController');
const conversacionController = require('../controllers/ConversacionController');

/**
 * @swagger
 * /usuarios/listar:
 *   get:
 *     summary: Obtiene todos los usuarios con paginación y búsqueda
 *     security:
 *       - BearerAuth: []
 *     tags: [Usuarios]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página (comienza desde 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de usuarios por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Término de búsqueda (NombreCompleto, email o role)
 *     responses:
 *       200:
 *         description: Lista de usuarios filtrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 */
router.get('/usuarios/listar', authenticateToken, controllers.listarUsuarios);

// Ruta para el inicio de sesión
router.post('/login', controllers.login);

// -------- Rutas para Usuarios --------

// Anotación Swagger para obtener todos los usuarios con paginación
/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Obtiene todos los usuarios con paginación
 *     security:
 *       - BearerAuth: []
 *     tags: [Usuarios]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página (comienza desde 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de elementos por página
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 */
router.get('/usuarios', authenticateToken, controllers.getAllUsuarios);

// Anotación Swagger para obtener un usuario por ID
/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Obtiene un usuario por ID
 *     security:
 *       - BearerAuth: []
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID único del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/usuarios/:id', authenticateToken, controllers.getUsuarioById);

// Anotación Swagger para crear un usuario
/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Crea un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       201:
 *         description: Usuario creado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 */
router.post('/usuarios', controllers.createUsuario);

// Anotación Swagger para actualizar un usuario
/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Actualiza un usuario por ID
 *     security:
 *       - BearerAuth: []
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID único del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuario no encontrado
 */
router.put('/usuarios/:id', authenticateToken, controllers.updateUsuario);

// Anotación Swagger para eliminar un usuario
/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Elimina un usuario por ID
 *     security:
 *       - BearerAuth: []
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID único del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuario no encontrado
 */
router.delete('/usuarios/:id', authenticateToken, controllers.deleteUsuario);

// -------- Rutas para Mascotas --------

// Nueva ruta para obtener las mascotas del usuario
router.get('/mascotas/usuario', authenticateToken, controllers.getAllMascotasByUser);
// Anotación Swagger para obtener todas las mascotas con paginación
/**
 * @swagger
 * /mascotas:
 *   get:
 *     summary: Obtiene todas las mascotas con paginación
 *     tags: [Mascotas]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página (comienza desde 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de elementos por página
 *     responses:
 *       200:
 *         description: Lista de mascotas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mascota'
 */
router.get('/mascotas', authenticateToken, controllers.getAllMascotas);

// Anotación Swagger para obtener una mascota por ID
/**
 * @swagger
 * /mascotas/{id}:
 *   get:
 *     summary: Obtiene una mascota por ID
 *     tags: [Mascotas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID único de la mascota
 *     responses:
 *       200:
 *         description: Mascota encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mascota'
 *       404:
 *         description: Mascota no encontrada
 */
router.get('/mascotas/:id', authenticateToken, controllers.getMascotaById);

// Anotación Swagger para crear una mascota
/**
 * @swagger
 * /mascotas:
 *   post:
 *     summary: Crea una nueva mascota
 *     tags: [Mascotas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Mascota'
 *     responses:
 *       201:
 *         description: Mascota creada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mascota'
 */
router.post('/mascotas', authenticateToken, controllers.createMascota);

// Anotación Swagger para actualizar una mascota
/**
 * @swagger
 * /mascotas/{id}:
 *   put:
 *     summary: Actualiza una mascota por ID
 *     tags: [Mascotas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID único de la mascota
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Mascota'
 *     responses:
 *       200:
 *         description: Mascota actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mascota'
 *       404:
 *         description: Mascota no encontrada
 */
router.put('/mascotas/:id', authenticateToken, controllers.updateMascota);

// Anotación Swagger para eliminar una mascota
/**
 * @swagger
 * /mascotas/{id}:
 *   delete:
 *     summary: Elimina una mascota por ID
 *     tags: [Mascotas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID único de la mascota
 *     responses:
 *       200:
 *         description: Mascota eliminada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mascota'
 *       404:
 *         description: Mascota no encontrada
 */
router.delete('/mascotas/:id', authenticateToken, controllers.deleteMascota);

// -------- Rutas para Notificaciones --------

/**
 * @swagger
 * /notificaciones/usuario/{userId}:
 *   get:
 *     summary: Obtiene las notificaciones del usuario
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID del usuario
 */
router.get('/notificaciones/usuario/:userId', authenticateToken, controllers.getNotificacionesByUser);

// Anotación Swagger para obtener una notificación por ID
/**
 * @swagger
 * /notificaciones/{id}:
 *   get:
 *     summary: Obtiene una notificación por ID
 *     security:
 *       - BearerAuth: []
 *     tags: [Notificaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID único de la notificación
 *     responses:
 *       200:
 *         description: Notificación encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notificacion'
 *       404:
 *         description: Notificación no encontrada
 */
router.get('/notificaciones/:id', authenticateToken, controllers.getNotificacionById);

router.get('/notificaciones', authenticateToken, controllers.getAllNotificaciones);

// Anotación Swagger para crear una notificación
/**
 * @swagger
 * /notificaciones:
 *   post:
 *     summary: Crea una nueva notificación
 *     tags: [Notificaciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Notificacion'
 *     responses:
 *       201:
 *         description: Notificación creada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notificacion'
 */
router.post('/notificaciones', authenticateToken, controllers.createNotificacion);

// Anotación Swagger para actualizar una notificación
/**
 * @swagger
 * /notificaciones/{id}:
 *   put:
 *     summary: Actualiza una notificación por ID
 *     security:
 *       - BearerAuth: []
 *     tags: [Notificaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID único de la notificación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Notificacion'
 *     responses:
 *       200:
 *         description: Notificación actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notificacion'
 *       404:
 *         description: Notificación no encontrada
 */
router.put('/notificaciones/:id', authenticateToken, controllers.updateNotificacion);

// Anotación Swagger para eliminar una notificación
/**
 * @swagger
 * /notificaciones/{id}:
 *   delete:
 *     summary: Elimina una notificación por ID
 *     security:
 *       - BearerAuth: []
 *     tags: [Notificaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID único de la notificación
 *     responses:
 *       200:
 *         description: Notificación eliminada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notificacion'
 *       404:
 *         description: Notificación no encontrada
 */
router.delete('/notificaciones/:id', authenticateToken, controllers.deleteNotificacion);


// -------- Rutas para Solicitudes --------

// Anotación Swagger para obtener todas las solicitudes
/**
 * @swagger
 * /solicitudes:
 *   get:
 *     summary: Obtiene todas las solicitudes
 *     security:
 *       - BearerAuth: []
 *     tags: [Solicitudes]
 *     responses:
 *       200:
 *         description: Lista de solicitudes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Solicitud'
 */
router.get('/solicitudes', authenticateToken, controllers.getAllSolicitudes);

// Anotación Swagger para obtener una solicitud por ID
/**
 * @swagger
 * /solicitudes/{id}:
 *   get:
 *     summary: Obtiene una solicitud por ID
 *     security:
 *       - BearerAuth: []
 *     tags: [Solicitudes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID único de la solicitud
 *     responses:
 *       200:
 *         description: Solicitud encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Solicitud'
 *       404:
 *         description: Solicitud no encontrada
 */
router.get('/solicitudes/:id', authenticateToken, controllers.getSolicitudById);


// Anotación Swagger para crear una solicitud
/**
 * @swagger
 * /solicitudes:
 *   post:
 *     summary: Crea una nueva solicitud
 *     tags: [Solicitudes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Solicitud'
 *     responses:
 *       201:
 *         description: Solicitud creada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Solicitud'
 */
router.post('/solicitudes', authenticateToken, controllers.createSolicitud);

// Anotación Swagger para actualizar una solicitud
/**
 * @swagger
 * /solicitudes/{id}:
 *   put:
 *     summary: Actualiza una solicitud por ID
 *     security:
 *       - BearerAuth: []
 *     tags: [Solicitudes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID único de la solicitud
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Solicitud'
 *     responses:
 *       200:
 *         description: Solicitud actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Solicitud'
 *       404:
 *         description: Solicitud no encontrada
 */
router.put('/solicitudes/:id', authenticateToken, controllers.updateSolicitud);

// Anotación Swagger para eliminar una solicitud
/**
 * @swagger
 * /solicitudes/{id}:
 *   delete:
 *     summary: Elimina una solicitud por ID
 *     security:
 *       - BearerAuth: []
 *     tags: [Solicitudes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID único de la solicitud
 *     responses:
 *       200:
 *         description: Solicitud eliminada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Solicitud'
 *       404:
 *         description: Solicitud no encontrada
 */
router.delete('/solicitudes/:id', authenticateToken, controllers.deleteSolicitud);
// -------- Rutas para Encuentros --------
// Anotación Swagger para obtener todos los encuentros
/**
 * @swagger
 * /encuentros:
 *   get:
 *     summary: Obtiene todos los encuentros
 *     security:
 *       - BearerAuth: []
 *     tags: [Encuentros]
 *     responses:
 *       200:
 *         description: Lista de encuentros
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Encuentro'
 */
router.get('/encuentros', authenticateToken, controllers.getAllEncuentros);
// Anotación Swagger para obtener un encuentro por ID
/**
 * @swagger
 * /encuentros/{id}:
 *   get:
 *     summary: Obtiene un encuentro por ID
 *     security:
 *       - BearerAuth: []
 *     tags: [Encuentros]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID único del encuentro
 *     responses:
 *       200:
 *         description: Encuentro encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Encuentro'
 *       404:
 *         description: Encuentro no encontrado
 */
router.get('/encuentros/:id', authenticateToken, controllers.getEncuentroById);
// Anotación Swagger para crear un encuentro
/**
 * @swagger
 * /encuentros:
 *   post:
 *     summary: Crea un nuevo encuentro
 *     tags: [Encuentros]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Encuentro'
 *     responses:
 *       201:
 *         description: Encuentro creado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Encuentro'
 */
router.post('/encuentros', authenticateToken, controllers.createEncuentro);
// Anotación Swagger para actualizar un encuentro
/**
 * @swagger
 * /encuentros/{id}:
 *   put:
 *     summary: Actualiza un encuentro por ID
 *     security:
 *       - BearerAuth: []
 *     tags: [Encuentros]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID único del encuentro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Encuentro'
 *     responses:
 *       200:
 *         description: Encuentro actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Encuentro'
 *       404:
 *         description: Encuentro no encontrado
 */
router.put('/encuentros/:id', authenticateToken, controllers.updateEncuentro);
// Anotación Swagger para eliminar un encuentro
/**
 * @swagger
 * /encuentros/{id}:
 *   delete:
 *     summary: Elimina un encuentro por ID
 *     security:
 *       - BearerAuth: []
 *     tags: [Encuentros]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID único del encuentro
 *     responses:
 *       200:
 *         description: Encuentro eliminado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Encuentro'
 *       404:
 *         description: Encuentro no encontrado
 */
router.delete('/encuentros/:id', authenticateToken, controllers.deleteEncuentro);
// -------- Rutas para Matchs --------
//router.get('/api/matches/:userId', authenticateToken, controllers.getMatchesByUser);
// Anotación Swagger para obtener todos los matchs
/**
 * @swagger
 * /matchs:
 *   get:
 *     summary: Obtiene todos los matchs
 *     security:
 *       - BearerAuth: []
 *     tags: [Matchs]
 *     responses:
 *       200:
 *         description: Lista de matchs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Match'
 */
router.get('/matchs', authenticateToken, controllers.getAllMatches);
// Anotación Swagger para obtener un match por ID
/**
 * @swagger
 * /matchs/{id}:
 *   get:
 *     summary: Obtiene un match por ID
 *     security:
 *       - BearerAuth: []
 *     tags: [Matchs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID único del match
 *     responses:
 *       200:
 *         description: Match encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Match'
 *       404:
 *         description: Match no encontrado
 */
router.get('/matchs/:id', authenticateToken, controllers.getMatchById);
// Anotación Swagger para crear un match
/**
 * @swagger
 * /matchs:
 *   post:
 *     summary: Crea un nuevo match
 *     tags: [Matchs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Match'
 *     responses:
 *       201:
 *         description: Match creado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Match'
 */
router.post('/matchs', authenticateToken, controllers.createMatch);
// Anotación Swagger para eliminar un match
/**
 * @swagger
 * /matchs/{id}:
 *   delete:
 *     summary: Elimina un match por ID
 *     security:
 *       - BearerAuth: []
 *     tags: [Matchs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID único del match
 *     responses:
 *       200:
 *         description: Match eliminado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Match'
 *       404:
 *         description: Match no encontrado
 */
router.delete('/matchs/:id', authenticateToken, controllers.deleteMatch);
// Anotación Swagger para actualizar un match
/**
 * @swagger
 * /matchs/{id}:
 *   put:
 *     summary: Actualiza un match por ID
 *     security:
 *       - BearerAuth: []
 *     tags: [Matchs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID único del match
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Match'
 *     responses:
 *       200:
 *         description: Match actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Match'
 *       404:
 *         description: Match no encontrado
 */
router.put('/matchs/:id', authenticateToken, controllers.updateMatch);

// -------- Rutas para Likes --------
// Ruta para dar like a una mascota
router.post('/api/likes', authenticateToken, controllers.darLike);

//---------Rutas para mensajes---------
router.post('/mensajes', authenticateToken, controllers.createMensaje);
router.get('/mensajes/conversacion/:conversacionId', authenticateToken, controllers.getMensajesByConversacionId);
router.get('/mensajes/usuario/:userId', authenticateToken, messageController.getMensajesByUserId);


// Rutas para Conversaciones
router.post('/conversaciones', authenticateToken, conversacionController.createConversacion);
router.get('/conversaciones/usuario/:userId', authenticateToken, conversacionController.getConversacionesByUserId);
module.exports = router;

router.post('/', conversacionController.createConversacion);
router.get('/user/:userId', conversacionController.getConversacionesByUserId);

module.exports = router;