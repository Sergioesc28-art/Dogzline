const express = require('express');
const router = express.Router();
const controllers = require('../controllers/Controllers');
const { authenticateToken } = require('../middleware/authenticateToken'); // Middleware de autenticación

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

module.exports = router;
