const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const { BroadcastChannel } = require ('broadcast-channel');
const bc = new BroadcastChannel('master', { 
  type: 'node', 
  webWorkerSupport: false
});

var x = require('../../constants.js');

// [DEV] X; [WIP];
let admin;

x.whoami = workerData;
// Worker Identifiers

admin = "master.admin.application.worker"

async function main() {
    x.threading.init(x.whoami);
    x.threading.start(admin);
}

x.onmsg = async function (message) {
    // See original function for information
};

main();