const mqtt = require("mqtt");
const { get, post, put } = require("./helper");

const HOST = `mqtt://34.70.45.52`;
const TOPICS = [
  "/solenoid/on",
  "/solenoid/off",
  "/flow/monitor",
  "/get/setting",
  "/set/setting",
];

const options = {
  clientId: "MCFSystem_node_server",
  port: 1883,
};

var client;

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

  let body;
  switch (topic) {
    case TOPICS[2]:
      try {
        payload = JSON.parse(payload.toString());

        const { flow, temperature, solenoid } = payload;
        body = { flow, temperature, solenoid };
        post("logs", body);
      } catch (e) {
        console.log(e);
      }
      break;

    case TOPICS[3]:
      get("settings?serialized=1", (response) => {
        //   ketika success get publish response
        if (response && response.status === "success") {
          let message = {};
          try {
            message = JSON.stringify(response.result.setting);
          } catch (e) {
            console.log(e);
          }

          client.publish("/set/setting", message);
        }
      });
      break;

    // case TOPICS[0]:
    //   body = {
    //     key: "solenoid",
    //     value_decimal: 1,
    //   };
    //   put("settings", body);
    //   break;

    // case TOPICS[1]:
    //   body = {
    //     key: "solenoid",
    //     value_decimal: 0,
    //   };
    //   put("settings", body);
    //   break;

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
  client.publish(topic, payload);
}

module.exports = {
  run: run,
  clientPublish: clientPublish,
};
