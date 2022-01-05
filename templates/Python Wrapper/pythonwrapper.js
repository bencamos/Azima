var {PythonShell} = require('python-shell');

const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const { BroadcastChannel } = require ('broadcast-channel');
const bc = new BroadcastChannel('master', { 
  type: 'node', 
  webWorkerSupport: false
});

var x = require('../../constants.js');
// [DEV X] [ALPHA]

// Worker Identifiers
let whoami, py;
whoami = workerData;

async function terminate() {
    py.end(function (err, code, signal) {
        if (err) throw err;
    });
    x.threading.terminate(whoami);
}

async function main(location, indentifier, args) {
    x.threading.init(whoami);
    py = new PythonShell(location, {args: args});
    py.on('message', function (message) {
        // You can build the json urself xD >:)
        // Using JSON as a string is easier and prevents some of issues with object references.
        x.sendMsg(JSON.stringify(message));
    });
}

x.onmsg = async function (message) {
  // See original function for information
  py.send(message);
};

main('.\testing.py', 'testing', ['testing']);