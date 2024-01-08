const express = require('express');
const router = express.Router();

const UserController = require('../controller/user');

router.post("/login", UserController.login);

router.post("/sinup", UserController.create);

router.get("/refresh_token", UserController.login);

router.patch("/update_user", UserController.updateUser);

router.delete("/delete", UserController.delete);

router.post("/get_user", UserController.getUser);

module.exports = router;