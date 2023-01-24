require("dotenv").config();
require("./config/database");
const app = require("./app.js");
const socketIO = require("socket.io");

const server = app.listen(process.env.PORT, () =>
  console.log(`server listning at http://localhost:${8081}`)
);

// run socket on server
const io = socketIO(server, { cors: { origin: "*" } });
const connectedUsers = {};

io.of("/").on("connection", (socket) => {
  console.log("connected to client");
  socket.on("register", (userId) => {
    socket.userId = userId;
    connectedUsers[userId] = socket;
  });

  socket.on("notification", (userObject) => {
    for (const key in userObject) {
      if (key === "AGENT") {
        connectedUsers[key.userId].emit("private_notification", {
          message: "new donation Assigned",
          donationId: connectedUsers[key.donationId]
        });
      } else if (key === "DONOR") {
      } else if (key === "ADMIN") {
      }
    }
  });

  console.log(Object.keys(connectedUsers));
});
