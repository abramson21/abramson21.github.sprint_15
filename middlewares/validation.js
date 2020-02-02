const { celebrate, Joi } = require('celebrate');

module.exports.loginValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .email({ minDomainSegments: 2, tlds: { allow: false } })
      .label('Проверьте правильность введенного адреса электронной почты'),
    password: Joi.string()
      .required()
      .min(8)
      .pattern(/^[a-zA-Z0-9]{3,30}$/),
  }),
});
