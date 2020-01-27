const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Error401 = require('../middlewares/errors/error_401');
const Error500 = require('../middlewares/errors/error_500');

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((user) => {
      if (user.length === 0) {
        return res.status(404).send({ message: 'База данных user пуста! ' });
      }
      return res.send({ data: user });
    })
    .catch(() => next(new Error500('На сервере произошла ошибка')));
};

module.exports.createUser = (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).send({ message: 'Тело запроса пустое' });
  }
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (password.length > 11) {
    bcrypt.hash(password, 10)
      .then((hash) => User.create({
        name, about, avatar, email, password: hash,
      }))
      .then((user) => res.send({ data: user }))
      .catch(() => next(new Error500('На сервере произошла ошибка')));
  } else {
    res.status(500).send({ message: 'Слишком короткий пароль!' });
  }
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((userId) => {
      if (!userId) {
        res.status(404).send({ message: 'Такого пользователя нет' });
      } else {
        res.send({ userId });
      }
    })
    .catch(() => res.status(500).send({ message: 'Нет пользователя с таким id' }));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const JWT_SECRET = 'b24076852c7c534c77ce7b233022026ffc663393b557432496f2a70fa3756b33';
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000,
          httpOnly: true,
          sameSite: true,
        })
        .send(token)
        .end();
    })
    .catch(() => next(new Error401('Ввели неправильно логин или пароль')));
};
