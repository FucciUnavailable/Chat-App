"use strict";
require("dotenv").config();
const express = require("express");
const myDB = require("./connection");
const session = require("express-session");
const passport = require("passport");
const routes = require("./routes.js");
const auth = require("./auth.js");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const passportSocketIo = require("passport.socketio");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo")(session);
const URI = process.env.MONGO_URI;
const store = new MongoStore({ url: URI });
const GitHubStrategy = require("passport-github").Strategy;
const { redisClient, getMessagesFromCache, connectRedis } = require("./redis");
const { SocketAddress } = require("net");
const { timeStamp } = require("console");
const flash = require('connect-flash');



app.set("view engine", "pug");
app.set("views", "./views/pug");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: store,
    cookie: { secure: false },
    key: "express.sid",
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Serve static files from the public directory
app.use(express.static("public"));
app.use("/public", express.static(process.cwd() + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

io.use(
  passportSocketIo.authorize({
    cookieParser: cookieParser,
    key: "express.sid",
    secret: process.env.SESSION_SECRET,
    store: store,
    success: onAuthorizeSuccess,
    fail: onAuthorizeFail,
  })
);

function onAuthorizeSuccess(data, accept) {
  console.log("successful connection to socket.io");

  accept(null, true);
}

function onAuthorizeFail(data, message, error, accept) {
  if (error) throw new Error(message);
  console.log("failed connection to socket.io:", message);
  accept(null, false);
}
myDB(async (client) => {
  const myDataBase = await client.db("database").collection("users");

  routes(app, myDataBase);
  auth(app, myDataBase);
  connectRedis();
  
  let currentUsers = 0;
  let onlineUsers = []; // Keep track of online users

  io.on("connection", (socket) => {
    ++currentUsers;
    
   
    // Check if the user is already in the onlineUsers array
    const userExists = onlineUsers.some(
      (user) => user.username === socket.request.user.username
    );

    if (!userExists) {
      // Add the user to the onlineUsers array if they are not already there
      onlineUsers.push({
        username: socket.request.user.username,
        connected: true,
      });
    }
    io.emit("user", {
      username: socket.request.user.username,
      currentUsers,
      connected: true,
      onlineUsers: onlineUsers.map((user) => user.username), // List of usernames
    });

    redisClient
      .lRange("chat_history", 0, -1) // Fetch the entire chat history
      .then((messages) => {
        // Parse the messages since they are stored as strings in Redis
        const parsedMessages = messages.map((message) => JSON.parse(message));
        // Emit chat history to the client
        socket.emit("chat history", parsedMessages.reverse()); // Reverse for chronological order
      })
      .catch((err) => {
        console.error("Error fetching chat history from Redis:", err);
      });
    socket.on("chat message", (message) => {
      const messageData = {
        username: socket.request.user.username,
        message: message,
        avatar: socket.request.user.avatar || "default-avatar.png",
        timestamp: new Date(),
      };
      // Save the message to Redis (lPush to add it to the left of the list)
      redisClient
        .lPush("chat_history", JSON.stringify(messageData), () => {
          redis.expire("chat_history", 3600); // Expires in 1 hour
        })
        .then(() => {
          // Optionally set a TTL (Time to Live) for the chat history
          redisClient.expire("chat_history", 3600); // Expires after 1 hour
        })
        .catch((err) => {
          console.error("Error saving message to Redis:", err);
        });

      io.emit("chat message", {
        username: socket.request.user.username,
        message,
      });
    });
   
      socket.on('chat image', (data) => {
        io.emit('chat image', {img:data, messageData:  {
          username: socket.request.user.username,
          avatar: socket.request.user.avatar || "default-avatar.png",
          timestamp: new Date(),
        }} ); // Broadcast the image to all connected clients
      });
   
    socket.on("disconnect", () => {
      // Find the user in the onlineUsers array and update the status
      const userIndex = onlineUsers.findIndex(
        (user) => user.username === socket.request.user.username
      );
      if (userIndex !== -1) {
        onlineUsers[userIndex].connected = false; // Mark the user as disconnected
      }
      console.log("A user has disconnected");
      --currentUsers;
      io.emit("user", {
        username: socket.request.user.username,
        currentUsers,
        connected: true,
        onlineUsers: onlineUsers.map((user) => user.username), // Updated list of users
      });
    });
  });
}).catch((e) => {
  app.route("/").get((req, res) => {
    res.render("index", { title: e, message: "Unable to connect to database" });
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
