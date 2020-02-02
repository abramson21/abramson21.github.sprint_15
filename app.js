const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const { loginValidator } = require('./middlewares/validation');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const users = require('./routes/users');
const cards = require('./routes/cards');

const app = express();

const error = require('./routes/app');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

require('dotenv').config();

const { PORT = 3000 } = process.env;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});


app.use(cookieParser());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2),
    avatar: Joi.string().required(),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }).unknown(true),
}), login);


app.use('/', auth, users);
app.use('/', auth, cards);
app.use('/', auth, error);

app.use(errorLogger);


app.use(errors());

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).send({ message: err.message });
  next();
});


app.listen(PORT, () => {});
