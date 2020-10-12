const cron = require("node-cron");
const moment = require("moment");
const Messages = require("../../models/Messages");
const MinuteMessages = require("../../models/Minute");
const keys = require("../../config/keys");
const slackInstance = require("../slackService");

module.exports = cron.schedule("* * * * *", async () => {
  const messages = await Messages.find({ type: "minuteMessages" }).populate(
    "message user"
  );

  const currentDate = moment();
  for (let i = 0; i < messages.length; i++) {
    let token;
    let nextDate = moment(messages[i].message.nextDate);
    console.log(
      currentDate.format() === nextDate.subtract(1, "minute").format()
    );
    console.log(
      currentDate.format(),
      "---------",
      nextDate.subtract(1, "minute").format()
    );
    if (currentDate.format() === nextDate.subtract(3, "minute").format()) {
      if (messages[i].isBot === true) {
        token = keys.slackBotToken;
      } else {
        token = messages[i].user.oauthToken;
      }
      console.log(token);
      let text = messages[i].message.text;
      let channel = messages[i].message.channelId;
      let post_at = moment(messages[i].message.nextDate).valueOf() / 1000;
      let response = await slackInstance(token, "sendScheduleMessage", {
        text,
        channel,
        post_at,
      });
      console.log(response);
      if (response.response === true) {
        const minuteMessages = await MinuteMessages.findById(
          messages[i].message._id
        );
        minuteMessages.date = messages[i].message.nextDate;
        minuteMessages.nextDate = moment(messages[i].message.nextDate)
          .add(5, "minute")
          .format();
        await minuteMessages.save();
      }
    }
  }
});
