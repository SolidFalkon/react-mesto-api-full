const jwt = require('jsonwebtoken');
require('dotenv').config();

const loginError = require('../errors/login-error');

const { NODE_ENV, JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    // eslint-disable-next-line new-cap
    next(new loginError('Необходима авторизация'));
  }

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    // eslint-disable-next-line new-cap
    next(new loginError('Необходима авторизация'));
  }

  req.user = payload;

  next();
};
