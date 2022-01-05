const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const { BroadcastChannel } = require ('broadcast-channel');
const bc = new BroadcastChannel('master', { 
  type: 'node', 
  webWorkerSupport: false
});

var x = require('./constants.js');

// [DEV] X; [WIP];

x.whoami = workerData;
var debug = 1;

async function main() {
    x.threading.init(x.whoami);
}

x.onmsg = async function(message) { 
    // See original function for information
    //if (message.includes("terminate")) x.threading.terminate(whoami);
    var data = JSON.parse(message);
    
    if (!debug) return;
    if (`${data.id}` == "-1") return;
    if (`${data.id}` == "-0") return;
    if (!await x.getConfig("debug", ["data", data.msg])) console.log(`\nDEBUG MESSAGE;\n${JSON.stringify(data, null, 2)}`);
};

main();