let express = require('express');
const  router = express.Router();
module.exports = router;

const axios = require("axios");

const { WebClient } = require("@slack/web-api");

const Users = require("../models/users");

const credentials = require("../keys");

const passportJWT = require("../config/passport_JWT_Strategy");

const slack = require("../config/slack");

const jwt = require("jsonwebtoken");

const Tasks = require("../models/task");

const indexController = require("../controllers/indexController");

router.post("/login",indexController.login);

//returns a list of all channels and user to send messages to them
router.get("/conversation-list", passportJWT.authenticate('jwt',{session:false}), indexController.conversationList);

// send a message instantly to a channel
router.post("/send-message", passportJWT.authenticate('jwt',{session:false}), indexController.sendMessage);

// schedule a message
router.post("/schedule-message", passportJWT.authenticate('jwt',{session:false}), async (req, res) => {
    try {
        let token;
        let viaBot;
        let newTask;
        // data from request's body
        const { message, channelId, sender, time, messageType } = req.body;


        // decide which token to use on the basis of type
        if (sender === "user") {
            token = req.user.oAuthToken;
            viaBot = false;
        } else {
            token = credentials.slackBotToken;
            viaBot = true;
        }
        // set schedule time
        const messageScheduleTime = new Date(time).getTime() / 1000;

        let response;
        
        //schedule
        if (messageType != null && ( messageType==="weekly" || messageType==="monthly" || messageType==="daily" )) {
            newTask = new Tasks({
                sender:sender,
                oAuthToken: req.user.oAuthToken,
                message: message,
                channelId: channelId,
                messageFrequency: messageType,
                date: time
            });
            await newTask.save();
            return res.send(200,{message:"task scheduled"});
        }else{
            // schedule message to be sent
            response = await slack("sendScheduledMessage", token, {
                text: message,
                channel: channelId,
                post_at: messageScheduleTime,
            });
        }
        res.send({ response:response });
    } catch (e) {
        
        console.log("Schedule Message error: ", e);

        // internal server error
        res.status(500).send({ message: "Internal Server Error" ,error:e});
    }
});