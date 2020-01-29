const Card = require('../models/card');

function errorSend(res) {
  res.status(500).send({ message: 'Произошла ошибка' });
}

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((card) => {
      if (card.length === 0) {
        return res.status(404).send({ message: 'База данных cards пуста! ' });
      }
      return res.send({ data: card });
    })
    .catch((error) => res.status(500).send({ message: error.message }));
};

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Не удается создать карточку' }));
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  const ownerId = req.user._id;
  Card.findById(cardId)
    .then((card) => {
      if (card.owner.toString() === ownerId) {
        Card.findByIdAndRemove(cardId)
          .then((cardI) => res.send({ data: cardI }))
          .catch(() => errorSend(res));
      } return res.status(401).send({ message: 'Вы не имеете доступ к удалению чужих карточек' });
    })
    .catch(() => res.status(404).send({ message: 'Не найден объект с таким идентификатором' }));
};
