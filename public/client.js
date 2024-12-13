$(document).ready(function () {
    /*global io*/
    let socket = io();
  



   // Listen for chat history (messages) from the server
   socket.on('chat history', function (messages) {
    // Render each message in the chat history
    messages.forEach(function (message) {
        const chatBox = document.getElementById('messages');
        const newMessage = document.createElement('li');
        
        // Create a timestamp for each message
        const timestamp = new Date().toLocaleTimeString();

        // Format the message with some CSS classes for style, including avatars
        newMessage.innerHTML = `
          <div class="message-container">
            <img class="avatar" src="${message.avatar || 'default-avatar.png'}" alt="${message.username}" />
            <div class="message-content">
              <span class="username"><b>${message.username}</b></span>
              <span class="message-text">${message.message}</span>
              <span class="timestamp">${timestamp}</span>
            </div>
          </div>
        `;

        // Append the new message to the chat
        chatBox.appendChild(newMessage);
    });

    // Scroll to the bottom of the chat
    scrollToBottom();
});



    // Listening for user join/leave events
    socket.on('user', data => {
      $('#num-users').text(data.currentUsers + ' users online');
      let message =
          data.username +
          (data.connected ? ' has joined the chat.' : ' has left the chat.');
      $('#messages').append($('<li>').html('<b>' + message + '</b>'));
    });
  
    // Listening for incoming chat messages
    socket.on('chat message', function (data) {
      console.log(data); // Log message object to see its structure
      const chatBox = document.getElementById('messages');
      const newMessage = document.createElement('li');
      
      // Create a timestamp for each message
      const timestamp = new Date().toLocaleTimeString();
  
      // Format the message with some CSS classes for style, including avatars
      newMessage.innerHTML = `
        <div class="message-container">
          <img class="avatar" src="${data.avatar || 'default-avatar.png'}" alt="${data.username}" />
          <div class="message-content">
            <span class="username"><b>${data.username}</b></span>
            <span class="message-text">${data.message}</span>
            <span class="timestamp">${timestamp}</span>
          </div>
        </div>
      `;
  
      // Append the new message to the chat
      chatBox.appendChild(newMessage);
  
      // Automatically scroll to the bottom of the chat container
      newMessage.scrollIntoView({ behavior: 'smooth', block: 'end' });
  });
  
  
    // Function to automatically scroll to the bottom of the chat container
    function scrollToBottom() {
        const chatBox = document.getElementById('messages');
        chatBox.scrollTop = chatBox.scrollHeight;
    }
  
    // Form submission to send a new message
    $('form').submit(function () {
        let messageToSend = $('#m').val();
        socket.emit('chat message', messageToSend);  // Emit message to the server
        $('#m').val('');  // Clear the input field
        return false;  // Prevent the form from refreshing the page
    });
  
    // Call scrollToBottom() after initial messages are loaded
    window.onload = scrollToBottom;
});
