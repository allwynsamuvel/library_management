const authService = require('../services/authServices');
const errorMsg = require('../helpers/errorMessage').errorMessages;
const utils = require('../helpers/utils');

/**
 * @description Local login controller.
 * @function login
 */
exports.login = async (req, res) => {
  try {

    const {
      email,
      password
    } = req.body;
    
    //Please replace dummy payload with your actual object for creating token.
    let message = {
      'msg': 'Login Successful.',
      'token': authService.createToken({email, password})
    };
    res.send(utils.responseMsg(null, true, message));
  } catch (error) {
    console.error('error', error.stack);
    res.status(500).send(utils.responseMsg(errorMsg.internalServerError));
  }
};
