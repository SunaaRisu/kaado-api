const mongoose = require('mongoose');
const Deck = require('../models/deck');
const deck = require('../models/deck');

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

    if (req.body.searchQuery) {
        Deck.find({$text: {$search: req.body.searchQuery}})
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
    } else {
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
}

exports.create = (req, res, next) => {
    if(typeof(req.body.title) !== 'string' || typeof(req.body.description) !== 'string' || typeof(req.body.card_count) !== 'number' || typeof(req.body.chart_columns) !== 'number' || !Array.isArray(req.body.chart_columns_name)) {
        return res.status(400).json({
            error: 'wrong datatype'
        });
    };

    console.log(req.body.chart_columns);
    console.log('test');

    const deck = new Deck({
        _id: new mongoose.Types.ObjectId(),
        deck_info: {
            title: req.body.title,
            descrption: req.body.description,
            author: {
                id: req.userData._id,
                username: req.userData.username
            },
            card_count: req.body.card_count,
            chartDefinition: {
                chart_columns: req.body.chart_columns,
                chart_columns_name: req.body.chart_columns_name
            }
        },
        deck_settings: {
            cards_per_stack: req.body.card_count,
            card_question: 'ALL',
            card_answer: ['REMAINING'],
            randomize: true
        },
        cards: req.body.cards
    });

    deck.save()
        .then(result => {
            if (result) {
                return res.status(201).json({
                    message: 'Deck created',
                    _id: deck._id
                });
            };
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: 'Inetrnal server error'
            })
        });
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