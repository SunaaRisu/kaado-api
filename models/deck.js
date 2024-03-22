const mongoose = require('mongoose');

const deck = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    deck_info: {
        title: {type: String},
        description: {type: String},
        author: {
            id: {type: String},
            username: {type: String}
        },
        card_count: {type: Number},
        chartDefinition: {
            chart_columns: {type: Number},
            chart_columns_name: {type: Array}
        }
    },
    deck_settings: {
        cards_per_stack: {type: Number},
        card_question: {type: String},
        card_answer: {type: Array},
        randomize: {type: Boolean}
    },
    cards: {type: Array},
});

deck.index({'deck_info.title': 'text', 'deck_info.description': 'text', 'deck_info.author.username': 'text'});

module.exports = mongoose.model('Deck', deck);