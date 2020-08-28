const asyncRedis = require("async-redis");
const client = asyncRedis.createClient();

// ---------------------------------------------------- HELPERS -------------------------------------------

async function collectAllData() {
  let keysArr = await collectAllKeys();
  let arr = [];

  for (let i = 0; i < keysArr.length; i++) {
    let call = await client.get(keysArr[i]);
    call = JSON.parse(call);
    arr.push(call);
  }
  return arr;
}

async function collectAllKeys() {
  return new Promise((resolve, reject) => {
    let keys = client.keys("*");
    resolve(keys);
  });
}

function under10minutes(callTime) {
  return Math.floor((parseInt(Date.now()) - parseInt(callTime)) / 1000) < 600
    ? true
    : false;
}

//  ---------------------------------------------------- STATISTIC CALCULATIONS -------------------------------------------

async function last10MinCallsAvg() {}

async function last10MinWaitingTimeAvg() {
  const keysArr = await collectAllKeys();
  let arr = [];

  for (let i = 0; i < keysArr.length; i++) {
    let call = await client.get(keysArr[i]);
    call = JSON.parse(call);
    // console.log("time difference in seconds: " + Math.floor((parseInt(Date.now()) - parseInt(call.id)) / 1000));
    if (under10minutes(call.id)) {
      arr.push(call.totalTime);
    }
  }
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  sum /= arr.length;
  console.log(sum);
  return sum;
}

async function aggOf5min(callAttribute) {
  var d = new Date();
  d.setHours(0, 0, 0, 0); // midnight
  let from = Math.floor(d.getTime() / 1000);
  let to = from + 300;
  let now = Math.floor(new Date().getTime() / 1000);
  let avgs = [];
//   console.log(to);
//   console.log(now);
//   console.log(stop);

  let temp = [];

  let data = await collectAllData();
//   console.log(data);


  while (to < now) {
    
    for (let i = 0; i < data.length; i++) {
      let curr = Math.floor(parseInt(data[i][callAttribute]) / 1000);
      if (to - curr <= 300 && to - curr >= 0) {
        // add only calls from the last 5 minutes
        //   console.log(curr);

        temp.push(parseInt(data[i].totalTime));
        //  console.log(temp);
      }
    }
    
    let sum = 0;
    if (temp.length > 0) {
      for (let i = 0; i < temp.length; i++) {
        //    console.log(temp[i])
        sum += temp[i];
      }
      sum /= temp.length;
    }
    console.log(sum);
    avgs.push(sum);
    to += 300;
    temp = [];
  }
//   console.log(avgs);
  return avgs;
}

async function getCallsPerAtt(callAttribute) {
  let data = await collectAllData();

  let callsPerAtt = {};
  let currentAttValue = "";
  for (let index = 0; index < data.length; index++) {
    currentAttValue = data[index][callAttribute];
    if (callsPerAtt[currentAttValue] !== undefined) {
      callsPerAtt[currentAttValue]++;
    } else {
      callsPerAtt[currentAttValue] = 1;
    }
  }
  console.log(callsPerAtt);
  return callsPerAtt;
}

// async function calcStatistics() {
//   return {
//     waitingTime: await last10MinWaitingTimeAvg(),
//     waitingCalls: await last10MinCallsAvg(),
//     aggWaitingTime: await aggWaitingTime(),
//     aggWaitingCalls: await aggNumOfWaitingCalls(),
//     distByReq: await callsDistByReq(),
//     distByLanguage: await callsDistByLanguage(),
//     callsPerArea: await callsPerArea(),
//     callsPerTopic: await callsPerTopic(),
//   };
// }

function test() {}
// last10MinWaitingTimeAvg();                        DONE
// getCallsPerAtt("language");
// getCallsPerAtt("status");
// getCallsPerAtt("topic");
// getCallsPerAtt("city");
//aggOf5min('id');
//aggOf5min('totalCalls');
