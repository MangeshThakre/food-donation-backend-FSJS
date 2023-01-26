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

  // loop over the norificationdataArr and send notification to the respective user given in the notificationtata (agentId or donorId),
  // if the role is ADMIN then send the data to the admin
  socket.on("notification", (notificationDataArr, CB) => {
    for (const notificationData of notificationDataArr) {
      const id = notificationData.donorId || notificationData.agentId || null;
      const socketInstance = getSocketInstance(
        connectedUsers,
        notificationData.role,
        id
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

////
async function handleUserNotification(notificationData, socketInstance, CB) {
  try {
    const notificationInfo = new notificationModel(notificationData);
    const result = await notificationInfo.save();
    if (socketInstance) {
      socketInstance.emit("private_notification", result);
    }
  } catch (error) {
    CB({ success: false, message: error.message });
  }
}

// get sockit instance  base on user id or base on role if user role is admin
function getSocketInstance(connectedUsers, role, id) {
  if (role === "ADMIN") {
    for (const socketInstancekey in connectedUsers) {
      if (connectedUsers[socketInstancekey].userRole === "ADMIN") {
        return connectedUsers[socketInstancekey];
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
