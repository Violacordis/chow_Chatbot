const socket = io();

// Message from server
socket.on('message', message => {
    console.log(message);
})
