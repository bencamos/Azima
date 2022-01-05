var x = require("../../../../../constants.js");
var fs = require("fs").promises;
var run = async function (data) {
  console.log(data.uri);
  switch (data.uri[1]) {
    case "test": {
      return "Hello! ;)";
      break;
    }
    case "taskmgr": {
      var output = "";
      data.res.setHeader("Content-Type", "text/html");
      output = output + `CPU: ${await x.getRqst(0, "/api/cpu")} | MEM: ${await x.getRqst(0, "/api/mem")}`;
      // do stuffs
      var html = await fs.readFile("./worker/application/admin/web/admin/taskmgr/index.html");
      return html;
    }
  }
};

module.exports = {
  run: run,
};