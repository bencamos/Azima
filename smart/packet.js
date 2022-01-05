//const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
//const { BroadcastChannel } = require ('broadcast-channel');
//const bc = new BroadcastChannel('master', { 
//  type: 'node', 
//  webWorkerSupport: false
//});

var brain = require('brain.js');
var fs = require('fs');

var readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const {GPU} = require('gpu.js');
const gpu = new GPU();

var pos = require('pos');

//var x = require('../../../constants.js');

// [DEV] X; [WIP];
let web, comms;

//x.whoami = workerData;
// Worker Identifiers

async function main() {
    x.threading.init(x.whoami);
}

//x.onmsg = async function(message) { 
    // See original function for information
//}
//main();

async function train() {
  // just experimenting with shit here
    console.log("Starting train")
    console.time("Training");

    /*net.train([
      { input: "", output: {"bad": 0} }
    ]);
    const json = net.toJSON()
    const data = JSON.stringify(json);
    fs.writeFileSync('data/test.json', data)*/
    //net.fromJSON(JSON.parse(fs.readFileSync("data/test3.json")));
    var net = await load();
    fs.writeFileSync('data/test5.json', JSON.stringify(net.toJSON()))

    console.timeEnd("Training");
    console.log("unknown good output = "+ JSON.stringify(await net.run(await hexToDec("e4f4c619223e00e04ce7014c0800450000308eab000040110000c0a801e99fc4106dec1bccbd001c72f01100242dbdbb1421c1be0ff1001000002226f544"))));
    console.log("unknown bad output = "+ JSON.stringify(await net.run(await hexToDec("123456780000000000000002000186a3000000020000000000000000000000000000000000000000"))));
    console.log("known good output = "+ JSON.stringify(await net.run(await hexToDec("e4f4c619223e00e04ce7014c08004500003099e1000040110000c0a801e9c7226875ec1b2327001cf256410080e9bdb5a51f00"))));
    console.log("known bad output = "+ JSON.stringify(await net.run(await hexToDec("e5d80000000100000000000020434b4141414141414141414141414141414141414141414141414141414141410000210001"))));

}

async function hexToDec(s) {
    //stolen from https://stackoverflow.com/questions/21667377/javascript-hexadecimal-string-to-decimal-string
    //console.time("hexToDec");
    var i, j, digits = [0], carry;
    for (i = 0; i < s.length; i += 1) {
        carry = parseInt(s.charAt(i), 16);
        for (j = 0; j < digits.length; j += 1) {
            digits[j] = digits[j] * 16 + carry;
            carry = digits[j] / 10 | 0;
            digits[j] %= 10;
        }
        while (carry > 0) {
            digits.push(carry % 10);
            carry = carry / 10 | 0;
        }
    }
    //console.timeEnd("hexToDec");
    return digits.reverse().join('');
}

