const router = require('express').Router();
const { appClient } = require('./routesDependencies').default;
const { tokenVerify } = require("../helpers/utils");

// customer routes
router.get('/users', tokenVerify("customer"), appClient.userProfile);
router.put('/users', tokenVerify("customer"), appClient.userUpdate);
router.delete('/users', tokenVerify("customer"), appClient.userDelete);

// admin routes 
router.get("/admin/users/:id", tokenVerify("admin"), appClient.userProfile);
router.put("/admin/users/:id", tokenVerify("admin"), appClient.userUpdate);
router.delete("/admin/users/:id", tokenVerify("admin"), appClient.userDelete);


module.exports = router;
