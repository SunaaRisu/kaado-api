const express = require('express');
const router = express.Router();

const DeckController = require('../controller/deck');
const authAndGetData = require('../middleware/authAndGetData');

router.post("/get_one", authAndGetData, DeckController.getOne);

router.get("/get_deck_list", authAndGetData, DeckController.getDeckList);

router.post("/get_deck_settings", authAndGetData, DeckController.getDeckSettings);

router.post("/create", authAndGetData, DeckController.create);

module.exports = router;