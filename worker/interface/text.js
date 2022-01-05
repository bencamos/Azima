const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const { BroadcastChannel } = require ('broadcast-channel');
const bc = new BroadcastChannel('master', { 
  type: 'node', 
  webWorkerSupport: false
});

var x = require('../../constants.js');

// [DEV] X; [WIP];

/*
[TODO] [D5]: Find a way to listen to all keypressed even when not focused. [YET]
[TODO] [D2]: Properly filter keypresses and convert shortcut keys (i.e control + k) to strings. [YET]
[TODO] [D2]: Link strings to commands (i.e control,k = disable voice) (Use a switch here)[YET]
*/

x.whoami = workerData;

async function main() {
    x.threading.init(x.whoami);
}
x.onmsg = async function (message) {
    // See original function for information
};

main();