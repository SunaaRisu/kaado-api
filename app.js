const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const mongoose = require('mongoose');
const cors = require('cors');

// Routes

const stackRoutes = require('./routes/stack');
const cardRoutes = require('./routes/card');

// mongoose connect 

mongoose.connect(    
    process.env.DB_URL
);
mongoose.Promise = global.Promise;


// body-parser

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cookieParser());


// CORS

app.use(
    cors({ 
        origin: ['http://localhost:5173', 'https://kards.sunaarisu.de'], 
        methods: ['GET', 'POST'], 
        credentials: true
    })
);

// Use Routes

app.use('/stack', stackRoutes);
app.use('/card', cardRoutes);

app.get('/', (req, res) => res.json('Kards API is running!'));


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