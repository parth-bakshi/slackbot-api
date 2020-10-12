const mongoose = require('mongoose');
const db = require('../config/mongoose');

//taskschema for a task which is scheduled
const taskSchema = new mongoose.Schema({
    sender:{
        type:String,
        required:true,
    },
    oAuthToken:{
        type:String,
        required:true
    },
    message:{
        type:String
    },
    channelId:{
        type:String,
        required:true,
    },
    date:{
        type:Date
    },
    messageFrequency:{
        type:String,
        required:true
    }
},{
    timestamps:true
});

const Tasks = mongoose.model('Tasks',taskSchema);

module.exports = Tasks;