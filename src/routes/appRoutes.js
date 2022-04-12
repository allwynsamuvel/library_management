const router = require('express').Router();
const { appClient } = require('./routesDependencies').default;
const { tokenVerify } = require("../helpers/utils");

router.get("/users", tokenVerify("customer"), appClient.userProfile);
router.put("/users", tokenVerify("customer"), appClient.userUpdate);
router.delete("/users", tokenVerify("customer"), appClient.userDelete);

router.get("/books/:option/:searchQuery", tokenVerify("customer"), appClient.bookSearch);

// admin routes 
router.get("/admin/users/:id", tokenVerify("admin"), appClient.userProfile);
router.put("/admin/users/:id", tokenVerify("admin"), appClient.userUpdate);
router.delete("/admin/users/:id", tokenVerify("admin"), appClient.userDelete);

router.post("/admin/books", tokenVerify("admin"), appClient.addBook);
router.put("/admin/books/:id", tokenVerify("admin"), appClient.updateBook);
router.delete("/admin/books/:id", tokenVerify("admin"), appClient.deleteBook);


module.exports = router;
