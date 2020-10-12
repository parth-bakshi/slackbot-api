const cron = require("node-cron");
const moment = require("moment");
const Tasks = require("../models/task");

const slack = require("./slack");

module.exports = cron.schedule("* * * * * *", async () => {
    const currentDate = moment();
    const tasks = await Tasks.find({});
    for(let i = 0 ; i < tasks.length; i++){
        let date = tasks[i].date;
        let dateValue = moment(date).valueOf();
        let currentDateValue = currentDate.valueOf();
        if(tasks[i].messageFrequency=="daily"){
            if(dateValue-currentDateValue<0){
                tasks[i].date = moment(dateValue).add(1,"d").format();
                console.log("x");
                await tasks[i].save();
                continue;
            }
            if(dateValue-currentDateValue<864000){
                try{
                    response = await slack("sendScheduledMessage", tasks[i].oAuthToken, {
                        text: tasks[i].message,
                        channel: tasks[i].channelId,
                        post_at: moment(tasks[i].date).format(),
                    });
                }catch(e){
                    console.log(e);
                }
                tasks[i].date = moment(dateValue).add(1,"d").format();
                await tasks[i].save();
            }
        }else if(tasks[i].messageFrequency=="weekly"){
            if(dateValue-currentDateValue<0){
                tasks[i].date = moment(dateValue).add(1,"w").format();
                await tasks[i].save();
                continue;
            }
            if(dateValue-currentDateValue<604800000){
                
                try{
                    response = await slack("sendScheduledMessage", tasks[i].oAuthToken, {
                        text: tasks[i].message,
                        channel: tasks[i].channelId,
                        post_at: moment(dateValue).format(),
                    });
                }catch(e){
                    console.log(e);
                }
                tasks[i].date = moment(dateValue).add(1,"w").format();
                await tasks[i].save();
            }
        }else if(tasks[i].messageFrequency=="monthly"){
            if(dateValue-currentDateValue<0){
                tasks[i].date = moment(dateValue).add(1,"M").format();
                await tasks[i].save();
                continue;
            }
            if(dateValue-currentDateValue<2678400000){
                
                try{
                    response = await slack("sendScheduledMessage", tasks[i].oAuthToken, {
                        text: tasks[i].message,
                        channel: tasks[i].channelId,
                        post_at: moment(dateValue).format(),
                    });
                }catch(e){
                    console.log("");
                }
                tasks[i].date = moment(dateValue).add(1,"M").format();
                await tasks[i].save();
            }
        }
        // console.log(moment("2020-11-15 08:07:40.687").valueOf()-moment("2020-10-15 08:07:40.687").valueOf()+" h")
        
    }
});
