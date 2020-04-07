const Pusher = require("pusher-js");
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
  get("");
  pusher = new Pusher("08bc04087062ea175b28f2eba6f03552", pusherSetting);
  userChannel = pusher.subscribe(`private-notification.${user ? user.id : ""}`);
  console.log(`subscribing channel:`, userChannel.name);
}
