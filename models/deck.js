const mongoose = require('mongoose');

const deck = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    deck_info: {
        title: {type: String},
        discription: {type: String},
        author: {type: String},
        card_count: {type: Number},
        chart_definition: {
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
})

module.exports = mongoose.model('Deck', deck);