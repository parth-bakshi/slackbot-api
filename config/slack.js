//webclient to handle all slack request
const { WebClient } = require("@slack/web-api");

const slack = async (work, token, param = {}) => {
  
    const web = new WebClient(token);

    if (work === "channelList") {
        const list = await web.conversations.list({
            types: `public_channel,private_channel,im`,
        });
        console.log(list)
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
