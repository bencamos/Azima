// We create all the workers in one go.
// Making them global variables.

var x = require('../../constants.js');

const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const { BroadcastChannel } = require ('broadcast-channel');
const bc = new BroadcastChannel('master', { 
  type: 'node', 
  webWorkerSupport: false
});
const readline = require('readline');


let std, text, voice, cnsl;
x.whoami = workerData;

//readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) process.stdin.setRawMode(true);

cnsl = "cnsl.interface.worker";
text = "text.interface.worker";
voice = "voice.interface.worker";

async function main() { 
    // [DEV] X; [ALPHA]
    // [TODO]: Create application controller handler and Optimize.
    x.threading.init(x.whoami);
    x.threading.start(cnsl);
    x.threading.start(text);
    x.threading.start(voice);

}

x.onmsg = async function (message) {
    // See original function for information
};

main();
