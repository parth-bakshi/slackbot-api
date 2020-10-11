const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/user-data-slackbot");
const db = mongoose.connection;

db.on('error',console.error.bind("error in creating db"));

db.once('open',function(err){
    if(err){
        console.log('err opening db');
        return;
    }
    console.log("db setup");
});

module.exports = db;