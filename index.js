// modules
const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const cors = require("cors");
const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketio(server);
const { userJoin, getRoomUsers,getCurrentUser, userLeaveRoom } = require("./utils/users");
const { formatMessage } = require("./utils/messages");

app.get("/", (req, res) => {
    res.send("Welcome to Baat-Cheet")
})

const boatName = "Masai Server";
io.on("connection", (socket) => {
    console.log("One client joined the server")

    socket.on("joinRoom", ({ userName, room }) => {
        const user = userJoin(socket.id, userName, room);

        socket.join(user.room)

        // welcome message to current user
        socket.emit("message", formatMessage(boatName, "Welcome to Charcha"));

        // broadcast to other users
        socket.broadcast.to(user.room).emit("message", formatMessage(boatName, `${user.userName} has joined the room`))

        // get all users in the room
        io.to(user.room).emit("roomUsers", {
            room: user.room, users: getRoomUsers(user.room)
        })
    })

    socket.on("chatMessage", (msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit("message", formatMessage(user.userName, msg));
    })

    socket.on("disconnect", () => {
        const user = userLeaveRoom(socket.id);
        io.to(user.room).emit("message", formatMessage(boatName, `${user.userName} has left the chat`));
    });
})




const port = 8080;
server.listen(port, () => {
    console.log(`server listening on ${port}`);
})