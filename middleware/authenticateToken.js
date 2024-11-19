const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Acceso denegado, no se proporcionó un token' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Guarda los datos del usuario en la request
        next(); // Pasa al siguiente middleware o ruta
    } catch (err) {
        return res.status(403).json({ message: 'Token no válido' });
    }
};

module.exports = { authenticateToken };
