import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../constants.js';

const JWTWhitelist = new Set();

const authWithWhitelist = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token || !JWTWhitelist.has(token)) {
    return res.status(401).send('Error');
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).send('Error');
  }};

const addTokenToWhitelist = (token) => JWTWhitelist.add(token);
const removeTokenFromWhitelist = (token) => JWTWhitelist.delete(token);

export { authWithWhitelist, addTokenToWhitelist, removeTokenFromWhitelist };
