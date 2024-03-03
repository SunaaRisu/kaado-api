const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/user');
const Deck = require('../models/deck');


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
        profile_picture: '',
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
                        username: user.username,
                        email: user.email,
                        version: user.flags.version,
                        profilePicture: user.profile_picture
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
                        username: user.username,
                        email: user.email,
                        version: user.flags.version,
                        profilePicture: user.profile_picture
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
                        username: user.username,
                        email: user.email,
                        version: user.flags.version,
                        profilePicture: user.profile_picture
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
};

exports.signOut = (req, res, next) => {
    res.cookie(
        "jid",
        null,
        {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            expires: new Date(Date.now() - 1) // delete
        }
    );

    return res.status(200).json({
        message: 'jid delete'
    });
};

exports.refresh_token = (req, res, next) => {

    var jid_token = '';

    if (req.cookies.jid === undefined){
        return res.status(401).json({
            error: 'no refresh token'
        });
    }
    
    try {
        jid_token = jwt.verify(req.cookies.jid, process.env.JID_KEY);
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            error: 'refresh token invalid'
        });
    };

    User.findOne({ _id: jid_token._id})
        .exec()
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    error: 'refresh token invalid'
                });
            };

            const jwt_token = jwt.sign({
                _id: user._id,
                username: user.username,
                email: user.email,
                version: user.flags.version,
                profilePicture: user.profile_picture
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
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: 'Auth failed due to server issue'
            });
        });
};

exports.send2FAmail = (req, res, next) => {
if (typeof(req.body.purpose) !== 'string') {
        return res.status(400).json({
            error: 'wrong datatype'
        });
    };

    const twofaToken = jwt.sign(
        {
        _id: req.userData._id
        },
        process.env.TWOFA_KEY,
        {
            expiresIn: "5m"
        }
    );

var subject = '';
    var text = '';

    switch (req.body.purpose) {
        case 'confirm_email':
            subject = 'Confirm your Email address';
            text = 'Go to https://kaado.sunaarisu.de/confirm_email?c=' + twofaToken;
            break;
    
        default:
            return res.status(500).json({
                error: "Internal server issue"
            });
            break;
    }

    const transporter = nodemailer.createTransport({
        port: 465,
        host: "mail.your-server.de",
           auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PWD,
             },
        secure: true,
    });
    
    const mailData = {
        from: 'no-reply@sunaarisu.de',
        to: req.userData.email,
        subject: subject,
        text: text,
        // html: {
        //     path: path.resolve(__dirname, "../templates/requestData.html"),
        // }
        };
    
        transporter.sendMail(mailData, function (err, info) {
            if(err){
                console.log(err);
                return res.status(500).json({
                    error: "Email can't be send"
                });
            }else{
                return res.status(200).json({
                    message: 'Email send'
                });
            }                            
        });
};

exports.confirmEmail = (req, res, next) => {
    var twofaTokenContent = '';

    try {
        twofaTokenContent = jwt.verify(req.body.twofaToken, process.env.TWOFA_KEY)._id;
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: '2FA Token verification failed'
        });
    };

    if (req.userData._id === twofaTokenContent) {
        User.findOneAndUpdate({ _id: req.userData._id }, { "$set": {"flags.emailConfirmed": true}})
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
};

exports.updateUser = (req, res, next) => {
    var updateQuery = {};
    req.body.updates.forEach(update => {
        if (typeof(update.field) !== 'string' || typeof(update.value) !== 'string' && typeof(update.value) !== 'boolean'){
            return res.status(400).json({
                error: 'wrong datatype'
            });
        }else{
            updateQuery[update.field] = update.value;
        };
    });

    User.findOneAndUpdate({ _id: req.userData._id}, updateQuery)
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

exports.getDeckList = (req, res, next) => {
    User.findOne({ _id: req.userData._id })
        .exec()
        .then(user => {
            if (!user) {
                return res.status(500).json({
                    error: 'Internal server error'
                });
            } else {
                return res.status(200).json({
                    deck_list: user.deck_list
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                errer: 'Internal server error'
            });
        })
}

exports.updateDeckList = (req, res, next) => {
    // Payload
    // uid
    // deckid
    // add


    if (req.body.add) {
        Deck.findOne({ _id: req.body.deckid })
            .exec()
            .then(deck => {
                const newDeck = {
                    id: deck._id,
                    title: deck.deck_info.title,
                    description: deck.deck_info.discription,
                    card_count: deck.deck_info.card_count,
                    deck_settings: {
                        cards_per_stack: deck.deck_settings.cards_per_stack,
                        card_question: deck.deck_settings.card_question,
                        card_answer: deck.deck_settings.card_answer,
                        randomize: deck.deck_settings.randomize,
                        chart_definition: {
                            chart_columns: deck.deck_info.chartDefinition.chart_columns,
                            chart_columns_names: deck.deck_info.chartDefinition.chart_columns_names
                        }
                    }
                };
                User.findOneAndUpdate({ _id: req.userData._id }, { $push: { deck_list: newDeck}})
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
                            errer: 'Internal server error'
                        });
                    });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    errer: 'Internal server error'
                });
            });
    } else if(!req.body.add) {
        User.findOneAndUpdate({ _id: req.userData._id }, {
            $pull: {
                deck_list: {id: req.body.deckid},
            }
        })
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
                    errer: 'Internal server error'
                });
            });
    }
}