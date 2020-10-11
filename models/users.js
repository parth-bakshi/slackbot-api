const mongoose = require('mongoose');
const db = require('../config/mongoose');
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    oAuthToken:{
        type:String,
        required:true,
    },
    slackId:{
        type:String,
        required:true,
    },
},{
    timestamps:true
});

const Users = mongoose.model('Users',userSchema);

module.exports = Users;