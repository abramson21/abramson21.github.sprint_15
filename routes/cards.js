const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getAllCards, createCard, deleteCard } = require('../controllers/cards');

router.get('/cards', getAllCards);
router.post('/cards', createCard);
router.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), deleteCard);


module.exports = router;
