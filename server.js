const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT;

// Setting up static files
app.use(express.static(path.join(__dirname, 'public')))

// Run when client connects
io.on('connection', socket => {
    // Welcome current user
    socket.emit('message', 'Welcome! Great to have you here. My name is ChatBot. I am here to help you. \n Select 1 to Place an order \n Select 99 to checkout order \n Select 98 to see order history \n Select 97 to see current order \n Select 0 to cancel order');
})

server.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
});