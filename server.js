const express = require('express');
const path = require('path');
const http = require('http');
const session = require('express-session');
const socketio = require('socket.io');
const menu_list = require('./menu.json');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: "*"
});

const PORT = process.env.PORT;

// Set session middleware
const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  });
app.use(sessionMiddleware);

// Setting up static files
app.use(express.static(path.join(__dirname, 'public')));

// convert express middleware to socket.io middleware
const connect = (middleware) => (socket, next) => middleware(socket.request, {}, next);
io.use(connect(sessionMiddleware));

// Run when client connects
io.on('connection', socket => {
    console.log("A new user has connected");

     // Track user device
    const userDevice = socket.request.headers["user-agent"];
    if (userDevice) {
        console.log(`user ${socket.id} connected`);
        socket.request.session.save();
    }

    //track user's current order
  let currentOrder = (socket.request.session.currentOrder = []);

  //track user's order history
  let orderHistory = (socket.request.session.orderHistory = []);

  const botName = "chow_ChatBot"

    // Welcome current user
    socket.emit('bot_message', `Welcome! Great to have you here. My name is ${botName}... <br/><br/> Select any of the options below by selecting the number attached to it.<br/><br/>
    To place an order, <b>Select 1</b> 
   <br />To see your current order, <b> Select 97</b>. 
   <br />To see your order history, <b>Select 98</b>. 
   <br />To checkout your order, <b>Select 99</b>. 
   <br />To cancel, <b>Select 0</b>.`);

    // listen for chatMessage from the client
    socket.on('client_Message', message => {
        io.emit('bot_message', message);
        
    })
})

server.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
});