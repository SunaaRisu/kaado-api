const express = require('express');
const router = express.Router();

const UserController = require('../controller/user');
const authAndGetData = require('../middleware/authAndGetData');

router.post("/signup", UserController.create);

router.post("/login", UserController.login);

router.get("/signout", UserController.signOut);

router.get("/refresh_token", UserController.refresh_token);

router.post("/send_2FA_mail", authAndGetData, UserController.send2FAmail);

router.post("/confirm_email", authAndGetData, UserController.confirmEmail);

router.patch("/update_user", authAndGetData, UserController.updateUser);

// router.delete("/delete", UserController.delete);

// router.post("/get_user", UserController.getUser);

// router.post("/request_data", authAndGetData, UserController.requestData);

router.get("/get_deck_list", authAndGetData, UserController.getDeckList);

router.patch("/update_deck_list", authAndGetData, UserController.updateDeckList);

module.exports = router;