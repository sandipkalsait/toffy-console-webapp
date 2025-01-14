import { useState, useEffect, useRef } from "react";
import "./App.css";
import CursorTrackingEyes from "./components/CursorTrackingEyes.jsx";

const Spinner = () => (
  <div className="flex mt-4">
    <div className="custom-pulse">
      <div className="custom-pulser"></div>
    </div>
  </div>
);

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

  const handleSend = async () => {
    if (!input.trim()) return;

    const timestamp = new Date();
    const userInput = input;
    setConsoleOutput((prev) => [
      ...prev,
      { type: "user", text: userInput, timestamp },
    ]);

    try {
      setLoading(true);
      setInput("");

      const response = await fetch("http://127.0.0.1:11434/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3.2",
          prompt: userInput,
        }),
      });

      if (!response.ok) {
        throw new Error("Error communicating with the server");
      }

      let accumulatedResponse = "";
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;

        const chunkString = decoder.decode(value, { stream: true });
        const lines = chunkString.split("\n");

        lines.forEach((line) => {
          if (line.trim()) {
            try {
              const parsedData = JSON.parse(line);
              accumulatedResponse += parsedData.response;
            } catch (error) {
              console.error("Error parsing NDJSON chunk:", error);
            }
          }
        });
      }

      setConsoleOutput((prev) => [
        ...prev,
        {
          type: "toffy",
          text: accumulatedResponse || "No response from the server.",
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error communicating with the server:", error);
      setConsoleOutput((prev) => [
        ...prev,
        {
          type: "error",
          text: "Error communicating with the server. Please try again later.",
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

  const formatCode = (text, maxLineLength = 120) => {
    // Helper function to split long sentences into multiple lines
    const splitLongLines = (text) => {
      const words = text.split(' ');
      let currentLine = '';
      const lines = [];
  
      words.forEach(word => {
        // If adding this word exceeds the maxLineLength, start a new line
        if (currentLine.length + word.length + 1 > maxLineLength) {
          lines.push(currentLine.trim());
          currentLine = word;
        } else {
          currentLine += ' ' + word;
        }
      });
  
      // Push the last line if there's any remaining text
      if (currentLine) {
        lines.push(currentLine.trim());
      }
  
      return lines.join('\n');
    };
  
    // Split long sentences into multiple lines based on the maxLineLength
    text = text.split('\n').map(line => splitLongLines(line)).join('\n');
  
    // Bold text (surrounded by ** or __)
    text = text.replace(/(\*\*|__)(.*?)\1/g, "<strong>$2</strong>");
  
    // Italic text (surrounded by * or _)
    text = text.replace(/(\*|_)(.*?)\1/g, "<em>$2</em>");
  
    // Strikethrough text (surrounded by ~~)
    text = text.replace(/~~(.*?)~~/g, "<del>$1</del>");
  
    // Unordered List (starting with *, -, or +)
    text = text.replace(/^[\\*\-\\+]\s(.*)$/gm, (match, item) => {
      return `<ul><li>${item}</li></ul>`;
    });
  
    // Ordered List (starting with number and dot)
    text = text.replace(/^(\d+)\.\s(.*)$/gm, (match, num, item) => {
      return `<ol><li>${item}</li></ol>`;
    });
  
    // Links (handles square brackets and parentheses properly)
    text = text.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/g,
      '<a href="$2" target="_blank">$1</a>'
    );
  
    // Format paragraph breaks (wrap each line in <p> tags)
    text = text.replace(/([^\n]+)/g, "<p>$1</p>");
  
    // Code blocks (surrounded by triple backticks)
    text = text.replace(/```([\s\S]*?)```/g, (match, code) => {
      return `<pre><code class="language-javascript">${code}</code></pre>`;
    });
  
    // Escape HTML special characters for inline code
    text = text.replace(/`([^`]+)`/g, "<code>$1</code>");
  
    // Return the formatted text
    return text;
  };
  

  return (
    <div className="relative flex flex-col h-screen bg-gray-900 text-white p-10 font-mono">
      {/* Background Eyes */}
      <div className="absolute opacity-30 inset-0 z-0 flex justify-center mt-20">
        <div className="relative w-40 h-40 bg-blue-400 rounded-2xl border-4 border-black flex items-center justify-center">
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="w-full h-4 bg-black"></div>
            <div className="absolute h-full w-4 bg-black"></div>
          </div>

          <div className="relative w-20 h-20 bg-white rounded-full flex items-center justify-center">
            <CursorTrackingEyes />
          </div>
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto bg-transparent p-4 rounded-md mb-4 z-10">
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
            <span className={`bg-transparent p-2 rounded-md`}>
              <div
                className={`${entry.type === "user" ? "user-text" : "ai-text"}`}
                dangerouslySetInnerHTML={{
                  __html: formatCode(entry.text), // Inject the formatted text as HTML
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
