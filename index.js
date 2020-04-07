const mqtt = require("./mqtt");
const websocket = require("./websocket");

mqtt.run(websocket.run);
