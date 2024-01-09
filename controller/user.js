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

    if(req.body.username.includes('@')) {
        return res.status(400).json({
            error: 'username includes forbidden chars'
        });
    }

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
                    const jwt_token = jwt.sign({
                        _id: user._id,
                        username: user.username
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: "15m"
                    });

                    const jid_token = jwt.sign({
                        _id: user._id
                    },
                    process.env.JID_KEY,
                    {
                        expiresIn: "15d"
                    });

                    res.cookie(
                        "jid",
                        jid_token,
                        {
                            httpOnly: true,
                            secure: true,
                            sameSite: 'none',
                            expires: new Date(Date.now() + 1296000000) //15 Days
                        }
                    );

                    return res.status(201).json({
                        message: 'User created',
                        token: jwt_token
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

exports.login = (req, res, next) => {
    if(typeof(req.body.identifier) !== 'string' || typeof(req.body.password) !== 'string') {
        return res.status(400).json({
            error: 'wrong datatype'
        });
    };

    if(req.body.identifier.includes('@')) {

        User.findOne({ email: req.body.identifier })
        .exec()
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    error: 'user not found'
                });
            };

            bcryptjs.compare(req.body.password, user.password, (err, result) => {
                if (err) {
                    return res.status(500).json({
                        error: 'internal server error'
                    });
                }

                if (!result) {
                    return res.status(406).json({
                        error: 'input error'
                    });
                } else {
                    const jwt_token = jwt.sign({
                        _id: user._id,
                        username: user.username
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: "15m"
                    });

                    const jid_token = jwt.sign({
                        _id: user._id
                    },
                    process.env.JID_KEY,
                    {
                        expiresIn: "15d"
                    });

                    res.cookie(
                        "jid",
                        jid_token,
                        {
                            httpOnly: true,
                            secure: true,
                            sameSite: 'none',
                            expires: new Date(Date.now() + 1296000000) //15 Days
                        }
                    );

                    return res.status(200).json({
                        token: jwt_token
                    });
                }
            });

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: 'Auth failed due to server issue'
            });
        });
    } else {
        User.findOne({ username: req.body.identifier })
        .exec()
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    error: 'user not found'
                });
            };

            bcryptjs.compare(req.body.password, user.password, (err, result) => {
                if (err) {
                    return res.status(500).json({
                        error: 'internal server error'
                    });
                }

                if (!result) {
                    return res.status(406).json({
                        error: 'input error'
                    });
                } else {
                    const jwt_token = jwt.sign({
                        _id: user._id,
                        username: user.username
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: "15m"
                    });

                    const jid_token = jwt.sign({
                        _id: user._id
                    },
                    process.env.JID_KEY,
                    {
                        expiresIn: "15d"
                    });

                    res.cookie(
                        "jid",
                        jid_token,
                        {
                            httpOnly: true,
                            secure: true,
                            sameSite: 'none',
                            expires: new Date(Date.now() + 1296000000) //15 Days
                        }
                    );

                    return res.status(200).json({
                        token: jwt_token
                    });
                }
            });

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: 'Auth failed due to server issue'
            });
        });
    }
}