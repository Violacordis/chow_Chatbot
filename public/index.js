const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

const socket = io();

// Message from server
socket.on('message', message => {
    outputMessage(message);

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

// Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get text from input using the id of the input field (msg)
    let text = e.target.elements.msg.value;
    
    // Emit message to server
    socket.emit('chatMessage', text);

    // clear text input field after message is sent
    e.target.elements.msg.value = '';

    // Focus on text input field after message is sent and the field cleared
    e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="text"> ${message} </p>`;
    document.querySelector('.chat-messages').appendChild(div);
  }