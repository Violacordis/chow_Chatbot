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
  cors: '*',
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
const connect = middleware => (socket, next) =>
  middleware(socket.request, {}, next);
io.use(connect(sessionMiddleware));

// Run when client connects
io.on('connection', socket => {
  console.log('A new user has connected');

  // Track user device
  const userDevice = socket.request.headers['user-agent'];
  if (userDevice) {
    console.log(`user ${socket.id} connected`);
    socket.request.session.save();
  }

  //track user's current order
  let currentOrder = (socket.request.session.currentOrder = []);

  //track user's order history
  let OrderHistory = (socket.request.session.orderHistory = []);

  const botName = 'chow_ChatBot';

  // Welcome current user
  socket.emit(
    'bot_message',
    `<b>Welcome! Great to have you here. My name is ${botName}... </b><br/><br/> Select any of the options below by selecting the number attached to it.<br/><br/>
    <p>To place an order, <b>Select 1</b> </p>
   <p><br />To see your current order, <b> Select 97</b>.</p> 
   <p><br />To see your order history, <b>Select 98</b>.</p> 
   <p><br />To checkout your order, <b>Select 99</b>. </p>
   <p><br />To cancel, <b>Select 0</b>.</p>`,
  );

  // listen for chatMessage from the client
  socket.on('client_Message', message => {
    switch (message) {
      case '1':
        // Send list of menu items to client
        socket.emit(
          'bot_message',
          `<b>Here is our menu:</b> </br></br> ${menu_list
            .map(item => `<p> ${item.id}. ${item.name} - ${item.price} </p>`)
            .join('')}`,
        );
        break;
      case '91':
      case '92':
      case '93':
      case '94':
      case '95':
      case '96':
        // Check if the id of the selected item matches the user input
        const selectedMenuItem = menu_list.find(item => item.id == message);
        // Add the selected item to the current order
        currentOrder.push(selectedMenuItem);
        // emit message to inform user that the item has been added to the order
        socket.emit(
          'bot_message',
          `<b>You have successfully added ${selectedMenuItem.name} to your cart.</b> <br/><br/> <p>To place another order, <b>Select 1</b><br/> <br/>To see items in your cart,<b>Select 97</b> <br/><br/> To check your order history, <b>Select 98</b> <br/><br/> To checkout order, <b>Select 99</b><br/><br/> To cancel order, <b>Select 0</b></p>`,
        );
        break;

      case '99':
        // checkout order
        //calculate total price of order
        const totalPrice = currentOrder.reduce(
          (acc, item) => acc + item.price,
          0,
        );

        currentOrder.length === 0
          ? socket.emit(
              'bot_message',
              `<b>Your cart is empty.</b> <br/><br/> To place an order, <b>Select 1</b>`,
            )
          : socket.emit(
              'bot_message',
              `<b>Order Checkout<b/>: <br><br/>Your total is ${totalPrice}. <br/><br/> <p>To place another order, <b>Select 1</b><br/> <br/>To see items in your cart,<b>Select 97</b> <br/><br/> To check your order history, <b>Select 98</b> <br/><br/> To checkout order, <b>Select 99</b></p>`,
            );

        //add current order to order history
        OrderHistory.push(...currentOrder);

        //clear current order
        currentOrder = [];
        break;

      case '98':
        // show order history
        let orderHistory = OrderHistory.map(
          item => `<p>${item.name} - ${item.price}</p>`,
        ).join('');
        orderHistory =
          orderHistory.length === 0
            ? socket.emit(
                'bot_message',
                `<b>You have no order history.</b> <br/><br/> To place an order, <b>Select 1</b>`,
              )
            : socket.emit(
                'bot_message',
                `<b>Order History<b/>: <br><br/>${orderHistory}. <br/><br/> <p>To place another order, <b>Select 1</b><br/> <br/>To see items in your cart,<b>Select 97</b> <br/><br/> To check your order history, <b>Select 98</b> <br/><br/> To checkout order, <b>Select 99</b><br/><br/> To cancel order, <b>Select 0</b></p>`,
              );
        break;

      case '97':
        // show current order
        let currentOrderList = currentOrder
          .map(item => `<p>${item.name} - ${item.price}</p>`)
          .join('');
        currentOrderList =
          currentOrderList.length === 0
            ? socket.emit(
                'bot_message',
                `<b>Your cart is empty.</b> <br/><br/> To place an order, <b>Select 1</b>`,
              )
            : socket.emit(
                'bot_message',
                `<b>Current Order<b/>: <br><br/>${currentOrderList}. <br/><br/> <p>To place another order, <b>Select 1</b><br/> <br/>To see items in your cart,<b>Select 97</b> <br/><br/> To check your order history, <b>Select 98</b> <br/><br/> To checkout order, <b>Select 99</b><br/><br/> To cancel order, <b>Select 0</b></p>`,
              );
        break;

      case '0':
        // cancel order
        if (currentOrder.length > 0) {
          //clear current order
          currentOrder = [];
          socket.emit(
            'bot_message',
            `<b>Your order has been cancelled.</b> <br/><br/> To place an order, <b>Select 1</b>`,
          );
        } else {
          socket.emit(
            'bot_message',
            `<b>You do not have any order currently.</b> <br/><br/> To place an order, <b>Select 1</b>`,
          );
        }
        break;

      default:
        socket.emit(
          'bot_message',
          `Invalid input ❌. Please try again... <br/><br/> <p>To place an order, <b>Select 1</b><br/> <br/>To see items in your cart,<b>Select 97</b> <br/><br/> To check your order history, <b>Select 98</b> <br/><br/> To checkout order, <b>Select 99</b><br/><br/> To cancel order, <b>Select 0</b></p>`,
        );
        break;
    }
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    console.log(`user ${socket.id} disconnected`);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
