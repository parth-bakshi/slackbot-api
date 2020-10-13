const axios = require("axios");

const { WebClient } = require("@slack/web-api");

const Users = require("../models/users");

const credentials = require("../keys");

const passportJWT = require("../config/passport_JWT_Strategy");

const slack = require("../config/slack");

const jwt = require("jsonwebtoken");

const Tasks = require("../models/task");

module.exports.login = async function(req,res){
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
};

//returns a list of all channels and user to send messages to them
module.exports.conversationList = async (req, res) => {
    try {

        // list of all the conversation
        const list = await slack( "channelList", req.user.oAuthToken);
        // console.log("list", list);

        // selecting channelid and name from converation list
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

        res.send(200,{ data: conversationData });
    } catch (e) {
        
        console.log("Conversation List error: ", e);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

// send a message instantly to a channel
module.exports.sendMessage = async (req, res) => {
    try {
        let token;
        let response; 
        
        const { message, channelId, sender } = req.body;
        console.log(req.body);
        
        //selects user or bot token based on the sender
        console.log(sender);
        if (sender === "user") {
            token = req.user.oAuthToken;
        } else {
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
};

