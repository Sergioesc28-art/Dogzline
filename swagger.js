const swaggerJsDoc = require('swagger-jsdoc');

// Configuración de Swagger
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API de Mascotas",
            version: "1.0.0",
            description: "Una API para gestionar usuarios y mascotas",
        },
        servers: [
            {
                url: "https://dogzline-1.onrender.com/api", // Cambia esta URL al dominio correcto
            },
        ],
        components: {
            schemas: {
                Usuario: {
                    type: "object",
                    properties: {
                        id: { type: "string", description: "ID único del usuario" },
                        NombreCompleto: { type: "string", description: "Nombre completo del usuario" },
                        email: { type: "string", description: "Correo electrónico del usuario" },
                        contraseña: { type: "string", description: "Contraseña encriptada del usuario" },
                    },
                    required: ["id", "NombreCompleto", "email", "contraseña"],
                },
                Mascota: {
                    type: "object",
                    properties: {
                        _id: { type: "string", description: "ID único de la mascota" },
                        nombre: { type: "string", description: "Nombre de la mascota" },
                        edad: { type: "integer", description: "Edad de la mascota" },
                        raza: { type: "string", description: "Raza de la mascota" },
                        sexo: { type: "string", description: "Sexo de la mascota (M o F)" },
                        color: { type: "string", description: "Color de la mascota" },
                        vacunas: { type: "string", description: "Vacunas de la mascota" },
                        caracteristicas: { type: "string", description: "Características de la mascota" },
                        certificado: { type: "string", description: "Certificado de salud de la mascota" },
                        fotos: { type: "string", description: "Fotos de la mascota" },
                        comportamiento: { type: "string", description: "Comportamiento de la mascota" },
                        id_usuario: { type: "string", description: "ID del usuario propietario" },
                    },
                    required: ["_id", "nombre", "edad", "raza", "sexo", "color"],
                },
                Notificacion: {
                    type: "object",
                    properties: {
                        id_usuario: { type: "string", description: "ID del usuario que recibe la notificación" },
                        id_mascota: { type: "string", description: "ID de la mascota relacionada" },
                        mensaje_llegada: { type: "string", format: "date-time", description: "Fecha y hora de llegada de la notificación" },
                        contenido: { type: "string", description: "Contenido de la notificación" },
                        leido: { type: "boolean", description: "Indica si la notificación ha sido leída", default: false },
                        foto: { type: "string", description: "Foto en formato Base64" },
                    },
                    required: ["id_usuario", "id_mascota", "mensaje_llegada", "contenido"],
                },
                Solicitud: {
                    type: "object",
                    properties: {
                        id_usuario: { type: "string", description: "ID del usuario que realiza la solicitud" },
                    },
                    required: ["id_usuario"],
                },
                Encuentro: {
                    type: "object",
                    properties: {
                        id_usuario1: { type: "string", description: "ID del primer usuario" },
                        id_usuario2: { type: "string", description: "ID del segundo usuario" },
                        fecha: { type: "string", format: "date-time", description: "Fecha del encuentro" },
                        lugar: { type: "string", description: "Lugar del encuentro" },
                    },
                    required: ["id_usuario1", "id_usuario2", "fecha", "lugar"],
                },
                Match: {
                    type: "object",
                    properties: {
                        id_usuario1: { type: "string", description: "ID del primer usuario" },
                        id_usuario2: { type: "string", description: "ID del segundo usuario" },
                        fecha: { type: "string", format: "date-time", description: "Fecha del match" },
                    },
                    required: ["id_usuario1", "id_usuario2", "fecha"],
                },
            },
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                BearerAuth: []
            }
        ]
    },
    apis: ["./routes/*.js"],
};

module.exports = swaggerJsDoc(swaggerOptions);