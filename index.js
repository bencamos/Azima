/*
This file is the root of all the code/programs.

Each thread here creates its own nested threads.
Applying code this way allow for specific reboots/reloads of certain parts of functions.
Without this, the code would be executed in a single thread, and the program would not be able to be restarted.
*/
/*
Developer Thoughts and Footnote

The term "AI" & "Machine Learning" more critically the first, have been incredibly watered down by the media.
Inorder to make this program more comprehensible as it will most likely use alot of terms, you can use the following as a guide to what it means;
Machine Learning: Any function that uses previous data to form a decision.
AI: Any code that dosent require human input or that can think entirely for itself. We will NEVER use anything in this.
Systems: Any worker, thread or function that does more than one specific task.
*/
/*
Developmental Markings and Identifiers.

Developer Identifiers;
    - [DEV] X;
    - [DEV] Y;
    - [DEV] Z;

Developemental Progress; All work must be marked with a developmental progress.
    - [YET]; Yet to be created.
    - [WIP]; Still being written, dosent function properly or at all.
    - [ALPHA]; Functioning, but not fully developed.
    - [BETA]; Fully developed, but still in testing.
    - [REVIEW]; Being reviewed for any possible vulnerabilites or bugs.
    - [RELEASE]; Fully developed and tested.

Difficulty Ratings/Identifiers; The more difficult a functions rating the longer it will take and require much more mental effort.
    - [D1] = Easy
    - [D2] = Medium
    - [D3] = Hard
    - [D4] = Extreme.

Example markings;
// True Example
    // [DEV] X; [WIP]
    // [TODO] [D2]: Create application controller handler and Optimize. [WIP]
    // [TODO] [D4]: Create network controller handler and Optimize. [YET]

// Descriptive Example
    // [Who wrote this part of code] Developer Indetifier; [Overral code condition]
    // [TODO] [Difficulty Rating]: Create application controller handler and Optimize. [Implementation Progress]
    // [TODO] [Difficulty Rating]: Create application controller handler and Optimize. [Implementation Progress]


*/
/*
Understanding The Communication Channels:

All the threads and processes communicate with eachother using broadcast channels.

Visualization;
  This is just a visual aid and not truely representative of the communication channels.
  
The pipes have no blocking function, and any messages sent will compeletly fill every pipe.
This means that any message ever sent will be seen by every single thread/process.

To prevent threads from using data not meant from them they will only process data that has been marked for them.
This marking is the first part of the message. It would look like this: (thread#1|blahblahblah)
If that marking dosent match the thread that is trying to process the data, the data will be ignored.

Without needing duplicate messy code in every thread/program we have a function in constants.js that will check for the threads.
That process looks like this; (Hey "msgDecode"!, Is this message for me?) (Hey "thread#1", Yes this is for you!) or (Hey "thread#1", No this isn't for you!)
Although this may seem convoluted and unneccesary, it prevents the need for a lot of messy code in each thread. 


                                        ┏━━━━━━━━━━━┓
                                        ┃   COMM    ┃
                                        ┃  CHANNEL  ┃
                                        ┗━━━━┓ ┏━━━━┛
                           ┏━━━━━━━━━━━━━━━━━┛ ┗━━━━━━━━━━━━━━━━━┓
                           ┃ ┏━━━━━━━━━━━━━━━┓ ┏━━━━━━━━━━━━━━━┓ ┃
                      ┏━━━━━━━━━━━┓          ┃ ┃           ┏━━━━━━━━━━━┓
                      ┃ THREAD    ┃          ┃ ┃           ┃ THREAD    ┃
                      ┃ #1        ┃          ┃ ┃           ┃ #2        ┃
                      ┗━━━━━━━━━━━┛          ┃ ┃           ┗━━━━━━━━━━━┛                          
               ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
               ┃ ┏━━━━━━━━━┓ ┏━━━━━━━┓ ┏━━━━━━━━━━━━━━┓ ┏━━━━━━━┓ ┏━━━━━━━━━┓ ┃
          ┏━━━━━━━━━━━┓    ┃ ┃  ┏━━━━━━━━━━━┓    ┏━━━━━━━━━━━┓  ┃ ┃    ┏━━━━━━━━━━━┓
          ┃SUB-THREAD ┃    ┃ ┃  ┃SUB-THREAD ┃    ┃SUB-THREAD ┃  ┃ ┃    ┃SUB-THREAD ┃
          ┃ #1        ┃    ┃ ┃  ┃ #2        ┃    ┃ #1        ┃  ┃ ┃    ┃ #2        ┃
          ┗━━━━━━━━━━━┛    ┃ ┃  ┗━━━━━━━━━━━┛    ┗━━━━━━━━━━━┛  ┃ ┃    ┗━━━━━━━━━━━┛  
   ┏━━━━━━━━━━━━━━━━━━━━━━━┛ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ ┗━━━━━━━━━━━━━━━━━━━━━━━━┓
   ┃ ┏━━━━━━━━━┓ ┏━━━━━━━━━┓ ┏━━━━━━━━━━┓ ┏━━━━━━━━━┓ ┏━━━━━━━━━┓ ┏━━━━━━━━━━┓ ┏━━━━━━━━━┓ ┃ 
┏━━━━━━┓    ┏━━━━━━┓     ┏━━━━━━┓    ┏━━━━━━┓    ┏━━━━━━┓    ┏━━━━━━┓     ┏━━━━━━┓    ┏━━━━━━┓
┃SUB x2┃    ┃SUB x2┃     ┃SUB x2┃    ┃SUB x2┃    ┃SUB x2┃    ┃SUB x2┃     ┃SUB x2┃    ┃SUB x2┃
┗━━━━━━┛    ┗━━━━━━┛     ┗━━━━━━┛    ┗━━━━━━┛    ┗━━━━━━┛    ┗━━━━━━┛     ┗━━━━━━┛    ┗━━━━━━┛
┏━━┓┏━━┓    ┏━━┓┏━━┓     ┏━━┓┏━━┓    ┏━━┓┏━━┓    ┏━━┓┏━━┓    ┏━━┓┏━━┓     ┏━━┓┏━━┓    ┏━━┓ ┏━━┓
┗━━┛┗━━┛    ┗━━┛┗━━┛     ┗━━┛┗━━┛    ┗━━┛┗━━┛    ┗━━┛┗━━┛    ┗━━┛┗━━┛     ┗━━┛┗━━┛    ┗━━┛ ┗━━┛




Usage Example;
    const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
    const { BroadcastChannel } = require ('broadcast-channel');
    const bc = new BroadcastChannel('master', { 
      type: 'node', 
      webWorkerSupport: false
    });
    bc.onmessage = (message) => {
        // Receiving
        var data = x.comms.msgDecode(message, "bypass");
    };
    bc.postMessage("master.application.worker|master|terminate"); // Sending

How to read and create messages;
    // Message Format: [Receiver]|[Sender]|[Data]

    Special Receivers; 
    * = all
    Addressing Scheme;
      Whenever you want to send data to someone, you must specify the receiver.
      This would usually be their name/id, but you can also specifiy groups of receivers.

      For example, setting the reciever to master.application.worker makes sure only that process will process it.
      However you can also specify groups like, interface.worker which will send it to all the interface workers under that id.       
*/
/*
Understanding The Thread Tree;

[B] = Branch; // A branch is a thread that has its own threads, Dedicated solely to keeping its twigs/branches alive.
[T] = Twig;   // Does the actual processing, may have leaves not documented here.
[L] = Leaf;   // Used to speed up processing and other small things in a twig.

Im stupid af gimme simple explantion plz;
  when branch dies any branches or twigs on that branch also die. Like a domino effect.

  *Regrowing* a twig is pretty simple and basically instant.
  *Regrowing* a branch is a bit more complicated as it also has to regrow its own branches and twigs.

How it really work tho?;
  The thread tree has been designed in a specific way to circumvent several issues like, keeping program alive and live modificaction.

  Why are these an issue, and how does this fix them?
    Whenever a program encounters an issue it will most of the time exit.
    The common method to solve this is to catch the error and deal with it later keeping the program alive.
    However this does work to an extent you will eventually get an error that you just cant catch, and the program will exit.
    Keeping all programs running seperately from eachother prevents a chain reaction of sorts and allows the rest of the program to run unaffected.
    This however is only part of the reason it was designed this way.
  
    If you have programs seperate from eachother that gives you the ability to "restart" said programs without affecting the rest of the service.
    More importantly this allows you to update certain applications and parts of the program without ever needing to restart the whole service.

    The third major reason for this development method is to keep event loops clean.
    Anytime some processing is required we can do it instantly without ever having to wait on other processes.

  What exactly happens if a process dies?
    The "master" or "controller" will catch something has gone wrong and repairs/restarts it.
    However, if any masters die, so will their children/threads. There isnt much that can be done agaisnt this issue, although it is in consideration.
    Whenever a high level master dies there becomes a real problem as every child master with its own children will be lost, and will have to restart and so on.

  This may sound complicated and hard to understand but if you literally think of it like a tree it becomes quite simple.
  See the diagram below.

/*
Full Thread Tree;

[B] = Branch; // A branch is a thread that has its own threads, Dedicated solely to keeping its twigs/braches alive.
[T] = Twig;   // Does the actual processing, may have leaves not documented here.
[L] = Leaf;   // Used to speed up processing and other small things in a twig.

[B]  ROOT (index.js)
[T]  ┣━━ Debug Interface (debug)
[ ]  ┃
[B]  ┣━━ Tor Interface (tor)
[ ]  ┃
[B]  ┣━━ Interface Controller (master.interface.worker)
[T]  ┃   ┣━━ Console Interface (cnsl.interface.worker)
[T]  ┃   ┣━━ Keypress Interface (text.interface.worker)
[T]  ┃   ┗━━ Voice Interface (voice.interface.worker)
[ ]  |
[B]  ┗━━ Application Controller (master.application.worker)
[T]      ┣━━ Chronos (chronos.application.worker)
[ ]      ┃
[B]      ┣━━ Network Controller (master.network.application.worker)
[T]      ┃   ┣━━ Network Monitor (monitor.network.application.worker)
[T]      ┃   ┣━━ Network Defence (defence.network.application.worker)
[T]      ┃   ┗━━ Network Auto/Predict (autopredict.network.application.worker)
[ ]      |
[B]      ┣━━ Administrative Toolkit (master.admin.application.worker)
[T]      ┃   ┣━━ Information Handler (info.admin.application.worker)
[T]      ┃   ┗━━ Website Panel (web.admin.application.worker)
[ ]      |
[B]      ┗━━ External Communications (master.extcom.application.worker)
[T]          ┗━━ Mobile App (mobile.extcom.application.worker)

*/
/*
Python Wrapper;

Although personally I think python isnt really needed here,
I will admit it does have some useful features, and there may be some python applications you want to add.
This wrapper will run any python and make it sure fully links and matches the rules of this program.

How it works;
    Any python code will be called under a special function which will manage the linkage between the python and the javascript.
    When using this function you need to parse the location of the file, the program identifier and an array of elements you want to pass.
    That would look something like this; await function("./pythoncode.py", "emailspam.application.worker", ["arg1", "arg2", "arg3"]);

  Using the broadcast channels;
    Without alot of complicated code to mix it between languages we will use the STD instead.
    STDOUT to send to the broadcast channel.
    STDIN to receive from the broadcast channel.
    All of the processing will be handled by the wrapper and the python code will just have to read the stdout and stdin.
*/
/*
Implemented and Planned Features;

Simplified;
    - Interface Controller
    - Application Controller
    - Administrative Toolkit
    - Network Monitor
    - Network Defence
    - Network Autonimize & Predictive Measures

Descriptive;
    - Interface Controller; This will manage the interfaces decode their values and send them to the application controller.

    - Application Controller; This will manage the applicactions and threads and directing data to the correct systems.
      This also includes error handling, like if the system is not available launching a new process/system/thread to handle that specific data.
      Pretty much everything from here on out will work under the application controller.

    - Administrative Toolkit; This will be handle all administrative needs, like manual reboots, and the like.
      It will have multiple means of access with a web panel being the default for ease of development.
      Eventually that will be disabled and the only way to access it will be within *the* client, to make use of the existing encrypted and secure communication software.

    - Network Monitor; This will monitor the entire network with two modes, snooping and intercepting (MITM).

    - Network Defence; This will use the data from the network monitor to create a network defence system. This will have 2 base levels of defence.
      The first is a simple firewall watching for known attacks, this could be known DoS methods and vulnerabilites, we can power this knowledge using exploit databases.
      The second is a more advanced firewall. This will look for any out of the ordinary network traffic and will block it. This will be done using historical data, cross checking address.
        Cross checking of addresses can be done using certifications, geo-location, and reported malicous traffic.
      Whenever an attack is detected, the system will alert and switch from snooping mode to intercepting mode, where it can properly handle the attack.
      A whitelist of sorts is required to prevent this from blocking legitimate traffic.
      A Method to detect spoofing is required.

    - Network Autonimize & Predictive Measures; Exapanding on Network Defence, this is the more advanced sort of systems, this will need to be able to predict the next traffic and block it.
      Systems have already been created to help assist this process, for example systems like reverseIPProcess which can trace devices behind any address and "follow" them.
        Allowing it to block address before they even try to reach us.
      This will also be required to make an assumption of the risk to cost ratio and make a decision on how many resourses to allocate in order to block it as effectively as possible.
*/

