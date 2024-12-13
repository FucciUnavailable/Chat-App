$(document).ready(function () {
  let socket = io();

  socket.on("user", (data) => {
    $("#num-users").text(data.currentUsers + " users online");
    let message =
      data.username +
      (data.connected ? " has joined the chat." : " has left the chat.");
    $("#messages").append($("<li>").html("<b>" + message + "</b>"));
    // Update the online users list in the sidebar
    $(".online-list ul").empty(); // Clear the existing list
    data.onlineUsers.forEach((username) => {
      let status = "green"; // Default status: green dot for connected users
      // Check if the user is disconnected
      if (!data.connected) {
        status = "gray"; // Gray dot for disconnected users
      }
      $(".online-list ul").append(
        $("<li>").html(`<span class="dot ${status}"></span>${username}`)
      );
    });
  });
  socket.on("chat history", function (messages) {
    console.log("Chat history received on client:"); // Verify this log

    // Check if messages is an array
    if (!Array.isArray(messages)) {
      console.error("Invalid chat history format:", messages);
      return;
    }

    const chatBox = document.getElementById("messages");

    messages.forEach(function (message) {
      const newMessage = document.createElement("li");
      const timestamp = message.timestamp
        ? new Date(message.timestamp).toLocaleTimeString()
        : "Unknown time";

      newMessage.innerHTML = `
        <div class="message-container">
          <img class="avatar" src="${
            message.avatar || "default-avatar.png"
          }" alt="${message.username}" />
          <div class="message-content">
            <span class="username"><b>${message.username}</b></span>
            <span class="message-text">${message.message}</span>
            <span class="timestamp">${timestamp}</span>
          </div>
        </div>
      `;
      chatBox.appendChild(newMessage);
    });

    // Scroll to the last message after appending all
    chatBox.lastElementChild?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  });

  socket.on("chat message", function (data) {
    console.log(data);
    const chatBox = document.getElementById("messages");
    const newMessage = document.createElement("li");
    const timestamp = new Date().toLocaleTimeString();

    newMessage.innerHTML = `
      <div class="message-container">
        <img class="avatar" src="${data.avatar || "default-avatar.png"}" alt="${
      data.username
    }" />
        <div class="message-content">
          <span class="username"><b>${data.username}</b></span>
          <span class="message-text">${data.message}</span>
          <span class="timestamp">${timestamp}</span>
        </div>
      </div>
    `;

    chatBox.appendChild(newMessage);
    newMessage.scrollIntoView({ behavior: "smooth", block: "end" });
  });

  function scrollToBottom() {
    const chatBox = document.getElementById("messages");
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  $("form").submit(function () {
    let messageToSend = $("#m").val();
    socket.emit("chat message", messageToSend);
    $("#m").val("");
    return false;
  });

  window.onload = scrollToBottom;
});
