const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const express = require('express');

const app = express();
app.use(cookieParser());

/*function errorStatus(res) {

}*/

module.exports = (req, res, next) => {
  const cookie = req.cookies.jwt;
  const JWT_SECRET = '440b074611f1d4dc3d6b1e25abdb1a960ef22f3e42ca3a943b5a8e1f1ad141e4';
  if (!cookie) {
    return res
    .status(401)
    .send({ message: 'Доступ запрещен. Необходима авторизация' });
  }
  else{
    let payload;

    try {
      payload = jwt.verify(cookie, JWT_SECRET);
      req.user = payload;
    } catch (err) {
      return res
    .status(401)
    .send({ message: 'Доступ запрещен. Необходима авторизация' });
    }
  }
  next();
};
