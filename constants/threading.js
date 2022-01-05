const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const { BroadcastChannel } = require ('broadcast-channel');
const bc = new BroadcastChannel('master', { 
  type: 'node', 
  webWorkerSupport: false
});

var x, once = 0;
var workers = new Set();
var workersListeners = new Set();
module.exports.workers = workers;

var init = async function (whoami) {
    if (!once) x = require("../constants.js"); once = 1;// Initializing here prevents circular dependecies issues.
    x.sendMsg("debug", whoami, `Starting!`);
}

var start = async function (name) {
    //if (!await x.getConfig(name, "enabled")) return 0; // Hard coded to not run.
    workers.add( {name: name, worker: new Worker(await x.gfl(name), { workerData: name})} );
}

var terminateWho = async function (who, from) {
    var master = "master." + who.substring(who.indexOf(".") + 1); // everything after the first dot.
    await x.sendMsg(master, from, `terminate|${who}`);
    // Because of some weird issues with exiting here that I cant figure it out, the master of the thread will do it instead.
}

var performance = async function () {
  console.log("Running")
  console.log(process.cpuUsage());
  workers.forEach(async (worker) => {
    // get performance stats
    var stats = await worker.worker.getHeapSnapshot();
    console.log(stats)
  })

}

var createListeners = async function (worker) {
  // detect if the worker is dead
  workersListeners.add(worker.on('exit', (code) => {
    console.log(`${worker.name} died ${code}`);
    if (code !== 0) {
      // Unintentional exit
      workers.delete(worker);
      x.sendMsg("debug", whoami, `Worker ${worker.name} died with exit code ${code}`);
      start(worker.name)
    }

  }));
}

process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});

module.exports = {
    init: init,
    start: start,
    terminateWho: terminateWho,
    createListeners: createListeners,
    performance: performance,
    workers: workers

}