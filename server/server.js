const dotenv = require("dotenv");
dotenv.config();
const chalk = require("chalk");
const express = require("express");
const app = express();
const port = 4000;
const mongoose = require("mongoose");
const codeBlockRouter = require("./routes/code-block-router.js");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");

const server = http.createServer(app);

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: ["http://localhost:3000"],
  },
});

io.on("connection", (socket) => {
  console.log(`user connected: ${socket.id}`);

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;
    console.log("newMessageReceived.chat: ", newMessageReceived.chat);

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });

  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log(chalk.bgGreen("Server log: Connected to Database"));
  })
  .catch((err) => {
    console.log(chalk.bgRed("error with connecting to DB"));
    console.log(err.response);
  });
const db = mongoose.connection;
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    credentials: true,
  })
);

app.use("/codeblock", codeBlockRouter);

// Start the server
server.listen(port, () => {
  console.log(
    chalk.bgGreen(`Server running! and listening at http://localhost:${port}`)
  );
});
