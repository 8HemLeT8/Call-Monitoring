// https://www.cloudkarafka.com/ הפעלת קפקא במסגרת ספק זה

//const uuid = require("uuid");
const Kafka = require("node-rdkafka");
const redis = require("redis");


let client = redis.createClient();


const kafkaConf = {
    "group.id": "cloudkarafka-example",
    "metadata.broker.list": "rocket-01.srvs.cloudkafka.com:9094,rocket-02.srvs.cloudkafka.com:9094,rocket-03.srvs.cloudkafka.com:9094".split(
        ","
    ),
    "socket.keepalive.enable": true,
    "security.protocol": "SASL_SSL",
    "sasl.mechanisms": "SCRAM-SHA-256",
    "sasl.username": "gh38yfvy",
    "sasl.password": "LeRLm1cUVd29Z5tELhuuBlAB1tU11f_D",
    debug: "generic,broker,security",
};

const prefix = "gh38yfvy-";
const fastTopic = `${prefix}fast`;
const slowTopic = `${prefix}slow`;

const consumer = new Kafka.KafkaConsumer(kafkaConf);


// CREDIT : https://github.com/CloudKarafka/nodejs-kafka-example/blob/master/consumer.js

consumer.on("error", function (err) {
    console.error(err);
});
consumer.on("ready", function (arg) {
    console.log(`Consumer is ready`);
    consumer.subscribe([fastTopic]);
    consumer.consume();
});
consumer.on("data", function (m) {
    console.log("calling commit");
    consumer.commit(m);
    console.log("The value is : " + m.value.toString());
    const s = m.value.toString();
    let content = JSON.parse(s);
   // console.log(content.id);
    client.set(content.id+"", s, redis.print);
});

consumer.on("disconnected", function (arg) {
    process.exit();
});
consumer.on("event.error", function (err) {
    console.error(err);
    process.exit(1);
});
consumer.on("event.log", function (log) {
    // console.log(log);
});
consumer.connect();


