const express = require('express');
const router = express.Router();

const DeckController = require('../controller/deck');

router.post("/get_one", DeckController.getOne);

router.get("/get_deck_list", DeckController.getDeckList);

router.post("/create", DeckController.create);

module.exports = router;