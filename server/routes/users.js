const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const keys = require('../config/keys');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const passport = require('../config/passport');
const Users = require('../models/User');
const validator = require('../validators/validators');
const checkAuth = require('../middleware/check-auth');

router.post('/get-all-users', checkAuth, (req, res) => {
    Users.find({email: {$ne: req.body.email}}).then(resp => {
        res.json(resp);
    })
})

router.post('/login', (req, res) => {
    const { errors, isValid } = validator.loginValidator(req.body);
    if (!isValid) {
        res.status(404).json(errors);
    } else {
        Users.findOne({email: req.body.email})
            .then((user) => {
                if(!user) {
                    res.status(404).json({"message": "Email does not exist", "success": "false"})
                } else {
                    bcrypt.compare(req.body.password, user.password)
                    .then((isMatch) => {
                        if(!isMatch) {
                            res.status(400).json({'message': 'Password does not match', 'success': 'false'});
                        } else {
                            const payload = {
                                id: user._id,
                                name: user.firstName
                            }
                            jwt.sign(
                                payload,
                                keys.secretOrKey,
                                {
                                    expiresIn: 2155926
                                },
                                (err, token) => {
                                    res.json({
                                        user: user,
                                        token: 'Bearer token: ' + token,
                                        success: true
                                    })
                                }
                            )
                        }
                    })
                }
            })
    }
})

router.post('/register', (req, res) => {
    const { errors, isValid } = validator.registerValidator(req.body);
    if (!isValid) {
        res.status(404).json(errors);
    } else {
        Users.findOne({ email: req.body.email })
            .then((user) => {
                if (user) {
                    res.status(404).json({ "message": "Email is already in use!", "success": "false" });
                } else {
                    const registerUser = new Users({
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        password: req.body.password
                    });
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(registerUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            registerUser.password = hash;
                            registerUser.save().then((user) => {
                                res.json({"message": "User created successfully!", "success": "true"});
                            })
                                .catch((err) => console.log(err));
                        })
                    })
                }
            })
    }
})

module.exports = router;