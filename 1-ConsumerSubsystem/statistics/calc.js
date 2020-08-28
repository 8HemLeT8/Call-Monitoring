const redis = require("redis");

let times = [];
let client = redis.createClient();

let i = 0;


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