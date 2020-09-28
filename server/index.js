const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const Users = require('./routes/users');
const UserModel = require('./models/User');
const Chat = require('./routes/chat');
var Pusher = require('pusher');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = require('./config/keys').mongoURL;
mongoose.connect(db, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => console.log('db connected'))
.catch((err) => console.log(err));

var pusher = new Pusher({
    appId: '1074474',
    key: '6d254b816f97f709f504',
    secret: 'aede7a34c9b72e3f200a',
    cluster: 'us2',
    encrypted: true
});
  
const pusherDb = mongoose.connection;

pusherDb.once('open', () => {
    const msgCollection = pusherDb.collection('conversations');
    const changeStream = msgCollection.watch();

    changeStream.on('change', (change) => {
        if(change.operationType === 'update') {
            let msgDetailsKey;
            for(var i in change.updateDescription.updatedFields) {
                if(i.includes('messages')) {
                    msgDetailsKey = i;
                }
            }
            let msgDetails = change.updateDescription.updatedFields[msgDetailsKey];
            if(msgDetails.length === 1) {
                pusher.trigger('messages', 'inserted', {
                    sentFrom: msgDetails[0].sentFrom,
                    message: msgDetails[0].message,
                    date: msgDetails[0].date
                })
            } else {
                pusher.trigger('messages', 'inserted',{
                    sentFrom: msgDetails.sentFrom,
                    message: msgDetails.message,
                    date: msgDetails.date
                })
            }
        } else if(change.operationType === 'delete') {
            pusher.trigger('deleteConvo', 'deleted', {
                _id: change.documentKey._id
            })
        } 
        else if(change.operationType === 'insert') {
            pusher.trigger('conversation', 'inserted', change.fullDocument)
        }
         
        else {
            console.log("pusher error");
        }
    })
})

require("./config/passport")(passport)
app.use(passport.initialize());

app.use('/users', Users);
app.use('/chat', Chat);

const port = process.env.PORT || 9000;

app.listen(port, () => console.log('Listening on port ', port));