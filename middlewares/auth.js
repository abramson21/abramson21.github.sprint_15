const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const express = require('express');

const app = express();
app.use(cookieParser());

function errorStatus(res) {
  return res
    .status(401)
    .send({ message: 'Доступ запрещен. Необходима авторизация' });
}

module.exports = (req, res, next) => {
  const cookie = req.cookies.jwt;
  const JWT_SECRET = '771c575d2cc502abbd5314d1cd32d2549d48a21e64d9e0371c8422bb842262de';
  if (!cookie) {
    errorStatus(res);
  }

  let payload;

  try {
    payload = jwt.verify(cookie, JWT_SECRET);
    req.user = payload;
  } catch (err) {
    errorStatus(res);
  }

  next();
};
