import formatCode2 from "./handleformat2";

const handleSend2 = async ({
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
      const response = await fetch(
        `${import.meta.env.VITE_APP_SERVER_URL}/api/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: `${import.meta.env.VITE_APP_MODEL_NAME}`,
            prompt: userInput,
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error("Error communicating with the server");
      }
  
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulatedResponse = "";
  
      // Display response chunks incrementally
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
  
        if (value) {
          const chunkString = decoder.decode(value, { stream: true });
          const lines = chunkString.split("\n");
  
          lines.forEach((line) => {
            if (line.trim()) {
              try {
                const parsedData = JSON.parse(line);
                const rawChunk = parsedData.response;
                accumulatedResponse += rawChunk;
  
                // Format the accumulated response using formatCode
                const formattedResponse = formatCode2(accumulatedResponse);
  
                // Update the consoleOutput with the formatted response
                setConsoleOutput((prev) => [
                  ...prev.slice(0, prev.length - 1), // Remove the last message if partially updated
                  {
                    type: "toffy",
                    text: formattedResponse,
                    timestamp: new Date(),
                  },
                ]);
              } catch (error) {
                console.error("Error parsing NDJSON chunk:", error);
              }
            }
          });
        }
      }
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
  
  export default handleSend2;
  