const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const { BroadcastChannel } = require ('broadcast-channel');
const bc = new BroadcastChannel('master', { 
  type: 'node', 
  webWorkerSupport: false
});

var x = require('../../../constants.js');

// [DEV] X; [WIP];
let web, comms;

x.whoami = workerData;
// Worker Identifiers

web = "web.admin.application.worker"
comms = "comms.admin.application.worker"

async function main() {
    x.threading.init(x.whoami);
    x.threading.start(web);
    x.threading.start(comms);
}

x.onmsg = async function(message) { 
    // See original function for information
}
main();