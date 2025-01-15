const formatCode = (text, maxLineLength = 120) => {
    // Helper function to split long sentences into multiple lines
    const splitLongLines = (text) => {
      const words = text.split(" ");
      let currentLine = "";
      const lines = [];

      words.forEach((word) => {
        // If adding this word exceeds the maxLineLength, start a new line
        if (currentLine.length + word.length + 1 > maxLineLength) {
          lines.push(currentLine.trim());
          currentLine = word;
        } else {
          currentLine += " " + word;
        }
      });

      // Push the last line if there's any remaining text
      if (currentLine) {
        lines.push(currentLine.trim());
      }

      return lines.join("\n");
    };

    // Split long sentences into multiple lines based on the maxLineLength
    text = text
      .split("\n")
      .map((line) => splitLongLines(line))
      .join("\n");

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

export default formatCode;
