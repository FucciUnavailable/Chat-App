# Fucci Chat App  
Welcome to Fucci's Chat App! This app is designed with live chat functionality, private room IDs, image-sharing capabilities, and more. It incorporates a modern tech stack for efficiency and scalability.

---

## 🌟 Features  

- **Live Chats** using `socket.io`.  
- **Private Room IDs** for secure, private conversations.  
- **OAuth2 GitHub Login** with `passport`.  
- **Image and Photo Sharing** within chats.  
- **Redis Caching** for temporary chat storage (1-hour expiration).  
- **Quote API Integration** using Ninja API.  
- **Dockerized Deployment** for seamless containerized hosting.  

The app is hosted on **Render**—check it out [https://chat-app-y4bw.onrender.com](#).  

---

## 🛠️ Technologies Used  

| Technology   | Purpose                              |  
|--------------|--------------------------------------|  
| **Pug**      | Simplified HTML templating.          |  
| **CSS**      | Custom styles for all pages.         |  
| **Node.js**  | Backend runtime environment.         |  
| **Express**  | Web framework for routing and APIs.  |  
| **MongoDB**  | Database for user accounts.          |  
| **Redis**    | Temporary chat message caching.      |  
| **Socket.io**| Real-time live chat functionality.   |  
| **OAuth2**   | GitHub authentication.               |  
| **Axios**    | Fetching data from external APIs.    |  

---
## 🖼️ Screenshots

Here are some screenshots of the app in action:

![Login Page](./assets/screenshots/login-page.png)
*Login Page*

![Chat Room](./assets/screenshots/chat-room.png)
*Chat Room with Live Messages*

![Private Chat](./assets/screenshots/private-chat.png)
*Private Chat Room*
## ⚙️ Setup  

Follow these steps to run the project locally or in a containerized environment:

### Prerequisites  

Ensure the following are installed on your system:  
- [Node.js](https://nodejs.org/)  
- [Docker](https://www.docker.com/)  
- [MongoDB](https://www.mongodb.com/)  
- [Redis](https://redis.io/)  

---

### 📦 Installation  

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/FucciUnavailable/Chat-App
   cd chat-app
2. **Install Dependecies**  
   ```bash
   npm install
3. **Set Up .env File**  
   ```bash
    GITHUB_CLIENT_ID=your_client_id
    GITHUB_CLIENT_SECRET=your_client_secret
    MONGODB_URI=your_mongodb_uri
    REDIS_URL=your_redis_url
    API_KEY=your_ninja_API_key
    SESSION_SECRET=your_session_secret
4. **Run App Locally**  
   ```bash
   npm start 
## Running with Docker

1. Build the Docker image:

    ```bash
    docker build -t your-app-name .
    ```

2. Run the Docker container:

    ```bash
    docker run -p 3000:3000 your-app-name
    ```

3. Access the app:

    ```
    http://localhost:3000
    ```

## 📝 Future Enhancements

- **User Profile Pages**: Allow users to view and edit their profiles.
- **Chat History**: Implement a feature to store chat history and allow users to review past conversations.
- **Search Functionality**: Add the ability to search for messages within the chat.
- **Push Notifications**: Implement push notifications for new messages when the user is not active on the page.
- **Dark Mode**: Add a toggle to switch between dark and light themes.
- **Group Chat**: Add support for group chats where multiple users can join the same chat room.

## 🤝 Contributing

We welcome contributions! If you'd like to contribute to this project, please follow the steps below:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and write tests to cover them if necessary.
4. Submit a pull request explaining your changes.

### Guidelines

- Write clean, maintainable code.
- Follow the project's existing code style.
- If you're fixing a bug or implementing a feature, provide detailed information on what was changed and why.
- Ensure that your code passes all tests before submitting a pull request.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## Acknowledgments

- Thanks to the creators of the libraries and tools used in this app.
- Special thanks to the Ninja API for providing quotes.

## Made with ❤️

This project is made with love by Fucci. Thank you for checking it out! 😊