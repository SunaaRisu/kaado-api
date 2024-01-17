const mongoose = require('mongoose');

// const deck = mongoose.Schema({
//     title: {type: String},
//     card_count: {type: Number},
//     cards: {type: Array},
//     chartDefinition: {
//         chart_columns: {type: Number},
//         chart_columns_name: {type: Array}
//     }
// })

const deck = mongoose.Schema({
    deck_info: {
        title: {type: String},
        author: {type: String},
        card_count: {type: Number},
        chartDefinition: {
            chart_columns: {type: Number},
            chart_columns_name: {type: Array}
        }
    },
    deck_settings: {
        cards_per_stack: {type: Number},
        card_layout: {type: String},
        card_layout_filling: {type: String},
        randomize: {type: Boolean}
    },
    cards: {type: Array},
})

module.exports = mongoose.model('Deck', deck);