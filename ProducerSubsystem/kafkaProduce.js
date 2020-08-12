// https://www.cloudkarafka.com/ הפעלת קפקא במסגרת ספק זה

const uuid = require("uuid");
const Kafka = require("node-rdkafka");

const kafkaConf = {
  "group.id": "cloudkarafka-example",
  "metadata.broker.list": "rocket-01.srvs.cloudkafka.com:9094,rocket-02.srvs.cloudkafka.com:9094,rocket-03.srvs.cloudkafka.com:9094".split(","),
  "socket.keepalive.enable": true,
  "security.protocol": "SASL_SSL",
  "sasl.mechanisms": "SCRAM-SHA-256",
  "sasl.username": "gh38yfvy",
  "sasl.password": "LeRLm1cUVd29Z5tELhuuBlAB1tU11f_D",
  "debug": "generic,broker,security"
};

const prefix = "gh38yfvy-";
const fastTopic = `${prefix}fast`;
const slowTopic = `${prefix}slow`;

const producer = new Kafka.Producer(kafkaConf);

const genMessage = m => new Buffer.alloc(m.length,m);

producer.on("ready", function(arg) {
  console.log(`producer Ariel is ready.`);
});
producer.connect();

module.exports.publishToFastRoute= function(msg)
{   
  m=JSON.stringify(msg);
  producer.produce(fastTopic, -1, genMessage(m), uuid.v4());  
  //producer.disconnect();   
}

module.exports.publishToSlowRoute= function(msg)
{   
  m=JSON.stringify(msg);
  producer.produce(slowTopic, -1, genMessage(m), uuid.v4());  
  //producer.disconnect();   
}