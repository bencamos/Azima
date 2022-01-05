const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const { BroadcastChannel } = require ('broadcast-channel');
const bc = new BroadcastChannel('master', { 
  type: 'node', 
  webWorkerSupport: false
});

var x = require('../../constants.js');

// [DEV] X; [WIP]
// [TODO] [D2]

/*
[TODO] [D1]: Get library to handle voice recoginition and test it. [YET]
[TODO] [D2]: Create a function to listen to mic and convert it text. [YET]
*/
x.whoami = workerData;

async function main() {
    x.threading.init(x.whoami);
}

x.onmsg = async function(message) { 
    // See original function for information
}

main();