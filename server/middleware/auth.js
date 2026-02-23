import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  try {
    const authHeader =
      req.headers.authorization || req.headers.Authorization;

    // ❌ No Authorization header
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Must be: Bearer <token>
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ message: 'Malformed token' });
    }

    const token = parts[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded payload to request
    // expected payload: { id, role, iat, exp }
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (err) {
    // token expired / invalid
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
