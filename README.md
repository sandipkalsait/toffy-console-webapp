# Toffy-Console webapp
## Interactive AI Chat Application

This project is an interactive chat application featuring a conversational AI assistant. The app is designed using vite JS + React and offers a visually engaging interface, complete with cursor-tracking eyes and animated UI elements.

![image](https://github.com/user-attachments/assets/5d37c1b6-41e5-4260-92f2-9d965a746bc3)


## Features

- **Dynamic Chat Interface**: Users can interact with the AI in a real-time chat environment.
- **Cursor Tracking Eyes**: Fun and interactive eyes that follow the user's cursor on the screen.
- **Error Handling**: Provides clear feedback when there are issues communicating with the server.
- **Loading Indicators**: Displays a spinner animation while waiting for the server response.
- **Input Formatting**: Supports code blocks, lists, and other text formatting in the chat display.

## Technologies Used

- **React**: For building the UI components.
- **CSS**: For custom styling and animations.
- **Node.js Backend **: Handles API requests and responses.
- **Fetch API**: For making asynchronous HTTP requests to the server.
- **JSON Streaming**: Processes server responses in chunks for smoother interaction.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 16 or above.
- **npm**: Version 7 or above.

### Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/sandipkalsait/toffy-console-webapp.git
   ```

2. Navigate to the project directory:

   ```bash
   cd toffy-console-webapp
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000` to use the app.

## Usage

1. Type a prompt in the input field.
2. Press the "Send" button or hit "Enter" to submit the prompt.
3. Wait for the AI response to appear in the chat window.
4. Enjoy the interactive experience with the cursor-tracking eyes!

## Configuration

- Update the API endpoint in the `fetch` call within `App.jsx` if your backend server is hosted on a different URL.

## Contributing

1. Fork the repository.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your commit message here"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Submit a pull request.

## License

This project is licensed under the MIT License.
