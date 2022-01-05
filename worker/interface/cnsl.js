const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const { BroadcastChannel } = require ('broadcast-channel');
const bc = new BroadcastChannel('master', { 
  type: 'node', 
  webWorkerSupport: false
});

const readline = require('readline');

var x = require('../../constants.js');

// [DEV] X; [WIP];

/*
[TODO] [D4]: Create a basic menu ui [YET]
[TODO] [D5]: Add developemental aid options (i.e toggle debug mode, show threads)[YET]
*/

x.whoami = workerData;

async function main() {
    x.threading.init(x.whoami);
    let cmd;
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    // Prompt Loop
    var prompt = function() {
      readline.question('>> ', async (cmd) => {
        await x.inputProcessing(cmd);
        prompt();
      });
    }
    prompt();
}

x.onmsg = async function (message) {
    // See original function for information
};

main();