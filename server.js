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
app.use(express.static(path.join(__dirname, 'public')));

// Run when client connects
io.on('connection', socket => {
    // Welcome current user
    socket.emit('message', 'Welcome! Great to have you here. My name is ChatBot. I am here to help you.\nBelow are the options to select from:\n\nSelect 1 to place an order\nSelect 99 to checkout order\nSelect 98 to see order history\nSelect 97 to see current order\nSelect 0 to cancel order');

    // listen for chatMessage
    socket.on('chatMessage', text => {
        io.emit('message', text);
    })
})

server.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
});