async function load() {
  var readline = require('readline');
  var net = new brain.NeuralNetworkGPU();
  fs.writeFile('temp.txt', '', function(){})
  
  
  /*
  The raw data looks like this.

0000  00 e0 4c e7 01 4c e4 f4 c6 19 22 3e 08 00 45 00   ..L..L....">..E.
0010  00 5b e4 64 40 00 3a 06 71 1d a2 9f 85 ea c0 a8   .[.d@.:.q.......
0020  01 e9 01 bb 04 01 46 f3 2d 45 f8 92 4a b8 50 18   ......F.-E..J.P.
0030  ff ff 26 19 00 00 17 03 03 00 2e 40 6f ac 0e 8f   ..&........@o...
0040  94 df 05 7a ed a4 38 77 68 fa 05 54 72 30 19 ee   ...z..8wh..Tr0..
0050  74 2d cf 5d 19 37 99 cd f0 c5 58 94 9d 47 02 33   t-.].7....X..G.3
0060  bf 6d d1 de 1c 7c f4 95 de                        .m...|...

0000  ff ff ff ff ff ff e4 f4 c6 19 22 3e 08 06 00 01   ..........">....
0010  08 00 06 04 00 01 e4 f4 c6 19 22 3e c0 a8 01 01   ..........">....
0020  00 00 00 00 00 00 c0 a8 01 44 00 00 00 00 00 00   .........D......
0030  00 00 00 00 00 00 00 00 2f 22 53 06               ......../"S.

and we need it to look like this 
e4f4c619223e00e04ce7014c08004500003099e1000040110000c0a801e9c7226875ec1b2327001cf256410080e9bdb5a51f00
00e04ce7014ce4f4c619223e08004500003a571540003a1176db9fc4106dc0a801e9ccbdec1b0026c68b2102242cfbf7b4ad0000000000380000f543222200080000000000000000000000000000000000000000000000000000000000000000
  */
  var fileStream = fs.createReadStream('C:/Users/RottenDirector/Documents/data2.txt', {highWaterMark : 534773760}); // 510MB max is 512MB

  const rl = readline.createInterface({
    input: fileStream,
    maxLineLength: 640000
  });

  var loopCount = 0;
  var pktCount = 0;
  var dataxx = [];
  var temp = "";
  //console.time("Overrall")
  for await (const line of rl) {
    loopCount++
    //console.time("Loop Time")
    if (line.includes("  ") && line.split("")[4] == " " && line.split("")[5] == " ") {
      temp = temp + line.substring(6).split('   ')[0].replace(/ /g, "");
    } else {
      //console.time("Data Push")
      if (Buffer.from(temp).length < 1875) dataxx.push({input: await hexToDec(temp), output: {"good": 1}});// Ignore if packet larger then 15kb
      if (dataxx.length >= 1000) {
        console.log("Training Datasets; Example: ", dataxx[0]);
        net.train(dataxx, {
          iterations: 500,
          timeout: Infinity,
          log:true,
          logPeriod:1
        });
        dataxx = [];
      }
      //console.timeEnd("Data Push")
      //console.timeEnd("Loop Time")
      //console.log("Loop: ", loopCount, " Packet: ", pktCount++);
      temp = ""
    }
  }
  if (dataxx.length > 0) {
    net.train(dataxx, {
      iterations: 500,
      timeout: Infinity,
      log:true,
      logPeriod:1
    });
    dataxx = [];
  }
  console.timeEnd("Overrall")
  console.log("Loaded")
  return net;
}

async function loadandrun() {
    var net = new brain.recurrent.LSTM();
    readline.question('load >', name => {
      console.time("Loading");
      var networkState = JSON.parse(fs.readFileSync(`data/${name}.json`, "utf-8"));
      net.fromJSON(networkState);
      console.timeEnd("Loading");
      readline.question('prompt >', x => {
          console.log("output = "+net.run(x));
          readline.close();
      });
    });
}

async function test() {
    var net = new brain.recurrent.LSTM();
    var networkState = JSON.parse(fs.readFileSync(`data/test.json`, "utf-8"));
    net.fromJSON(networkState);
    console.log("output = "+net.run("we had a real shit dayz  "));
}

async function merge(arrays) {
  var final = [];
  var i = 0;
  // Here we just go thru arrays and each of their subarrays setting a count for the length.
  await arrays.forEach(async (array) => {
    await array.forEach(async (element) => {
       i++;
    })
  })
  // Generating the final array length
  for (var j = 0; j < i; j++) {
    final.push("nul");
  }
  // Finally pushing the elements into the final array in the correct order.
  // Order is implemented like such
  // 0 = ["nul", "nul", "nul"];
  // 1 = ["a", "nul", "c"];
  // 2 = ["nul", "b", "nul"];
  // Each array will set their own contents to 0, based on the current index.
  // Bypassing the adding if the content isnt "nul"
  // The end result looks like this
  // 0 = ["a", "b", "c"];
  await arrays.forEach(async (z) => {
    await z.forEach(async (element, index) => {
       if (final[index] == "nul") {
         final[index] = element;
       }
    })
  })
  final = final.join(" ").replace(/nul/g, " ").replace(/\s+/g,' ').replace(/\s+$/, '').split(" ");
  console.log("decoded", final);
}

