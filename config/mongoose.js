const mongoose = require('mongoose');
// mongoose.connect("mongodb://localhost/user-data-slackbot");

const credentials = require("../keys");

mongoose.connect(`mongodb+srv://parth:${credentials.mongoPassword}@slackbot-api.ib9cl.mongodb.net/slackbot-api?retryWrites=true&w=majority`);

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


// //test
// router.get("/",function(req,res){
//     return res.send("succesful deployed");
// })
