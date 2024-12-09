$(document).ready(function () {
  /*global io*/
  let socket = io();

  socket.on('user', data => {
      $('#num-users').text(data.currentUsers + ' users online');
      let message =
          data.username +
          (data.connected ? ' has joined the chat.' : ' has left the chat.');
      $('#messages').append($('<li>').html('<b>' + message + '</b>'));
  });

  socket.on('chat message', function(msg) {
    const chatBox = document.getElementById('messages');
    const newMessage = document.createElement('li');
    newMessage.textContent = msg;
    chatBox.appendChild(newMessage);
  
    // Automatically scroll to the bottom
    scrollToBottom();
  });
  
  
// Call scrollToBottom() after initial messages are loaded
window.onload = scrollToBottom;
  // Form submittion with new message in field with id 'm'
  $('form').submit(function () {
      let messageToSend = $('#m').val();
      //send message to server here?
      socket.emit('chat message', messageToSend);
      $('#m').val('');
      return false; // prevent form submit from refreshing page
  });
  
});