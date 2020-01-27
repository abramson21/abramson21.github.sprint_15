const error = require('express').Router();

error.all('/*', (req, res) => {
  res.statusCode = 404;
  res.statusMessage = 'Error';
  res.send({ message: 'Запрашиваемый ресурс не найден' });
});

module.exports = error;
