const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


exports.create = (req, res, next) => {
    if(typeof(req.body.username) !== 'string' || typeof(req.body.email) !== 'string' || typeof(req.body.password) !== 'string' || typeof(req.body.version) !== 'string') {
        return res.status(400).json({
            error: 'wrong datatype'
        });
    };

    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        flags: {
            version: req.body.version,
            emailConfirmed: false,
        }
    });

    User.findOne({username: req.body.username})
        .exec()
        .then(result => {
            if (result) {
                return res.status(400).json({
                    error: 'Username is not unique'
                });
            };

            user.save()
                .then(result => {
                    res.status(201).json({
                        message: 'User created'
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: 'Internal server error'
                    })
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: 'Internal server error'
            });
        });
};