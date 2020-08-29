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

async function last10MinAvg(callAttribute) {
  const keysArr = await collectAllKeys();
  let arr = [];

  for (let i = 0; i < keysArr.length; i++) {
    let call = await client.get(keysArr[i]);
    call = JSON.parse(call);
    // console.log("time difference in seconds: " + Math.floor((parseInt(Date.now()) - parseInt(call.id)) / 1000));
    if (under10minutes(call.id)) {
      arr.push(call[callAttribute]);
    }
  }
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  if(arr.length==0) {
    return 'There where no calls in the last 10 minutes';
  }

  sum /= arr.length;
  // console.log(sum);
  return sum;
}

async function aggOf5min(callAttribute) {
  var d = new Date();
  d.setHours(0, 0, 0, 0); // midnight
  let from = Math.floor(d.getTime() / 1000);
  let to = from + 300;
  let now = Math.floor(new Date().getTime() / 1000);

  let avgs = [];
  let temp = [];
  let data = await collectAllData();

  while (to < now+300) {
    for (let i = 0; i < data.length; i++) {
      let curr = Math.floor(parseInt(data[i].id) / 1000);
      if (to - curr <= 300 && to - curr >= 0) {
        // add only calls from the last 5 minutes
        //   console.log(curr);

        temp.push(parseInt(data[i][callAttribute]));
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
    avgs.push(sum);
    to += 300;
    temp = [];
  }
    console.log(avgs.length);
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
  // console.log(callsPerAtt);
  return callsPerAtt;
}

module.exports.calcStatistics= async function () {
  return {
    waitingTime: await last10MinAvg("totalTime"),
    waitingCalls: await last10MinAvg("totalCalls"),
    aggWaitingTime: await aggOf5min("totalTime"),
    aggWaitingCalls: await aggOf5min("totalCalls"),
    distByReq: await getCallsPerAtt("status"),
    distByLanguage: await getCallsPerAtt("language"),
    callsPerArea: await getCallsPerAtt("city"),
    callsPerTopic: await getCallsPerAtt("topic"),
  };

}


