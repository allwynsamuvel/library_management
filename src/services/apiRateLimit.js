const utils = require('../helpers/utils');

/**
 * @function rateLimit
 * @description This function validate the api rate limit.
 * We can use this as application level as well as route level.
 * For further information: 
 * For IP only: 'connection.remoteAddress'
 * Time format: milisecond * minute * second
 */
exports.rateLimit = (limiter, limitCount, limitMinute) => {
  if (limitCount) {

    let hitCount = parseInt(limitCount);
    let expireDate = 1000 * parseInt(limitMinute) * 60;
    return limiter({
      lookup: ['connection.remoteAddress'],
      total: hitCount,
      expire: expireDate,
      onRateLimited: function (req, res, next) {
        res.status(429).send(utils.responseMsg({
          'code': 'Bad Request',
          'message': `Rate limit exceeded. Try after ${expireDate/60000} minute.`,
        }));
      }
    });
  }
  return limiter({
    lookup: ['connection.remoteAddress'],
    total: 10,
    expire: 1000 * 1 * 60,
    onRateLimited: function (req, res, next) {
      res.status(429).send(utils.responseMsg({
        'code': 'Bad Request',
        'message': `Rate limit exceeded. Try after ${1} minute.`
      }));
    }
  });
};
