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
    payload = jwt.verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjI4ZTJjNTg3ZTZlNGMxNDQ5MmI4NDkiLCJpYXQiOjE2NDY4NjQ2NjIsImV4cCI6MTY0NzQ2OTQ2Mn0.wVjMNLPXADa-ZRNtQZ9CA0qO0Rvha885WAkmrNK4RH8', '70e2a3a9618a0c2b53ada48c02426d0714780eeff637eaae50a7c056f0dca7da');
    next(new loginError(`
    Надо исправить. В продакшне используется тот же
    секретный ключ, что и в режиме разработки.
    `));
  } catch (err) {
    if (err.name === 'JsonWebTokenError' && err.message === 'invalid signature') {
      next(new loginError('Всё в порядке. Секретные ключи отличаются'));
    } else {
      next(new loginError(
        'Что-то не так',
        err,
      ));
    }
  }

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    // eslint-disable-next-line new-cap
    next(new loginError('Необходима авторизация'));
  }

  req.user = payload;

  next();
};