async function referx(from, where) {
  // Work backwards and find last noun used.
  // Need to add support for conjunctions
  var words = await new pos.Lexer().lex(from.split(" ").slice(0, where).reverse().join(" "));
  var tags = await new pos.Tagger()
    .tag(words)
  var lastNoun, bypass;
  await tags.forEach(async (element) => {
    if (bypass) return;
    if (element[1] == "NN" || element[1] == "NNP" || element[1] == "NNS") {
      lastNoun = element[0];
      bypass = 1;
      return;
    }
  })
  return lastNoun;
}

async function requestDecoder() {
  // Here we just take the full request and break it down into basic operations that Azima can handle easily in bulk. Similar to pesudo code.
  // For example "restart the webhost then restart the comms if it fails do a rollback" becomes "restart webhost then restart comms if negative rollback".


  var rqst = "restart the webhost then restart the comms if it fails do a rollback"
  // grab parts of text ; [ [ 'restart', 'VB' ], [ 'the', 'DT' ], [ 'webhost', 'NN' ] ]
  var words = await new pos.Lexer().lex(rqst);
  var tags = await new pos.Tagger()
    .tag(words)
  //
  console.log("pos", tags)

  // We will be reusing some of these for other words which dont really fit.
  var loopCycle = 0;
  var conjUpdated = 0;
  var whoUpdated = 0;
  var whatUpdated = 0;
  var referUpdated = 0;

  var whatToDo = [];
  var whoToDo = [];
  var refer = [];
  var conj = [];
  await tags.forEach(async (element) => {
      switch(element[1]) {
          case "IN":
              // Preposition
              if (element[0] == "if") {
                  conj.push(element[0]);
                  conjUpdated = 1;
              }
              break;
          case "RB": 
              // We found a adverb
              // We only really care if its something like "then"
              if (element[0] == "then") {
                conj.push(element[0]);
                conjUpdated = 1;
              }
              break;
          case "CC": 
              // We found a conjunction
              conj.push(element[0]);
              conjUpdated = 1;
              break;
          case "PRP": 
              // Refering to last noun
              refer.push(await referx(rqst, loopCycle));
              referUpdated = 1;
              break;
          case "PRP$":
              // Refering to last noun
              refer.push(await referx(rqst, loopCycle));
              referUpdated = 1;
              break;
      }
      // We have a couple outside the switch as they require includes, otherwise there would be several extremely similar cases.
      if (element[1].includes("NN")) {
          // We found a noun
          whoToDo.push(element[0]);
          whoUpdated = 1;
      }

      if (element[1].includes("VB")) {
         // We found a verb
          var x;
          if (element[0].includes("fail") || element[0].includes("error") || element[0].includes("br")) {
            x = "negative";
          } else if (element[0].includes("succe") || element[0].includes("work") || element[0].includes("pass")) {
            x = "positive";
          } else {
            x = element[0];
          }

          // things we explicitly dont care about
          switch (element[0]) {
              case "do":
                //
                break;
            
              default:
                whatToDo.push(x);
                whatUpdated = 1;
          }
      }

      if (!conjUpdated) conj.push("nul");
      if (!referUpdated) refer.push("nul");
      if (!whoUpdated) whoToDo.push("nul");
      if (!whatUpdated) whatToDo.push("nul");
      whoUpdated = 0;
      conjUpdated = 0;
      whatUpdated = 0;
      referUpdated = 0;
      loopCycle++;
  });
  console.log("whatToDo", whatToDo);
  console.log("whoToDo", whoToDo);
  console.log("refer", refer);

  await merge([whatToDo, whoToDo, refer, conj]);
}

readline.question('what >', what => {
    if (what == "train") train();
    if (what == "test") test();
    if (what == "loadandrun") loadandrun();
    if (what == "reqDec") requestDecoder();
    readline.close();
});

