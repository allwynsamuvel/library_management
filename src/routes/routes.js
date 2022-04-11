const router = require('express').Router();
const appRoutes = require('./appRoutes');
const authRoutes = require('./authRoutes');
const dependencies = require('./routesDependencies').default;

router.get('/health', dependencies.serverHealth.checkHealth);

router.use('/app', appRoutes);
router.use('/auth', authRoutes);

module.exports = router;
