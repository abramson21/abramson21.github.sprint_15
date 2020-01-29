const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

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
app.post('/signup', createUser);
app.post('/signin', login);

app.use('/', auth, users);
app.use('/', auth, cards);
app.use('/', auth, error);

app.listen(PORT, () => {});
