const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const { text } = require('express');
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
    socket.emit('bot_message', `Welcome! Great to have you here. My name is Ada. <br /><br />
    To place an order, <b>Select 1</b> 
   <br />To see your current order, <b> Select 97</b>. 
   <br />To see your order history, <b>Select 98</b>. 
   <br />To checkout your order, <b>Select 99</b>. 
   <br />To cancel, <b>Select 0</b>.`);

    // listen for chatMessage
    socket.on('chatMessage', message => {
        io.emit('bot_message', message);
        
    })
})

server.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
});