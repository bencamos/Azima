var x, once = 0;

module.exports.inputProcessing = async function (cmd) {
  // All the input functions will grab the data and translate it into something we can use here.
  if (!once) x = require("../constants.js"); once = 1; // Initializing here prevents circular dependecies issues.
  if ((cmd == "exit" || cmd == "quit") && debug) {
    x.sendMsg("debug", whoami, `Terminating!`);
    process.exit();
  }
};