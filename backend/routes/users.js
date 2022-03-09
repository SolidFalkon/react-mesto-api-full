const express = require('express');
const { celebrate, Joi } = require('celebrate');

const routes = express.Router();

const {
  getUsers,
  getUserById,
  updateUserInfo,
  updateUserAvatar,
  getUserInfo,
} = require('../controllers/users');

routes.get('/', getUsers);

routes.get('/me', getUserInfo);

routes.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUserById);

routes.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUserInfo);

routes.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().pattern(/^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)?/).required(),
  }),
}), updateUserAvatar);

module.exports = routes;