/*
Feature Implementation / What needs to be done.

There will always be more information about what needs to be done inside their respective files.

- Interface Controller;
    - [TODO]: Create input handlers for, voice, text, and console. (voice.interface.worker, text.interface.worker, cnsl.interface.worker)
        - [INFO]: Each twig needs to be able to handle its own input, and send it to the master twig (master.interface.worker)
                  You can just use the broadcast to send the data.
    - [TODO]: Create a user interface for the console. (cnsl.interface.worker)   
- Administrative Toolkit;
    - [TODO]: Create a web interface for the administrative toolkit. (web.admin.application.worker).
              Add options like, reboot, shutdown, and other things to manage threads, also system information.
              All this data will be privated by the api.
              Only the visual interface is required.

*/
var x = require("./constants.js");

const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require("worker_threads");
const { BroadcastChannel } = require("broadcast-channel");
const bc = new BroadcastChannel("master", {
  type: "node",
  webWorkerSupport: false,
});
let whoami, application, interfacex;
var runningProcesses = [];
var usedids = ["0"];

// Worker Indentifiers

x.whoami = "master";
debugx = "debug";

application = "master.application.worker";
interfacex = "master.interface.worker";

x.onmsg = async function (message) {
  // See original function for information

  var data = JSON.parse(message);

  switch (data.msg) {
    case "Starting!": {
      runningProcesses.push(data.from);
      break;
    }
    case "Terminating!": {
      console.log(`Removing ${data.from} from running processes`);
      runningProcesses.splice(runningProcesses.indexOf(data.from), 1);
      console.log(`Running processes: ${runningProcesses}`);
      break;
    }
    case "getProcesses": {
      x.sendMsg(
        data.from,
        x.whoami,
        runningProcesses.toString(),
        "response",
        data.id
      );
      break;
    }
    case "getIds": {
      x.sendMsg(data.from, x.whoami, usedids.toString(), "response", data.id);
      break;
    }
    case "getUsedIds": {
      bc.postMessage(
        JSON.stringify({
          to: data.from,
          from: "master",
          msg: usedids.toString(),
          id: "-1",
        })
      );
      break;
    }
    case "addUsedIds": {
      usedids.push(data.id);
      break;
    }
  }
  if (`${data.id}`.includes("-") || data.id == "0") {
    // am too stupid to know how to use an or with if false
  } else {
    usedids.push(data.id);
    var i = 0;
    var loc = [];
    usedids.forEach(function (id) {
      if (id == data.id) {
        i++;
        loc.push(id);
      }
      if (i == 2) {
        usedids.splice(usedids.indexOf(loc[0]), 1);
        usedids.splice(usedids.indexOf(loc[1]), 1);
        //usedids.splice(usedids.indexOf(loc[2]), 1);
      }
    });
  }
};

async function main() {
  x.threading.init(x.whoami);
  x.threading.start(debugx);
  x.threading.start(application);
  x.threading.start(interfacex);
}
main();
