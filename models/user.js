const mongoose = require('mongoose');

const deckList = mongoose.Schema({
    id: {type:String, required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    card_count: {type: Number, required: true},
    deck_settings: {
        cards_per_stack: {type: Number},
        card_question: {type: String},
        card_answer: {type: Array},
        randomize: {type: Boolean},
        chart_definition: {
            chart_columns: {type: Number},
            chart_columns_names: {type: Array}
        }
    }
})

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {type: String, required: true},
    nickname: {type: String, required: false},
    email: {type: String, required: true},
    profile_picture: {type: String, required: false},
    password: {type: String, required: true},
    flags: {
        version: {type: String, required: true},
        email_confirmed: {type: Boolean, required: true},
    },
    deck_list: [deckList],
    deck_author_list: {type: Array, required: false}
});

module.exports = mongoose.model('User', userSchema);