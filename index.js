require("dotenv").config();
require("./config/database");
const app = require("./app.js");
// const socketIO = require("socket.io");
// const socketCallback = require("./socket/socket.js");

const server = app.listen(process.env.PORT, () =>
  console.log(`server listning at http://localhost:${8081}`)
);

// serverless not support socket.io install socket.io befor running on server like aws ec2
// run socket on server

// "socket.io": "^4.5.4",
// const io = socketIO(server, { cors: { origin: "*" } });
// const connectedUsers = {};
// io.on("connection", (socket) => {
//   socketCallback(connectedUsers, socket);
// });
