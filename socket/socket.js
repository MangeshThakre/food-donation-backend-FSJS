const notificationModel = require("../model/notificationModel.js");

function socketCallback(connectedUsers, socket) {
  console.log("connected to client");
  socket.on("register", (user) => {
    socket.userId = user.id;
    socket.userRole = user.role;
    socket.userName = user.name;
    socket.userEmail = user.email;
    connectedUsers[user.id] = socket;
  });

  socket.on("notification", (notificationDataArr, CB) => {
    for (const notificationData of notificationDataArr) {
      const socketInstance = getSocketInstance(
        connectedUsers,
        notificationData.role
      );
      handleUserNotification(notificationData, socketInstance, CB);
    }
  });

  socket.on("disconnect", function () {
    // loop over the object and check  disconnected soket is presient or not
    // if present then delete the object property who matches the socket.id
    // only online users should be present in connectedUsers object
    for (const socketInstanceKey in connectedUsers) {
      if (connectedUsers[socketInstanceKey].id === socket.id) {
        delete connectedUsers[socketInstanceKey];
      }
    }
  });

  console.log(Object.keys(connectedUsers));
}

async function handleUserNotification(notificationData, socketInstance, CB) {
  try {
    const notificationInfo = new notificationModel(notificationData);
    await notificationInfo.save();
    socketInstance.emit("private_notification", notificationData);
  } catch (error) {
    CB({ success: false, message: error.message });
  }
}

function getSocketInstance(connectedUsers, role, id = "") {
  if (role === "ADMIN") {
    for (const socketInstance in connectedUsers) {
      if (socketInstance.userRole === "ADMIN") {
        return socketInstance;
      }
    }
  }
  return connectedUsers[id];
}

module.exports = socketCallback;

//  connectedUsers =[
//     { userRole : "",  userName :"", userEmail:"" , userid:"" , ...socket  }, (socketInstance  with user basic detail)
//     { userRole : "",  userName :"", userEmail:"" , userid:"" , ...socket  }, (socketInstance  with user basic detail)
//     { userRole : "",  userName :"", userEmail:"" , userid:"" , ...socket  }, (socketInstance  with user basic detail)
//     { userRole : "",  userName :"", userEmail:"" , userid:"" , ...socket  }, (socketInstance  with user basic detail)
//   {.....} ,
//   {.....} ,
//   {......}
// ]

// userObject =[
//
// {
// agentName: "",
// donorName: "",
// donationId: "",
// donationStatus: ""
// role : "AGENT"
// donationStatus:""
// },
//
// {
// donorId: "", // send notification to this user
// agentName: "",
// donationId: "",
// donationStatus: ""
// role : "DONOR"
// donationStatus:""
// },
//
//  {
// agentId: "", // send notification to this user
// agentName: "",
// donationId: "",
// donationStatus: ""
// donationStatus : ""
// role : "AGENT"
// }
//
// ]
