const mongoose = require('mongoose');
const Deck = require('../models/deck');

exports.getOne = (req, res, next) => {
    if(typeof(req.body._id) !== 'string') {
        return res.status(400).json({
            error: 'wrong datatype'
        });
    };

    Deck.findOne({_id: req.body._id})
        .exec()
        .then(deck => {
            if (!deck) {
                return res.status(404).json({
                    error: 'deck not found'
                });
            };
            
            return res.status(200).json({
                deck: deck,
                deckId: req.body._id
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: 'Internal server issue'
            });
        });
}

exports.getDeckList = (req, res, next) => {
    Deck.find()
        .then(result => {

            var response = [];

            result.forEach(deck => {
                response.push({
                    _id: deck._id,
                    deckInfo: deck.deck_info,
                    deckSettings: deck.deck_settings
                });
            });

            return res.status(200).json({
                decks: response
            });
        })
        .catch(err => {
            return res.status(500).json({
                error: 'Internal server error'
            });
        });    
}

exports.create = (req, res, next) => {
    if (req.body.cards_bulk) {
        if(typeof(req.body.cards_bulk) !== 'string') {
            return res.status(400).json({
                error: 'wrong datatype'
            });
        };

        var bulkData = req.body.cards_bulk;
        var cards = [];

        if (req.body.cards_bulk_settings.split_card_char) {
            bulkData = bulkData.split(req.body.cards_bulk_settings.split_card_char);

            bulkData.forEach(element => {

                const newCard = {
                    cardNumber: bulkData.indexOf(element) + 1,
                    cardContent: element.split(req.body.cards_bulk_settings.split_cardFace_char),
                };

                cards.push(newCard);
            });
        }

        const id = new mongoose.Types.ObjectId();

        const deck = new Deck({
            _id: id,
            title: req.body.title, 
            card_count: cards.length,
            cards: cards,
            chartDefinition: {
                chart_columns: req.body.cards_bulk_settings.chart_columns,
                chart_columns_name: req.body.cards_bulk_settings.chart_columns_names
            }
        });

        deck.save()
        .then(result => {
            if (!result) {
                res.status(500).json({
                    error: 'Internal server error'
                });
            }

            res.status(201).json({
                message: 'Deck created',
                _id: id
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: 'Internal server error'
            });
        });
    }    
}

exports.update = (req, res, next) => {
    var updateQuery = {};
    req.body.updates.forEach(update => {
        if (typeof(update.field) !== 'string' || typeof(update.value) !== 'string' && typeof(update.value) !== 'boolean' && !Array.isArray(update.value) && typeof(update.value) !== 'number'){
            return res.status(400).json({
                error: 'wrong datatype',
                reason: [update.field, update.value]
            });
        }else{
            updateQuery[update.field] = update.value;
        };
    });

    console.log(updateQuery);

    Deck.findOneAndUpdate({ _id: req.body._id}, updateQuery)
        .exec()
        .then(result => {
            if (!result) {
                return res.status(500).json({
                    error: 'updating user failed'
                });
            }else{
                return res.status(200).json({
                    message: 'User updated'
                });
            };
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: 'Internal server error'
            });
        });
};