let express = require('express');
const  router = express.Router();
module.exports = router;

const axios = require("axios");

const { WebClient } = require("@slack/web-api");


const passportJWT = require("../config/passport_JWT_Strategy");

const indexController = require("../controllers/indexController");

//logs in a user and returns a jwt
router.post("/login",indexController.login);

//returns a list of all channels and user to send messages to them
router.get("/conversation-list", passportJWT.authenticate('jwt',{session:false}), indexController.conversationList);

// send a message instantly to a channel
router.post("/send-message", passportJWT.authenticate('jwt',{session:false}), indexController.sendMessage);

// schedule a message to a particular time or auto schedule for daily, weekly, monthly
router.post("/schedule-message", passportJWT.authenticate('jwt',{session:false}), indexController.scheduleMessage);