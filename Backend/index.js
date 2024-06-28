import { app, io } from "./server.js"; 
import UserRoute from "./routes/user.js";
import cors from "cors";
import GroupsRoute from "./routes/groups.js";
import ExpensesRouter from "./routes/expenses.js";
import { Groups } from "./models/groups.js";
import Message from "./models/messages.js";

app.use(
  cors({
    origin: 'http://localhost:5173', 
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true,
  })
);


app.use("/user", UserRoute);
app.use("/expenses", ExpensesRouter);
app.use("/group", GroupsRoute);

const onlineUsers = {};

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("newly-connected", async (user) => {
    console.log("Newly connected user received:", user.username);

    onlineUsers[socket.id] = user.username;
    
    try {
      const messages = await Message.find({ 'Members.username': user.username });
      if(messages.length!==0){
      socket.emit("notifications", messages); }
      for (const message of messages) {
        message.Members = message.Members.filter(member => member.username !== user.username);
        
        if (message.Members.length === 0) {
          await Message.deleteOne({ _id: message._id });
        } else {
          await message.save();
        }
      }
    } catch (error) {
      console.error("Error finding messages for user:", error);
    }
  });

  socket.on("message", async ({ room, message }) => {
    try {
      const { onlineNotInRoom, offlineUsers } = await findUsersNotInRoom(room);
      let createdMessage;
      const sanitizedMessage = JSON.parse(JSON.stringify(message));
  
      if (offlineUsers.length !== 0) {
        createdMessage = await Message.create({
          room: room,
          Expense: sanitizedMessage,
          Members: offlineUsers,
        });
        console.log("Created message:", createdMessage);
      }
      onlineNotInRoom.forEach(username => {
        const socketId = Object.keys(onlineUsers).find(key => onlineUsers[key] === username);
        if (socketId) {
                            io.to(socketId).emit("receive-message", createdMessage);
        }
      });

      socket.broadcast.to(room).emit("receive-message", createdMessage);
     
    } catch (error) {
      console.error("Error handling message:", error);
    }
  });
  socket.on("join-room", (room, username) => {
    socket.join(room);
    console.log(`User ${username} joined room ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
    delete onlineUsers[socket.id];
  });
});

const findUsersNotInRoom = async (room) => {
  try {
    const getGroup = await Groups.findOne({ GroupName: room });
    const members = getGroup.Members;
    const roomSockets = await io.in(room).fetchSockets();
    const usersInRoom = roomSockets.map(socket => onlineUsers[socket.id]);
    console.log("userinroom"+usersInRoom)
    const onlineNotInRoom = Object.values(onlineUsers)
    .filter(username => !usersInRoom.includes(username))
    .filter(username => members.some(member => member.username === username));

    const offlineUsers = members.filter(
      user =>  !onlineNotInRoom.includes(user.username)
    );

    return { onlineNotInRoom, offlineUsers };
  } catch (error) {
    console.error("Error finding users not in room:", error);
    return { onlineNotInRoom: [], offlineUsers: [] };
  }
};

