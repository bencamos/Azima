const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const { BroadcastChannel } = require ('broadcast-channel');
const bc = new BroadcastChannel('master', { 
  type: 'node', 
  webWorkerSupport: false
});

var http = require('http');
var url = require('url');
var os = require("os");

var x = require('../../../constants.js');

//print node path
console.log(process.execPath);

var apix = require('./web/api/index.js');
var admin = require('./web/admin/index.js');

// [DEV] X; [WIP];
x.whoami = workerData;

// We will use a built in http server to host our api calls, and a php server to run the front-end.
var api = http.createServer(async function (req, res) { 
/* 
API Usage;
The api will only send a result if the request is valid.
All requests should be GET for the time being (no POST).
If you send a malformed request, the api will not respond at all as if its offline.
Check the console for debugging information.

    Arguments;
        x: Authentication key. Currently "!"

*/
    res.setHeader('Content-Type', 'application/json');
    var query = url.parse(req.url,true).query;
    var uri = req.url.split('?')[0];// Remove args from URI
    x.sendMsg("debug", x.whoami, `${JSON.stringify(query)} ${uri}`);
    if (`${query.x}` == "!") {// Checking authentication
        res.statusCode = 200;
        var uri = uri.split('/');
        uri.shift();
        var data = {uri: uri, query: query, res: res, req: req};  
        switch (uri[0]) {
            case "api": {
                res.end(await apix.run(data));
                break;
            }
            case "admin": {
                res.end(await admin.run(data));
                break;
            }
        }
    }
});
/*
[TODO] Website Interface Extended Information;

This is a temporary system used for development.
It only has to be as pretty as you want.
All information required will be provied by the api above.
Information/Controls provied by the api;
    - System Statistics & Information
    - Thread list and their status
    - URI (api calls) to be used by the web interface

How to run a testing website;
    Open a terminal and go to the web/ directory.
    Run the following command: .\php\php-cgi.exe -b 127.0.0.1:8080 index.php
    Use web/ as the root directory, and index.php as the index file.
    Any php file can be used as the index file.
    Make sure all code is within the web/ directory, and make sure to rerun that command whenever you make changes to the code.

[TODO] [D2]: Add a process/thread selector [YET]
[TODO] [D2]: Provide options to manage threads (i.e, reboot & shutdown) [YET]
[TODO] [D1]: Show Statistics [YET]
*/

async function main() {
    x.threading.init(x.whoami);
    api.listen(x.ports.admin.api, "0.0.0.0", function () { 
        x.sendMsg("debug", x.whoami, `Web Server Starting on Port ${x.ports.admin.api}!`);
    })
}

x.onmsg = async function (message) {
  // See original function for information
};

main();