const router = require('express').Router();
const { authClient } = require('./routesDependencies').default;

router.post('/login', authClient.login);
router.post('/signup', authClient.signup);

module.exports = router;
