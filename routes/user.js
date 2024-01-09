const express = require('express');
const router = express.Router();

const UserController = require('../controller/user');

router.post("/signup", UserController.create);

router.post("/login", UserController.login);

// router.get("/refresh_token", UserController.login);

// router.patch("/update_user", UserController.updateUser);

// router.delete("/delete", UserController.delete);

// router.post("/get_user", UserController.getUser);

module.exports = router;