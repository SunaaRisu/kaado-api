const mongoose = require('mongoose');

const deck = mongoose.Schema({
    title: {type: String},
    card_count: {type: Number},
    cards: {type: Array},
    chartDefinition: {
        chart_columns: {type: Number},
        chart_columns_name: {type: Array}
    }
})

module.exports = mongoose.model('Deck', deck);