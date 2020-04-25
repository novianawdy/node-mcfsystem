const mqtt = require("mqtt");
const { get, post } = require("./helper");
const RequestBody = require("./RequestBody");

const HOST = `mqtt://34.70.45.52`;
const TOPICS = [
  "/solenoid/on", // 0
  "/solenoid/off", // 1
  "/flow/monitor", // 2
  "/get/setting", // 3
  "/set/setting", // 4
  "monitoring", // 5
  "/solenoid", // 6
];

const options = {
  clientId: "MCFSystem_node_server",
  port: 1883,
};

/**
 * @type {mqtt.Client}
 */
let client;

/**
 * @type {RequestBody}
 */
let request;

/**
 *
 * @param {void} cb callback after connect and subscribed
 */
function run(cb) {
  client = mqtt.connect(HOST, options);
  client.on("connect", () => onConnect(cb));
  client.on("reconnect", onReconnect);
  client.on("error", onError);
  client.on("close", onClose);
  client.on("message", onMessage);

  get("settings?serialized=1", (response) => {
    //   ketika success get publish response
    if (response && response.status === "success") {
      let message = {};
      try {
        message = response.result.setting;
      } catch (e) {
        console.log(e);
      }

      request = new RequestBody(0, message.fake_temperature, message.solenoid);
    }
  });
}

function onReconnect() {
  mqtt.connect(HOST, options);
}

/**
 *
 * @param {void} cb callback after connect and subscribed
 */
function onConnect(cb) {
  client.subscribe(TOPICS, (error) => {
    console.log("MQTT subscribing topics");
    if (error) {
      console.log(error);
    } else if (cb) {
      console.log("MQTT succes subscribe");
      cb();
    } else {
      console.log("MQTT succes subscribe");
    }
  });
}

function onError(error) {
  console.log(error);
}

function onClose() {
  console.log("Closing connection");
}

function onMessage(topic, payload) {
  console.log("Message arrived", topic, payload.toString());

  switch (topic) {
    case TOPICS[2]:
      try {
        payload = parseFloat(payload.toString());

        request.flow = payload;
        client.publish("monitoring", JSON.stringify(request.body));
        post("logs", request.body, (r) => console.log("POST", r));
      } catch (e) {
        console.log(e);
      }
      break;

    default:
      break;
  }
}

/**
 *
 * @param {string} topic
 * @param {string} payload
 */
function clientPublish(topic, payload) {
  return client.publish(topic, payload);
}

/**
 *
 * @param {string | number} temperature
 * @param {string | number} solenoid
 */
function setRequest(temperature, solenoid) {
  request.temperature = temperature;
  request.solenoid = solenoid;

  return request.body;
}

module.exports = {
  run: run,
  clientPublish: clientPublish,
  setRequest: setRequest,
};
