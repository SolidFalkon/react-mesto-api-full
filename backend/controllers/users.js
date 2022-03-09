const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const USER = require('../models/user');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

const notFindError = require('../errors/not-find-error');
const incorrectDataError = require('../errors/incorrect-data-error');
const loginError = require('../errors/login-error');
const repeatEmailError = require('../errors/repeat-email-error');

module.exports.getUsers = (req, res, next) => {
  USER.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  // eslint-disable-next-line no-underscore-dangle
  USER.findById(req.params.userId).orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        // eslint-disable-next-line new-cap
        next(new incorrectDataError('пользователь не найден'));
      } else if (err.name === 'CastError') {
        // eslint-disable-next-line new-cap
        next(new notFindError('передается невалидный id'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => USER.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    }))
    .then((user) => {
      const {
        name, about, avatar, email,
      } = user;
      res.status(200).send({
        data: {
          name, about, avatar, email,
        },
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        // eslint-disable-next-line new-cap
        next(new repeatEmailError('Пользователь с таким емайлом уже зарегестрирован'));
      }
      if (err.name === 'ValidationError') {
        // eslint-disable-next-line new-cap
        next(new notFindError('переданы некорректные данные в метод создания пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports.getUserInfo = (req, res, next) => {
  const owner = req.user._id;
  USER.findById(owner).orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        // eslint-disable-next-line new-cap
        next(new incorrectDataError('пользователь не найден'));
      } else if (err.name === 'CastError') {
        // eslint-disable-next-line new-cap
        next(new notFindError('передается невалидный id'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  // eslint-disable-next-line no-underscore-dangle
  const owner = req.user._id;

  USER.findByIdAndUpdate(owner, { name, about }, { new: true, runValidators: true }).orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        // eslint-disable-next-line new-cap
        next(new incorrectDataError('пользователь не найден'));
      } else if (err.name === 'ValidationError') {
        // eslint-disable-next-line new-cap
        next(new notFindError('переданы некорректные данные в метод обновления профиля'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  // eslint-disable-next-line no-underscore-dangle
  const owner = req.user._id;

  USER.findByIdAndUpdate(owner, { avatar }, { new: true, runValidators: true }).orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        // eslint-disable-next-line new-cap
        next(new incorrectDataError('пользователь не найден'));
      } else if (err.name === 'ValidationError') {
        // eslint-disable-next-line new-cap
        next(new notFindError('переданы некорректные данные в метод обновления аватара профиля'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return USER.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, { maxAge: 36000000, httpOnly: true, sameSite: false })
        .send(user);
    })
    // eslint-disable-next-line new-cap
    .catch(() => {
      res.clearCookie('jwt');
      // eslint-disable-next-line new-cap
      next(new loginError('передан неверный логин или пароль.'));
    });
};
