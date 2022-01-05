var x = require("../../../../../constants.js");

const exec = require("child_process").exec;
var pidusage = require("pidusage");

var os = require("os");

async function winProc(data) {
  var temp = data.split("\r\n");
  var data = [];
  temp.shift();
  temp.shift();
  temp.shift();
  await temp.forEach( async (element) => {
    var x = element.replace(/,(?=[^,]*$)/, "").replace(/\"/g, "").replace(" K", "000").split(",");
    x.splice(2, 1);
    x.splice(2, 1);
    data.push(x);
  });
  return data;
}

async function getPs(sort) {
  console.time("Full")
  var full = { azima: {}, system: {} };

  var platform = process.platform;
  var cmd = "";
  var proc;

  console.time("PS")
  if (platform == "win32") {
    cmd = `tasklist /FO csv`;
    proc = winProc;
  } else {
    cmd = `ps -ax | grep ${query}`;
  }
  var xx = "";
  exec(cmd, async (err, stdout, stderr) => {
    xx = await proc(stdout);
  });
  while (!xx) {
    await new Promise((r) => setTimeout(r, 1));
  }
  console.timeEnd("PS")
  console.time("Removing Invalid")
  var pids = [];
  // Grabbing the amount of valid pids
  await (async function loop() {
    for (var i = 0; i < xx.length; i++) {
      if (!isNaN(xx[i][1])) pids.push(xx[i][1]);
    }
  })();
  console.timeEnd("Removing Invalid")
  console.time("Grabbing Usage")
  // Grabbing the usage of each pid
  var stats = await pidusage(pids);
  stats = JSON.parse(JSON.stringify(stats));
  console.timeEnd("Grabbing Usage")
  console.time("Adding Process Names")
  var i = 0;
  // .lengths counts from 1, not 0 so we -1
  while (i < pids.length - 1) {
    // adding the process name to the stats
    if (stats[pids[i]]) stats[pids[i]].name = xx[i][0];
    i++;
  }
  console.timeEnd("Adding Process Names")
  // just in case
  while (!i == stats.length) {
    await new Promise((r) => setTimeout(r, 1));
  }
  full.system = stats;

  console.time("Sorting")
  switch (sort) {
    case "cpu": {
      var keys = Object.keys(stats);
      keys.sort(function (a, b) {
        return stats[b].cpu - stats[a].cpu;
      });
      // sort ob using keys
      var newOb = [];
      for (var i = 0; i < keys.length; i++) {
        newOb[i] = stats[keys[i]];
      }
      full.system = newOb;
      break;
    }
    case "mem": {
      var keys = Object.keys(stats);
      keys.sort(function (a, b) {
        return stats[b].memory - stats[a].memory;
      });
      // sort ob using keys
      var newOb = [];
      for (var i = 0; i < keys.length; i++) {
        newOb[i] = stats[keys[i]];
      }
      full.system = newOb
      break;
    }
  }
  console.timeEnd("Sorting")
  console.timeEnd("Full")
  return JSON.stringify(full);
}

var run = async function (data) {
  switch (data.uri[1]) {
    case "test": {
      return "Hello! ;)";
      break;
    }
    case "processes": {
      return JSON.stringify(
          await x.waitfor(
            await x.sendMsg("master", x.whoami, "getProcesses", "request"),
            3000
          )
      );
      break;
    }
    case "usedIds": {
      return JSON.stringify(
          await x.waitfor(
            await x.sendMsg("master", x.whoami, "getIds", "request"),
            3000
          )
      );
      break;
    }
    case "stop": {
      x.sendMsg("master", x.whoami, `stop|${data.query.target}`);
      return `Stopping ${data.query.target}`;
      break;
    }
    case "start": {
      x.sendMsg("master", x.whoami, `start|${data.query.target}`);
      return `Starting ${data.query.target}`;
      break;
    }
    case "restart": {
      x.sendMsg("master", x.whoami, `restart|${data.query.target}`);
      return `Restarting ${data.query.target}`;
      break;
    }
    case "cpu": {
      return `${process.cpuUsage().system}`.substring(0, 4) + "%";
      break;
    }
    case "mem": {
      return (((os.totalmem() - os.freemem()) / os.totalmem()) * 100).toString().substring(0, 4);
      break;
    }
    case "cpuCores": {
      return `${os.cpus().length}`;
      break;
    }
    case "memAval": {
      return `${os.totalmem()}`;
      break;
    }
    case "ps": {
      var zxz = await getPs(data.query.sort);
      return zxz
    }
  }
};

module.exports = {
  run: run,
};
