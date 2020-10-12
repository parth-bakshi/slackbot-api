const mongoose = require('mongoose');
const db = require('../config/mongoose');
const taskSchema = new mongoose.Schema({
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

const Tasks = mongoose.model('Tasks',userSchema);

module.exports = Tasks;