/*
This file will store all the constant variables used in the application, for simplified access.
*/
function _getCallerFile() {
    var err = new Error();
    Error.prepareStackTrace = (_, stack) => stack;
    Error.prepareStackTrace = undefined;
    return err.stack.toString();
}

var fs = require("fs");
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const { BroadcastChannel } = require ('broadcast-channel');
const bc = new BroadcastChannel('master', { 
  type: 'node', 
  webWorkerSupport: false
});
request = require("request");


var config = JSON.parse(fs.readFileSync("./config.json"));

var comms = require('./constants/comms.js');
var ports = require('./constants/ports.js');
var input = require('./constants/input.js');
var threading = require('./constants/threading.js');
var encryption = require('./constants/encryption.js');
var usedids = false;
var whoami = "";
var self = this;

// Waiting stores all the requests awaiting a response
var waiting = [["0", "0"]];

process.on("unhandledRejection", (error, p) => {
    var mx = module.exports;
    console.log("=== UNHANDLED REJECTION ===");
    console.log(`From: ${mx.whoami}`);
    console.dir(error.stack);
});

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

var getConfig = async function (who, data) {
    var arr;

    try {
        // Just reversing the name and putting it in an array
        arr = who.split(".").reverse();
    } catch (e) {
        // Just in case the name is not in the correct format.
        // i.e "debug"
        arr = [who];
    } finally {
        var conf = config;

        // Getting to relevant location in config
        await arr.forEach(async (element, index) => { conf = conf[element]; });
        if (Array.isArray(data)) await data.forEach(async (element, index) => { conf = conf[element]; });
        if (Array.isArray(data)) return conf;
        if (data) return conf[data];
        return conf;
    }
}

var onmsg = async function (message) {
  /* 
  I really fucking hate duplicated code.
  This solves that.
  
  Since constants.js (this) is ran by every single thread, we can just put the main broadcast channel here.
  Without it here you would have to have an identical function in every thread.
  So instead its stored here and calls to a secondary function that a thread can update with its own code when needed.
  Anything here will be erased DO NOT USE THIS.
  */
};

// Not in use. Here for reference
module.exports.msgDecode = async function (msg, rqst) {
  if (!once) x = require("../constants.js"); once = 1; // Initializing here prevents circular dependecies issues.
  // This function will take the message and decode it.
  // It will then send it to the appropriate function.

  var data = JSON.parse(msg);

  if (`${rqst}`.includes(`${data.to}`) || rqst === "bypass" || `${data.to}` === "*") {
    if (`${rqst}`.includes("debug") || `${rqst}`.includes("*")) return data; // This is for debugging, gives all information.
    if (`${data.id}` === "0") return await x.updateMessageIds(data.msg.split(","), data.from, data.id);
    return data.msg;
  }
};

bc.onmessage = async (message) => {
    var mx = module.exports;
    whoami = mx.whoami;
    if (!whoami) return;
    var data = ""
    try {
        data = JSON.parse(message);
    } catch (e) {
        console.log(whoami, "Couldnt Parse JSON", message, e);
    }
    if (data.id == "-1" && data.from == "master") usedids = data.msg.split(",");

    var z = 0;
    switch (whoami) {
        case "bypass": {
            z = 2;
            break;
        }
        case "master": {
            z = 2;
            break;
        }
        case "*": {
            z = 2;
            break;
        }
        case data.to: {
            z = 1;
            break;
        }
        default: {
            z = 0;
            break;
        }
    }
    if (!z) return;

    if (data.id == "0") return await updateMessageIds(data.msg.split(","), data.from, data.id);
    if (data.reqOrRes == "response") waiting.push([`${data.id}`, `${data.msg}`]);
    var msgArr = data.msg.split("|");
    // Each case will have to decide what everything after the 0 index is.
    switch (msgArr[0]) {
        case "stop": {
            if (whoami == "debug") break; // Debug bypasses all and cant stop itself.
            await threading.terminateWho(msgArr[1], whoami);
            break;
        }
        case "start": {
            if (whoami == "debug") break; // Debug bypasses all and cant stop itself.
            await threading.start(msgArr[1], whoami);
            break;
        }
        case "restart": {
            if (whoami == "debug") break; // Debug bypasses all and cant stop itself.
            await threading.terminateWho(msgArr[1], whoami);
            await threading.start(msgArr[1]);
            break;
        }
        case "terminate": {
            // See x.threading.terminate for why this exists.
            if (whoami == "debug") break; // Debug bypasses all and cant stop itself.
            threading.workers.forEach(async (element, index) => {
                if (element.name == msgArr[1]) {
                    await sendMsg(`debug|master`, element.name, "Terminating!");
                    element.worker.terminate();
                    threading.workers.delete(element);
                }
            })
        }
    }

    mx.onmsg(message);
}

