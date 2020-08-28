const redis = require("redis");

let times = [];
let client = redis.createClient();

let i = 0;
function avgWaitTime() {
    client.keys("*", (err, keys) => {

        keys.forEach((key) => {
            client.get(key, function (err, val) {

                const json = JSON.parse(val);
                //  console.log("time difference in seconds: " + Math.floor((parseInt(Date.now()) - parseInt(json.id)) / 1000));

                if (Math.floor((parseInt(Date.now()) - parseInt(json.id)) / 1000) < 600) { // add only calls from the last 10 minutes
                    // console.log(json.totalTime);
                    times.push(json.totalTime);

                }
                i++;
                if (i >= keys.length) {
                    //  console.log(times);
                    let sum = 0;
                    for (let i = 0; i < times.length; i++) {
                        sum += times[i];
                    }
                    sum /= times.length;
                    console.log("waiting time avg: " + (sum));
                    return times;

                }
            });
        });
    });

}



/*
function avgWaitTime() {
    client.keys("*", (err, keys) => {

        let times = [];
        let count = 0;

        keys.forEach((key) => {
            client.get(key, function (err, val) {

                const json = JSON.parse(val);
                //  console.log("time difference in seconds: " + Math.floor((parseInt(Date.now()) - parseInt(json.id)) / 1000));

                if (Math.floor((parseInt(Date.now()) - parseInt(json.id)) / 1000) < 600) { // add only calls from the last 10 minutes
                    times.push(json.totalTime);
                    ++count;
                } else {
                    //  --count;
                }

                if (count > 0) {
                    console.log(times);
                    let sum = 0;
                    for (let i = 0; i < times.length; i++) {
                        sum += times[i];
                    }
                    sum /= times.length;
                    console.log("waiting time avg: " + (sum));

                }

            });
        });

    });
}
*/


function countByCity() {
    client.keys("*", (err, keys) => {

        let cities = [];
        let count = keys.length;

        keys.forEach((key) => {   //for each key obj will be the value
            client.get(key, function (err, obj) {

                const json = JSON.parse(obj);

                //  console.log(json);
                cities.push(json.city);

                --count;
                if (count <= 0) {
                    //console.log(cities);

                    let wordcnt = cities.reduce(function (map, word) { //map reduce to count each city
                        map[word] = (map[word] || 0) + 1;
                        return map;

                    }, Object.create(null));

                    console.log("amount of calls by city: " + JSON.stringify(wordcnt, null, 2));

                }

            });
        });

    });
}

function countByLenguage() {
    client.keys("*", (err, keys) => {

        let lengs = [];
        let count = keys.length;

        keys.forEach((key) => {  //for each key obj will be the value
            client.get(key, function (err, obj) {

                const json = JSON.parse(obj);

                //  console.log(json);
                lengs.push(json.language);

                --count;
                if (count <= 0) {
                    //  console.log(cities);

                    let wordcnt = lengs.reduce(function (map, word) { //map reduce to count each topic
                        map[word] = (map[word] || 0) + 1;
                        return map;

                    }, Object.create(null));

                    console.log("amount of calls by lenguage: " + JSON.stringify(wordcnt, null, 2));
                    return wordcnt;
                }

            });
        });

    });
}

function countBySubject() {
    client.keys("*", (err, keys) => {

        let topics = [];
        let count = keys.length;

        keys.forEach((key) => {  //for each key obj will be the value
            client.get(key, function (err, obj) {

                const json = JSON.parse(obj);

                //  console.log(json);
                topics.push(json.topic);

                --count;
                if (count <= 0) {
                    //  console.log(cities);

                    let wordcnt = topics.reduce(function (map, word) { //map reduce to count each topic
                        map[word] = (map[word] || 0) + 1;
                        return map;

                    }, Object.create(null));

                    console.log("amount of calls by cause: " + JSON.stringify(wordcnt, null, 2));
                    return wordcnt;
                }

            });
        });

    });
}


function countByStatus() {
    client.keys("*", (err, keys) => {

        let statuses = [];
        let count = keys.length;

        keys.forEach((key) => {  //for each key obj will be the value
            client.get(key, function (err, obj) {

                const json = JSON.parse(obj);

                //  console.log(json);
                statuses.push(json.status);

                --count;
                if (count <= 0) {

                    let wordcnt = statuses.reduce(function (map, word) { //map reduce to count each topic
                        map[word] = (map[word] || 0) + 1;
                        return map;

                    }, Object.create(null));

                    console.log("amount of calls by status: " + JSON.stringify(wordcnt, null, 2));
                    return wordcnt;
                }

            });
        });

    });
}


function waitTimeAggregation() {
    var d = new Date();
    d.setHours(0, 0, 0, 0); // midnight
    // console.log(d.getTime());
    //  console.log(new Date().getTime());
    let from = Math.floor(d.getTime() / 1000);
    let to = from + 300;
    let now = Math.floor(new Date().getTime() / 1000);
    let stop = Math.floor((now - from) / 300); //how much 5 min slots today
    let avgs = [];

    console.log(to);
    console.log(now);
    console.log(stop);

    let data = [];
    let temp = [];

    //console.log(to);
    client.keys("*", (err, keys) => {

        keys.forEach((key) => {
            client.get(key, function (err, val) {
                const json = JSON.parse(val);
                data.push(json);
                if (data.length >= keys.length) {

                    while (to < now) {

                          for (let i = 0; i < data.length; i++) {
                            let curr = Math.floor(parseInt(data[i].id) / 1000);
                            if ((to - curr) <= 300 && (to - curr) >= 0) { // add only calls from the last 5 minutes
                                //   console.log(curr);

                                temp.push(parseInt(data[i].totalTime));
                              //  console.log(temp);


                            }
                        }
                     //   console.log("end of for");

                        // console.log(temp.length);
                        let sum = 0;
                        if (temp.length > 0) {
                            for (let i = 0; i < temp.length; i++) {
                                //    console.log(temp[i])
                                sum += temp[i];
                            }
                            sum /= temp.length;
                        }

                        avgs.push(sum);
                        console.log(sum);
                        to += 300;
                        temp = [];
                    }

                    if (stop <= avgs.length) {
                        console.log(Math.max(avgs));
                        return avgs;
                    }

                };
            });
        });
    });
}




/*
countByCity();
countByLenguage();
countBySubject();
countByStatus();

avgWaitTime();
*/


waitTimeAggregation();