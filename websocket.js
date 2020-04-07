const Pusher = require("pusher-js");
const myMqtt = require("./mqtt");
const { token, get } = require("./helper");

const setting = {
  baseUrl: "http://api.mcfsystem.hostkulo.com/",
  wsserver: "api.mcfsystem.hostkulo.com",
};

const pusherSetting = {
  wsHost: setting.wsserver,
  wsPort: 6001,
  authTransport: "ajax",
  authEndpoint: `${setting.baseUrl}broadcasting/auth`,
  auth: {
    headers: {
      Authorization: token,
      Accept: "application/json",
    },
  },
};

var pusher;
var userChannel;

function run() {
  get("user/show", (res) => {
    if (res && res.status === "success") {
      const user = res.result;
      const channel = `private-notification.${user ? user.id : ""}`;

      pusher = new Pusher("08bc04087062ea175b28f2eba6f03552", pusherSetting);
      userChannel = pusher.subscribe(channel);
      console.log(`subscribing channel:`, userChannel.name);

      userChannel.bind_global((eventName, data) => {
        console.log(eventName);
        if (data) {
          formatEvent(data);
        }
      });
    }
  });
}

function formatEvent(data) {
  const { notification, payload } = data;
  const { type } = notification;
  let setting_serialized;

  switch (type) {
    // Temperature
    case 1:
      setting_serialized = JSON.stringify(payload.setting_serialized);
      myMqtt.clientPublish("/set/setting", setting_serialized);
      break;

    // Setting Change
    case 4:
      setting_serialized = payload.setting_serialized;
      let solenoidTopic, solenoidMessage;
      if (parseFloat(setting_serialized.solenoid) === 1) {
        solenoidTopic = "/solenoid/on";
        solenoidMessage = "ON";
      } else {
        solenoidTopic = "/solenoid/off";
        solenoidMessage = "OFF";
      }
      myMqtt.clientPublish(solenoidTopic, solenoidMessage);
      break;

    default:
      break;
  }
}

module.exports = {
  run: run,
};
