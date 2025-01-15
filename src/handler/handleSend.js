const handleSend = async ({
  input,
  setInput,
  setConsoleOutput,
  setLoading,
}) => {
  if (!input.trim()) return;

  const timestamp = new Date();
  const userInput = input;

  // Add user input to consoleOutput
  setConsoleOutput((prev) => [
    ...prev,
    { type: "user", text: userInput, timestamp },
  ]);

  try {
    setLoading(true);
    setInput("");

    // Send a POST request to the API
    const response = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3.2", // The model used in the request
        prompt: userInput, // The user's input
      }),
    });

    if (!response.ok) {
      throw new Error("Error communicating with the server");
    }

    let accumulatedResponse = "";
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done = false;

    // Process the response stream and accumulate the response
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

    // Add the response to the consoleOutput
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

export default handleSend;
