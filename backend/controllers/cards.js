const CARD = require('../models/card');

const notFindError = require('../errors/not-find-error');
const incorrectDataError = require('../errors/incorrect-data-error');
const anotherOwnerError = require('../errors/another-owner-error');

module.exports.getCards = (req, res, next) => {
  CARD.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

module.exports.deleteCardById = (req, res, next) => {
  CARD.findById(req.params.cardId).orFail()
    .populate(['owner', 'likes'])
    .then((card) => {
      if (card.owner._id.toString() === req.user._id) {
        CARD.findByIdAndRemove(req.params.cardId).orFail()
          .populate(['owner', 'likes'])
          // eslint-disable-next-line no-shadow
          .then((card) => res.send(card))
          .catch(next);
      } else {
        // eslint-disable-next-line new-cap
        throw new anotherOwnerError('У вас нет прав на это действие');
      }
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        // eslint-disable-next-line new-cap
        next(new incorrectDataError('карточка не найдена'));
      } else if (err.name === 'CastError') {
        // eslint-disable-next-line new-cap
        next(new notFindError('передается невалидный id'));
      } else {
        next(err);
      }
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  // eslint-disable-next-line no-underscore-dangle
  const owner = req.user._id;

  CARD.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // eslint-disable-next-line new-cap
        next(new notFindError('переданы некорректные данные в метод создания карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  // eslint-disable-next-line no-underscore-dangle
  CARD.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        // eslint-disable-next-line new-cap
        next(new incorrectDataError('карточка не найдена'));
      } else if (err.name === 'CastError') {
        // eslint-disable-next-line new-cap
        next(new notFindError('передается невалидный id'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  // eslint-disable-next-line no-underscore-dangle
  CARD.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        // eslint-disable-next-line new-cap
        next(new incorrectDataError('карточка не найдена'));
      } else if (err.name === 'CastError') {
        // eslint-disable-next-line new-cap
        next(new notFindError('передается невалидный id'));
      } else {
        next(err);
      }
    });
};
