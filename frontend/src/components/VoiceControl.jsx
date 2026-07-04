import { useState } from "react";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition.js";
import { useVoice } from "../context/VoiceContext.jsx";

export default function VoiceControl() {
  const {
    displayTranscript,
    isListening,
    isSupported,
    error: speechError,
    startListening,
    stopListening,
    transcript,
    interimTranscript,
    setManualTranscript,
  } = useSpeechRecognition();

  const { lastIntent, processing, processTranscript } = useVoice();
  const [manualInput, setManualInput] = useState("");

  const handleProcess = async () => {
    const text = transcript || manualInput || displayTranscript;
    await processTranscript(text);
  };

  const handleToggleMic = async () => {
    if (isListening) {
      const text = (transcript + " " + interimTranscript).trim();
      stopListening();
      if (text) {
        await processTranscript(text);
      }
    } else {
      startListening();
    }
  };

  if (!isSupported) {
    return (
      <div className="voice-control unsupported">
        <p>Speech Recognition is not supported in this browser. Use Chrome or Edge.</p>
        <div className="manual-input">
          <input
            type="text"
            placeholder='Type a command, e.g. "show blue shirts under 1000"'
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
          />
          <button onClick={() => processTranscript(manualInput)} disabled={processing}>
            Process
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="voice-control">
      <div className="mic-row">
        <button
          className={`mic-btn ${isListening ? "listening" : ""}`}
          onClick={handleToggleMic}
          aria-label={isListening ? "Stop listening" : "Start listening"}
        >
          {isListening ? "Stop" : "Start"} Listening
        </button>
        <button
          className="process-btn"
          onClick={handleProcess}
          disabled={processing || (!displayTranscript && !manualInput)}
        >
          {processing ? "Processing..." : "Process Command"}
        </button>
      </div>

      {/* Fallback parser warning */}
      {lastIntent?._fallback && (
        <p className="parser-fallback-warning">
          {lastIntent._fallback === "offline"
            ? "⚠️ Backend unreachable — using basic (offline) parser"
            : "⚠️ Groq AI unavailable — using basic parser"}
        </p>
      )}

      <p className="status">
        Status: <strong>{isListening ? "Listening..." : "Not listening"}</strong>
      </p>

      {speechError && <p className="feedback error">{speechError}</p>}

      <div className="transcript-box">
        <label>Transcript</label>
        <textarea
          readOnly={isListening}
          value={displayTranscript || manualInput}
          onChange={(e) => {
            setManualInput(e.target.value);
            setManualTranscript(e.target.value);
          }}
          rows={3}
          placeholder="Recognized speech will appear here..."
        />
      </div>

      {lastIntent && (
        <div className="intent-preview">
          <label>Parsed Intent</label>
          <pre>{JSON.stringify(lastIntent, null, 2)}</pre>
        </div>
      )}

      <div className="voice-hints">
        <p>
          Try: &quot;show me blue shirts&quot; · &quot;add product p101 to cart&quot; ·
          &quot;show my cart&quot; · &quot;checkout&quot; · &quot;party wear kurtas under 500&quot;
        </p>
      </div>
    </div>
  );
}
