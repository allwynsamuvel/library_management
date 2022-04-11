const jwt = require('jsonwebtoken');
const {
  secret,
  expireIn,
  algorithm
} = require('../config/config').jwt;


/**
 * @name createToken
 * @param {Object} data - Object containing data which needs to be stored in token
 * @description Returns signed JWT token which can be given to client
 */
exports.createToken = (data) => {
  try {
    if (data === Object(data)) {
      return jwt.sign(data, secret, {
        algorithm: algorithm,
        expiresIn: expireIn,
      });
    } else {
      return new Error('Given data is not object.');
    }
  } catch (error) {
    return error;
  }
};
