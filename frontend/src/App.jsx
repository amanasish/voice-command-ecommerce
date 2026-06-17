import { useState } from "react";

function App() {
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      let transcript = "";

      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript + " ";
      }

      setText(transcript);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  return (
    <div
      style={{
        padding: "40px",
        textAlign: "center",
        fontFamily: "Arial",
      }}
    >
      <h1>Speech To Text Demo</h1>

      <button
        onClick={startListening}
        style={{
          padding: "10px 20px",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        🎤 Start Listening
      </button>

      <p>
        Status: {listening ? "Listening..." : "Not Listening"}
      </p>

      <textarea
        value={text}
        readOnly
        rows="10"
        cols="60"
        placeholder="Recognized speech will appear here..."
      />
    </div>
  );
}

export default App;