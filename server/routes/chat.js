const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');
const Conversations = require('../models/Conversation');

router.post('/new-chat', checkAuth, (req, res) => {
    if(req.body._ids.length < 2){
        res.status(404).json({"message": "Something went wrong, try again"});
    }
    const db = mongoose.connection;
    db.collection('conversations').find({ userIds: {$all: req.body._ids} }, (err, cursor) => {
        let query = cursor.toArray().then(resp => {
            
            if(resp.length >= 1) {
                res.status(404).json({"message": "Conversation already exists!", "data": "false"})
            } else {
                let newConversation = new Conversations({
                    userIds: req.body._ids,
                    names: req.body.names,
                    messages: [],
                })
            
                newConversation.save().then((convo) => {
                    res.json({"message": "Chat created!", "data": convo})
                }).catch((err) => console.log(err));
            }
        }).catch(err => console.log(err));
    })
});

router.post('/get-chats', checkAuth, (req, res) => {
    if(!req.body._id) {
        return res.status(404).json({"message": "Something went wrong, try again"});
    }
    const db = mongoose.connection;
    db.collection('conversations').find({userIds: {$in: [req.body._id]}}, (err, cursor) => {
        let query = cursor.toArray().then(resp => {
            if(resp.length == 0) {
                res.status(200);
            } else {
                res.json(resp)
            }
        }).catch(err => console.log(err));
    })
})

router.post('/delete-chat', (req, res) => {
    if(!req.body._id) {
        return res.status(404).json({"message": "Something went wrong, try again"});
    }
    try {
        Conversations.deleteOne({_id: { $eq: req.body._id }}).then(resp => res.status(200).json({"message": resp}));
    } catch(err) {
        res.status(404).json({"message": "Something went wrong, try again"});
    }
})

router.post('/get-chat', (req, res) => {
    if(!req.body._id) {
        return res.status(404).json({"message": "Something went wrong, try again"});
    }
    Conversations.findById(req.body._id).then(resp => {
        if(resp == null) {
            res.status(404).json({"message": "Conversation no longer exists, try refreshing"})
        }
        res.json({"message": "success", "data": resp})
    })
})

router.post('/add-message', (req, res) => {
    if(!req.body.sentFrom_id || !req.body.message) {
        res.status(404).json({"message": "Something went wrong, try again"})
    }
    Conversations.findOne({_id: req.body._id}).then(foundObj => {
        let date = new Date();
            foundObj.messages.push({
                sentFrom: req.body.sentFrom_id,
                message: req.body.message,
                date: date
            });
        foundObj.save();
        res.json({"message": "Message sent"})
    }).catch(err => console.log(err));
})

module.exports = router;