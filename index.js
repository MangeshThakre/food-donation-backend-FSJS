require("dotenv").config();
require("./config/database");
const app = require("./app.js");
const socketIO = require("socket.io");
const socketCallback = require("./socket/socket.js");

const server = app.listen(process.env.PORT, () =>
  console.log(`server listning at http://localhost:${8081}`)
);

// run socket on server
const io = socketIO(server, { cors: { origin: "*" } });

const connectedUsers = {};
io.on("connection", (socket) => {
  socketCallback(connectedUsers, socket);
});