var sendMsg = async function (to, from, msg, reqOrRes, xid) {
    var id;

    // If respond is set we are replying to a message and dont need to generate new ids.
    // Instead it will just continue to use the same id.

    if (reqOrRes == "request") {
        usedids = null;
        if (!usedids) {
            // This takes roughly one second to return.
            await bc.postMessage(JSON.stringify({ to: "master", from: from, msg: "getUsedIds", id: "-1" })); // Get the used ids list.
        }
        while (!usedids) {
            // Waiting for the main thread to send the used ids list.
            // Takes roughly one second to return.
            await new Promise(r => setTimeout(r, 1));
        }
        do {
            id = Math.floor(Math.random() * (999999999 - 1111111111 + 1) + 111111111)
        } while (usedids.includes(id)) // Keep generating new ids until we get a new one.
        await bc.postMessage(JSON.stringify({ to: "master", from: from, msg: "addUsedIds", id: `${id}` })); // Add the new id to the used ids list.
        var counter = {
            to: "*",
            from: "broadcast channel",
            reqOrRes: null,
            id: "0",
            msg: usedids.toString()
        }
        await bc.postMessage(JSON.stringify(counter));
    } else if (reqOrRes == "response") {
        id = xid;
    } else {
        id = null;
    }

    // Basically just lets you set multiple receivers.
    if (to.includes("|")) {
        var multiple = to.split("|")
        multiple.forEach(async (element) => {
            var json = {
                to: element,
                from: from,
                reqOrRes: reqOrRes,
                id: id,
                msg: msg
            }
            await bc.postMessage(JSON.stringify(json));
        });
    } else {
        var json = {
            to: to,
            from: from,
            reqOrRes: reqOrRes,
            id: id,
            msg: msg
        }
        await bc.postMessage(JSON.stringify(json));
    }
    return id;
}

var waitfor = async function (id, timeout) {
  var i;
  // Force return once time expires
  // Currently not working.
  if (timeout) {
      setTimeout(function () {
        return false;
      }, timeout); 
  }
  // We create a while loop that will check if the array contains the message with that id.
  // Only returning once it does.
  var z = 1;
  var loopcount = 0;
  var msg;
  // Making sure we wait until the id is resovled. It for whatever reason it isnt when this function is called.
  if (id instanceof Promise) {
      id.then(function (value) {
        id = value;
      });
  }
  while (z) {
      // Waiting for the result.
      loopcount++;
      //console.log(loopcount, waiting, id);
      waiting.forEach(async (element, index) => {
        if (waiting[index][0] == id.toString()) {
            i = waiting[index];
            msg = waiting[index][1];
            return z=0;
        }
      });
      if (z) {
        await new Promise((r) => setTimeout(r, 1));
      }
  }

  waiting.splice(i, 1);
  return msg;
};

var updateMessageIds = async function (newids, who, id) {
    // This has yet to be implemented.

    // Instead of creating new variables and using way more memory to check when requests are answered
    // we can just add the message id to the the list of used ids every time its used.
    // This way we know a request is completely and the id can be removed once it has 3 instances.
    // #1 = Generated for intital request, #2 = sent to process, #3 = returned to original

    // Update the used ids list with the new ids.
    usedids = newids;
    return 0;
    //console.log(usedids);
}

var gfl = async function (data) {
    // Get requested file location

    var uri = __dirname + "\\" + data.split(".").reverse().join("\\") + ".js"; // Flip and replace to correct path layout.
    if (fs.existsSync(uri)) {
        return uri;
    } else {
        return 0;
    }
}

var getRqst = async function (host, uri) {
  var theUrl;
  var out;
  var auth = "?x=!";
  // 0 = localhost
  if (host == 0) {
      theUrl = "http://localhost:8081" + uri + auth;
  }
  await request(theUrl, async function (error, response, body) {
      out = body;
  })
  while (!out) {
      await new Promise(r => setTimeout(r, 1));
  }
  return out
};

// Having exports at the bottom is a war crime because god forbid you update these later.
module.exports = {
    comms: comms,
    ports: ports,
    encryption: encryption,
    threading: threading,
    whoami: whoami,
    input: input,
    config: config,
    sleep: sleep,
    getConfig: getConfig,
    onmsg: onmsg,
    sendMsg: sendMsg,
    waitfor: waitfor,
    updateMessageIds: updateMessageIds,
    getRqst: getRqst,
    gfl: gfl
};