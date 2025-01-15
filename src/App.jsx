import { useState, useEffect, useRef } from "react";
import "./App.css";
import ToffyLogo from "./components/ToffyLogo";
import Spinner from "./components/Spinner";
import getEntireOutputOncePerRequest from "./handler/handleSend";
import getRuntimeResponsePerRequest from "./handler/handleSend2";

import formatCode from "./handler/handleformat"; 


const App = () => {
  const [input, setInput] = useState("");
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [, setAiResponse] = useState("");
  const chatEndRef = useRef(null); // Used to scroll to the latest message

  // Scroll to the bottom when a new message is added
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [consoleOutput]);

  // const handleSend = async () => {
  //   if (!input.trim()) return;

  //   const timestamp = new Date();
  //   const userInput = input;
  //   setConsoleOutput((prev) => [
  //     ...prev,
  //     { type: "user", text: userInput, timestamp },
  //   ]);

  //   try {
  //     setLoading(true);
  //     setInput("");

  //     const response = await fetch("http://127.0.0.1:11434/api/generate", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         model: "llama3.2",
  //         prompt: userInput,
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Error communicating with the server");
  //     }

  //     let accumulatedResponse = "";
  //     const reader = response.body.getReader();
  //     const decoder = new TextDecoder();
  //     let done = false;

  //     while (!done) {
  //       const { value, done: doneReading } = await reader.read();
  //       done = doneReading;

  //       const chunkString = decoder.decode(value, { stream: true });
  //       const lines = chunkString.split("\n");

  //       lines.forEach((line) => {
  //         if (line.trim()) {
  //           try {
  //             const parsedData = JSON.parse(line);
  //             accumulatedResponse += parsedData.response;
  //           } catch (error) {
  //             console.error("Error parsing NDJSON chunk:", error);
  //           }
  //         }
  //       });
  //     }

  //     setConsoleOutput((prev) => [
  //       ...prev,
  //       {
  //         type: "toffy",
  //         text: accumulatedResponse || "No response from the server.",
  //         timestamp: new Date(),
  //       },
  //     ]);
  //   } catch (error) {
  //     console.error("Error communicating with the server:", error);
  //     setConsoleOutput((prev) => [
  //       ...prev,
  //       {
  //         type: "error",
  //         text: "Error communicating with the server. Please try again later.",
  //         timestamp: new Date(),
  //       },
  //     ]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const getMaxLineLength = () => {
  //   const screenWidth = window.innerWidth;
  //   return screenWidth < 768 ? 60 : 120; // Shorter lines for mobile, longer for desktop
  // };

  // const handleSend = () => {
  //   handleSendFunction({ input, setInput, setConsoleOutput, setLoading });
  // };

  const handleSend = async () => {
    if (!input.trim()) return; // Ignore if input is empty
  
    const timestamp = new Date();
    const userInput = input;
  
    // Add user input to consoleOutput
    setConsoleOutput((prev) => [
      ...prev,
      { type: "user", text: userInput, timestamp },
    ]);
  
    try {
      setLoading(true);
      setInput(""); // Clear input field after submission
  
      // Check if runtime mode is enabled
      if (`${import.meta.env.VITE_APP_MODE_RUNTIME}`) {
        // Call the runtime message handler
        await getRuntimeResponsePerRequest({
          input: userInput,
          setInput,
          setConsoleOutput,
          setLoading,
        });
      } else {
        // Call the entire message handler
        await getEntireOutputOncePerRequest({
          input: userInput,
          setInput,
          setConsoleOutput,
          setLoading,
        });
      }
    } catch (error) {
      console.error("Error during message handling:", error);
      setConsoleOutput((prev) => [
        ...prev,
        {
          type: "error",
          text: "An error occurred while processing your request. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };
  


  const sortedOutput = consoleOutput.sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );

  return (
    <div className="relative flex flex-col h-screen bg-gray-900 text-white p-20 font-mono">
      {/* Background Eyes */}
      <div className="absolute opacity-30 inset-0 z-0 flex justify-center mt-20">
        <ToffyLogo />
      </div>

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto  bg-transparent p-4 rounded-md mb-4 z-10">
        {sortedOutput.map((entry, index) => (
          <div
            key={index}
            className={`mb-2 flex ${
              entry.type === "user"
                ? "justify-end text-blue-400"
                : entry.type === "error"
                ? "justify-start text-red-500"
                : "justify-start text-gray-300"
            }`}
          >
            <span className={`bg-transparent  p-2 px-4  rounded-md`}>
              <div
                className={`${entry.type === "user" ? "user-text" : "ai-text"}`}
                dangerouslySetInnerHTML={{
                  __html: formatCode(entry.text), // Use the dynamic maxLineLength
                }}
              />
            </span>
          </div>
        ))}
        {loading && (
          <div className="mb-2 text-gray-300 flex justify-start">
            <Spinner />
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input and Send Button */}
      <div className="flex z-10">
        <input
          aria-label="Type your prompt"
          className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-l-md outline-none"
          value={input}
          id="u-text"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your prompt..."
        />
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-r-md"
          onClick={handleSend}
          disabled={loading}
        >
          {loading ? "Loading..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default App;
