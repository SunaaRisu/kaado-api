const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const mongoose = require('mongoose');
const cors = require('cors');

// Routes

const deckRoutes = require('./routes/deck');
const cardRoutes = require('./routes/card');
const userRoutes = require('./routes/user');

// mongoose connect 

mongoose.connect(process.env.DB_URI);
mongoose.Promise = global.Promise;


// body-parser

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cookieParser());


// CORS

app.use(
    cors({ 
        origin: ['http://localhost:5173', 'https://kaado.sunaarisu.de'], 
        methods: ['GET', 'POST'], 
        credentials: true
    })
);

// Use Routes

app.use('/deck', deckRoutes);
app.use('/card', cardRoutes);
app.use('/user', userRoutes);

app.get('/', (req, res) => res.json('Kaado API is running!'));


// Error

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

module.exports = app;