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

async function aggNumOfWaitingCalls() {}

async function aggWaitingTime() {}

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

getCallsPerAtt("language");
getCallsPerAtt("status");
getCallsPerAtt("topic");
getCallsPerAtt("city");
