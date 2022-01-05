const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const { BroadcastChannel } = require ('broadcast-channel');
const bc = new BroadcastChannel('master', { 
  type: 'node', 
  webWorkerSupport: false
});

var net = require('net');
var x = require("../../../constants.js");

x.whoami = workerData;

const server = net.createServer((socket) => {
    socket.end('goodbye\n');
}).on('error', (err) => {
    // Handle errors here.
    console.log(err);
});

async function main() {
    x.threading.init(x.whoami);
    server.listen(x.ports.admin.comms, "0.0.0.0", function () { 
    x.sendMsg("debug", x.whoami, `Comms Server Starting on Port ${x.ports.admin.comms}!`);
})
}

x.onmsg = async function (message) {
  // See original function for information
};

main();