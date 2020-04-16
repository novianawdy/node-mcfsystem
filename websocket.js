const Pusher = require("pusher-js");
const myMqtt = require("./mqtt");
const { token, get } = require("./helper");

const setup = {
  baseUrl: "http://api.mcfsystem.hostkulo.com/",
  wsserver: "api.mcfsystem.hostkulo.com",
};

const pusherSetting = {
  wsHost: setup.wsserver,
  wsPort: 6001,
  authTransport: "ajax",
  authEndpoint: `${setup.baseUrl}broadcasting/auth`,
  auth: {
    headers: {
      Authorization: token,
      Accept: "application/json",
    },
  },
};

/**
 * @type {Pusher.Pusher}
 */
let pusher;

/**
 * @type {Pusher.Channel}
 */
let userChannel;

function run() {
  try {
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
  } catch (error) {
    console.log("Error getting user IOT data", error);
  }
}

function formatEvent(data) {
  const { notification, payload } = data;
  const { type } = notification;

  /**
   * @type {{
      "solenoid": string,
      "notificate": string,
      "notificate_on_temperature": string,
      "mock_temperature": string,
      "fake_temperature": string,
    }}
   */
  let setting;

  switch (type) {
    // Setting Change
    case 4:
      setting = payload.setting_serialized;
      myMqtt.setRequest(setting.fake_temperature, setting.solenoid);

      let solenoidTopic, solenoidMessage;
      if (parseFloat(setting.solenoid) === 1) {
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
