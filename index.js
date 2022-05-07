var x = require("./constants.js");

const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require("worker_threads");
const { BroadcastChannel } = require("broadcast-channel");
const bc = new BroadcastChannel("master", {
  type: "node",
  webWorkerSupport: false,
});
let whoami, application, interfacex;
var runningProcesses = [];
var usedids = ["0"];

// Worker Indentifiers

x.whoami = "master";
debugx = "debug";

application = "master.application.worker";
interfacex = "master.interface.worker";

x.onmsg = async function (message) {
  // See original function for information

  var data = JSON.parse(message);

  switch (data.msg) {
    case "Starting!": {
      runningProcesses.push(data.from);
      break;
    }
    case "Terminating!": {
      console.log(`Removing ${data.from} from running processes`);
      runningProcesses.splice(runningProcesses.indexOf(data.from), 1);
      console.log(`Running processes: ${runningProcesses}`);
      break;
    }
    case "getProcesses": {
      x.sendMsg(
        data.from,
        x.whoami,
        runningProcesses.toString(),
        "response",
        data.id
      );
      break;
    }
    case "getIds": {
      x.sendMsg(data.from, x.whoami, usedids.toString(), "response", data.id);
      break;
    }
    case "getUsedIds": {
      bc.postMessage(
        JSON.stringify({
          to: data.from,
          from: "master",
          msg: usedids.toString(),
          id: "-1",
        })
      );
      break;
    }
    case "addUsedIds": {
      usedids.push(data.id);
      break;
    }
  }
  if (`${data.id}`.includes("-") || data.id == "0") {
    // am too stupid to know how to use an or with if false
  } else {
    usedids.push(data.id);
    var i = 0;
    var loc = [];
    usedids.forEach(function (id) {
      if (id == data.id) {
        i++;
        loc.push(id);
      }
      if (i == 2) {
        usedids.splice(usedids.indexOf(loc[0]), 1);
        usedids.splice(usedids.indexOf(loc[1]), 1);
        //usedids.splice(usedids.indexOf(loc[2]), 1);
      }
    });
  }
};

async function main() {
  x.threading.init(x.whoami);
  x.threading.start(debugx);
  x.threading.start(application);
  x.threading.start(interfacex);
}
main();
