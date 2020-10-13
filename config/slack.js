//webclient to handle all slack request
const { WebClient } = require("@slack/web-api");

//slack webclient service calls
const slack = async (work, token, param = {}) => {
  
    //calls for slack web-api
    const web = new WebClient(token);

    //returns channels and user list for a particular token user/bot
    if (work === "channelList") {
        const list = await web.conversations.list({
            types: `public_channel,private_channel,im`,
        });
        return list;
    }

    let response;
    // send message now
    if (work === "sendInstantMessage") {
        const { text, channel } = param;
        response = await web.chat.postMessage({
            text,
            channel,
        });
        if (response.ok === true) {
            return { response: response.ok };
        } else {
            console.log("error in instant message service");
        }
    }
    // schedule a message
    if (work === "sendScheduledMessage") {
        const { text, channel, post_at } = param;
        response = await web.chat.scheduleMessage({
            text,
            channel,
            post_at,
        });
        if (response.ok === true) {
            return { data: response.ok };
        } else {
            console.log("error in schedule messaging service");
        }
    }
};

module.exports = slack;
