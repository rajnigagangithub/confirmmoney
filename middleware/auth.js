const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_super_secret_key';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ success: false, message: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: 'Invalid token' });

    req.user = user; // Add decoded user data to request
    next();
  });
}

module.exports = authenticateToken;
