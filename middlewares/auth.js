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
  const JWT_SECRET = '7b003420c28f49a771bf5ac9a39215ad954a82668605aa6aa106630e483e07ad';
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
