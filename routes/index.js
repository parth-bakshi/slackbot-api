let express = require('express');
const  router = express.Router();
module.exports = router;

const axios = require("axios");
// router.get('/',homeController.home);

const { WebClient } = require("@slack/web-api");

const Users = require("../models/users");

const credentials = require("../keys");

const passportJWT = require("../config/passport_JWT_Strategy");

const slack = require("../config/slack");

const jwt = require("jsonwebtoken");

router.post("/login",async function(req,res){
    try{
        
        
        // const accessToken = response.data.authed_user.access_token;
        const accessToken = req.body.token;
        const web = new WebClient(accessToken);
        
        const userData = await web.users.identity();
        const { name, email, id } = userData.user;
        
        // const existingUser = await User.findOne({ slackId: id, email });

        const update = {
            name: name,
            email: email,
            slackId: id,
            oAuthToken: accessToken
        };
        const options = {upsert: true, new:true};
        const user = await Users.findOneAndUpdate({slackId:id},update,options,function(err){
            if(err){console.log("err in update/create user"+err);}
        });
        console.log(user);
        return res.json(200,{
            message: "sign in successful",
            data:{
                token: jwt.sign(JSON.stringify(user), credentials.secretEncryptionKey)
            }
        });
    }catch(e){
        console.log(e);
        return res.status(500).send({
            message: "internal server error",
            error: e
        });
    }
});


router.get("/conversation-list", passportJWT.authenticate('jwt',{session:false}), async (req, res) => {
    try {
        // list of all the conversation
        const list = await slack( "channelList", req.user.oAuthToken);
        console.log("list", list);
        // selecting required data from converation list
        let conversationData = await list.channels.map((channel) => {
            // if (channel.name) {
            //     return {
            //         conversationId: channel.id,
            //         conversationName: channel.name,
            //     };
            // } else if (channel.user) {
            //     return {
            //         conversationId: channel.id,
            //         userId: channel.user,
            //     };
            // }
            if (channel.name) {
                return {
                    value: channel.id,
                    label: channel.name,
                };
            } else if (channel.user) {
                return {
                    value: channel.id,
                    label: channel.user,
                };
            }
            return;
        });
        // // list of conversations with user's names (Direct Messages)
        // const conversationData = await slack(
        //     req.user.oauthToken,
        //     "userDetail",
        //     {
        //     list: conversationDataAll,
        //     }
        // );

        res.send(200,{ data: conversationData });
    } catch (e) {
        
        console.log("Conversation List error: ", e);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// send a message instantly to a channel
router.post("/send-message", passportJWT.authenticate('jwt',{session:false}), async (req, res) => {
    try {
        let token;
        let response; 
        
        const { message, channelId, sender } = req.body;
        console.log(req.body);
        
        //selects user or bot token based on the sender
        console.log(sender);
        if (sender === "user") {
            console.log("vhjnkrnvencejvnejkvner");
            token = req.user.oAuthToken;
        } else {
            console.log("nice slowwwwwww");
            token = credentials.slackBotToken;
        }

        
        
        response = await slack("sendInstantMessage", token, {
        text: message,
        channel: channelId,
        });
        
        res.send({ response });
    } catch (e) {
        
        console.log("Send Instant Message error: ", e);
        res.status(500).send({ message: "Internal Server Error" });
    }
  });

// // schedule a message
// router.post("/api/schedule-message", passportJWT.authenticate('jwt',{session:false}), async (req, res) => {
//     try {
//         let token;
//         let viaBot;
//         let newMessage;
//         // data from request's body
//         const { message, channelId, type, time, messageType } = req.body;
//         // decide which token to use on the basis of type
//         if (type === "user") {
//             token = req.user.oAuthToken;
//             viaBot = false;
//         } else {
//             token = credentials.slackBotToken;
//             viaBot = true;
//         }
//         // set schedule time
//         const messageScheduleTime = new Date(time).getTime() / 1000;

//         // schedule message to be sent
//         let response = await slackInstance(token, "sendScheduleMessage", {
//             text: message,
//             channel: channelId,
//             post_at: messageScheduleTime,
//         });
//         // single date schedule instance
//         if (messageType === "particularDate") {
//             if (response.response === true) {
//             newMessage = new ParticularDateMessage({
//                 text: message,
//                 channelId,
//                 date: time,
//             });
//             }
//         }
//         // monthly schedule instance
//         else if (messageType === "monthlyMessages") {
//             const nextDate = moment(time).add(1, "month").format();
//             if (response.response === true) {
//             newMessage = new MonthlyMessages({
//                 text: message,
//                 channelId,
//                 date: time,
//                 nextDate,
//             });
//             }
//         }
//         // weekly schedule instance
//         else if (messageType === "weeklyMessages") {
//             const nextDate = moment(time).add(1, "week").format();
//             if (response.response === true) {
//             newMessage = new WeeklyMessages({
//                 text: message,
//                 channelId,
//                 date: time,
//                 nextDate,
//             });
//             }
//         }
//         // Daily schedule instance
//         else if (messageType === "dailyMessages") {
//             const nextDate = moment(time).add(1, "day").format();
//             if (response.response === true) {
//             newMessage = new DailyMessages({
//                 text: message,
//                 channelId,
//                 date: time,
//                 nextDate,
//             });
//             }
//         }
//         // minute wise schedule instance
//         else if (messageType === "minuteMessages") {
//             const nextDate = moment(time).add(5, "minute").format();
//             if (response.response === true) {
//             newMessage = new MinuteMessages({
//                 text: message,
//                 channelId,
//                 date: time,
//                 nextDate,
//             });
//             }
//         }
//         // save instance
//         await newMessage.save();
//         // save message detail
//         const messageMain = new Message({
//             message: newMessage._id,
//             type: messageType,
//             user: req.user._id,
//             viaBot,
//         });
//         await messageMain.save();
//         // response
//         res.send({ response });
//     } catch (e) {
//         // error
//         console.log("Schedule Message error: ", e);

//         // other server error
//         res.status(500).send({ message: "Internal Server Error" });
//     }
// });