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

  const botName = "chow_ChatBot";
  let switchExecuted = false;

    // Welcome current user
    socket.emit('bot_message', `Welcome! Great to have you here. My name is ${botName}... <br/><br/> Select any of the options below by selecting the number attached to it.<br/><br/>
    To place an order, <b>Select 1</b> 
   <br />To see your current order, <b> Select 97</b>. 
   <br />To see your order history, <b>Select 98</b>. 
   <br />To checkout your order, <b>Select 99</b>. 
   <br />To cancel, <b>Select 0</b>.`);

    // listen for chatMessage from the client
    socket.on('client_Message', message => {
        
        switch (message) {
            case "1":
                // Send list of menu items to client
                socket.emit('bot_message', `Here is our menu: </br></br> ${menu_list.map((item) => `<p> ${item.id}. ${item.name} - ${item.price} </p>`).join('')}`);
                break;
            case "91":
            case "92":
            case "93":
            case "94":
            case "95":
            case "96":
                // Check if the id of the selected item matches the user input
                const selectedMenuItem = menu_list.find((item) => item.id == message);
                // Add the selected item to the current order
                currentOrder.push(selectedMenuItem);
                // emit message to inform user that the item has been added to the order
                socket.emit('bot_message', `You have successfully added ${selectedMenuItem.name} to your cart. <br/><br/> To place another order, <b>Select 1</b> <br/>To see items in your cart,<b>Select 97</b> <br/> To checkout order, <b>Select 99</b>`);
                break;
                
            case "99":
                // checkout order
                if(currentOrder.length === 0) {
                    socket.emit('bot_message', `Your cart is empty. <br/><br/> To place an order, <b>Select 1</b>`);
                }
                //calculate total price of order
                const totalPrice = currentOrder.reduce((acc, item) => acc + item.price, 0);
                //emit message to client with total price

                socket.emit('bot_message', `<b>Order Checkout<b/>: <br><br/>Your total is ${totalPrice}. <br/><br/> To place another order, <b>Select 1</b> <br/>To see items in your cart,<b>Select 97</b> <br/> To checkout order, <b>Select 99</b>`);

                //add current order to order history
                orderHistory.push(...currentOrder);

                //clear current order
                currentOrder = [];
                break;


        }
        
    })
})

server.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
});