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
const path = require("path");

const server = http.createServer(app);

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    // origin: ["http://localhost:3000"], // for dev version
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`user connected: ${socket.id}`);

  socket.on("joining", (codeBlockObj) => {
    socket.broadcast.emit("user joined", codeBlockObj);
  });

  socket.on("leaving", () => {
    socket.broadcast.emit("user left");
  });

  socket.on("typing", (code) => {
    socket.broadcast.emit("new code", code);
  });
});

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log(chalk.bgGreen("Server log: Connected to Database"));
  })
  .catch((err) => {
    console.log(chalk.bgRed("error with connecting to DB"));
    console.log(err);
  });
app.use(express.json());

app.use(
  // for local dev use
  // cors({
  //   origin: "http://localhost:3000",
  //   methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
  //   credentials: true,
  // })

  // for production use
  cors({
    origin: "https://moveo-remote-sessions-task.onrender.com",
  })
);

app.use("/codeblock", codeBlockRouter);

// ---------------------Deployment---------------

const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  console.log("running profuction version");
  app.use(express.static(path.join(__dirname1, "/client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "client", "build", "index.html"));
  });
} else {
  console.log("running dev version");
  app.get("/", (req, res) => {
    res.send("API is Running Successfully");
  });
}

// ---------------------Deployment---------------

// Start the server
server.listen(port, () => {
  console.log(chalk.bgGreen(`Server running! and listening at port: ${port}`));
});
