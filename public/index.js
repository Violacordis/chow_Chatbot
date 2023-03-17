const chatForm = document.getElementById('chat-form');
const msgInput = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const endChat = document.getElementById('endChat-btn');

const socket = io();

// Message from server
socket.on('bot_message', message => {
    outputMessage(message);
  // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

// Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Get text from input using the id of the input field (msg)
    let msg = e.target.elements.msg.value;
    let message = msg.trim();
    if (!message) {
        return false;
    }  
    outputMessage(message);
    // Emit message to server
    socket.emit('client_Message', message);
     // clear text input field after message is sent
    e.target.elements.msg.value = '';
    // Focus on text input field after message is sent and the field cleared
    e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
    <p class=".message"> ${message} </p>`;
    document.querySelector('.chat-messages').appendChild(div);
  }

  // end chat
  endChat.addEventListener('click', () => {
    window.location = '/index.html';
  });