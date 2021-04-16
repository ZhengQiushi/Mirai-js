// https://github.com/Drincann/Mirai-js
// https://drincann.github.io/Mirai-js/#/QuickStart

const { Bot, Middleware, Message } = require('mirai-js');
var async = require('async');


// the group you need to inform!
var groupId = "514439335"; // "859107272";
// the email info you need to put!
var unfinishedList = getUnfinishedList("data.txt");

// the member list of this group
var totalList = readNameList(groupId);


(async () => {
    try {
        // initailize. notice: it's 'http' rather than 'https'
        const baseUrl = 'http://0.0.0.0:8080';
        const authKey = '19990916';

        const bot = new Bot();

        await Bot.sendCommand({
            baseUrl,
            authKey,
            command: '/login',
            args: [qq, password],
        });

        await bot.open({
            baseUrl,
            qq,
            authKey,
        });

        //! record a name list! 
        // const memberList = await bot.getMemberList(
        //     {group: groupId}
        //     );
        // console.log(memberList);
        // recordNameLists(groupId, memberList);

        //! send reminder to the unfinished members!
        unfinishedList.forEach(element => {
            var informed = undefined;
            // check the unfinished name is in the group list or not!
            totalList.forEach(person => {
                if(person.name === element.name){
                    informed = person;
                }
            });
            // in the list!
            if(informed !== undefined){
                //inform in a fancy way. first name with 3 characters or full name with 2 characters
                var outputStr; 
                if(informed.name.length == 2){
                    outputStr = informed.name + "同志，记得青年大学习~🙇";
                }
                else{
                    var firstName = informed.name.substr(1, 2);
                    outputStr = firstName + "同志，记得青年大学习~🙇";
                }
                // send !
                bot.sendMessage({
                    friend: informed.id.toString(),
                    
                    message: new Message().addText(outputStr),
                });
                // feedback in a fancy way
                console.log('\x1B[32m%s\x1B[0m', "[INFO] Send to " + informed.name + " successfully! ");
            }
            else{
                console.log('\x1B[31m%s\x1B[0m',"[WARN] Can't contact with " + element.name);
            }
        });

        bot.on('BotOfflineEventForce',
            new Middleware()
                .autoReLogin({ bot, baseUrl, authKey, password })
                .done()
        );
    } catch (err) {
        console.log(err);
    }
})();



function personInfo(id, name, status){
    this.id = id; // can be stu-id or the QQ-id
    this.name = name;
    this.status = status;
}

/*
    brief@ read the name list of target group you need to inform
    param@ groupId(string or number)
    return@ a array with struct `personInfo`
 */
function readNameList(groupId){
    var personLists = [];
    var fs = require("fs");
    // read from the certain name list
    var text = fs.readFileSync(groupId.toString() + ".txt").toString();
    var textByLine = text.split("\n")
    textByLine.forEach(element => {
        var perInfo = element.split("\t");
        var id = perInfo[0];
        var name = perInfo[1];
        var status = "no";
        // personInfo i.e. 413366511 郑秋实 no
        personLists.push(new personInfo(id, name, status));
    });
    return personLists;
}

/*
    brief@ read the unfinished name list
    param@ filename(string): the data copied from the email
    return@ a array with struct `personInfo`
 */
function getUnfinishedList(filename){
    var personLists = [];
    var fs = require("fs");
    var text = fs.readFileSync(filename).toString();
    var textByLine = text.split("\n")
    textByLine.forEach(element => {
        //console.log(element);
        var perInfo = element.split("\t");
        var name = perInfo[0];
        var id = perInfo[1];
        var status = perInfo[2];
        //personInfo i.e. 1851447 郑秋实 未完成
        personLists.push(new personInfo(id, name, status));
    });
    return personLists;
}

/*
    brief@ get the information of everyone in the target group! And write it to a txt file
    param@ groupId(string or number)
           memberList()
    return@ 
 */
function recordNameLists(groupId, memberList){
    const fs = require('fs')
    // the destination
    var file_name = groupId.toString() + ".txt";
    var file = fs.createWriteStream(file_name);

    try {
        file.on('error', function(err) { /* error handling */ });
        // write the memberList into $(groupId).txt line by line
        memberList.forEach(element =>{
            file.write(element.id.toString() +'\t' + element.name + '\n');
        })

        file.end();
        console.log("[Info] MemberList write successfully.");
    } catch (err) {
    console.error(err)
    }
}

