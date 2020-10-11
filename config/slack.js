//webclient to handle all slack request
const { WebClient } = require("@slack/web-api");

const slack = async (work, token, param = {}) => {
  
    const web = new WebClient(token);

    console.log("imhere1");
    if (work === "channelList") {
        console.log("imhere2");
        const list = await web.conversations.list({
            types: `public_channel,private_channel,im`,
        });
        console.log(list)
        return list;
    }

    // send instant message
    if (work === "sendInstantMessage") {
        console.log("imhere2");
        const { text, channel } = param;
        const response = await web.chat.postMessage({
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
        const response = await web.chat.scheduleMessage({
            text,
            channel,
            post_at,
    });
    if (response.ok === true) {
        return { response: response.ok };
    } else {
        console.log("error in schedule messaging service");t
    }
    }
};

module.exports = slack;
