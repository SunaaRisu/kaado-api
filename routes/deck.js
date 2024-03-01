const express = require('express');
const router = express.Router();

const DeckController = require('../controller/deck');
const authAndGetData = require('../middleware/authAndGetData');

router.post("/get_one", DeckController.getOne);

router.get("/get_deck_list", DeckController.getDeckList);

router.post("/create", authAndGetData, DeckController.create);

router.post("/update", authAndGetData, DeckController.update);

module.exports = router;