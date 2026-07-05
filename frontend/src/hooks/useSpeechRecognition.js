import { useState, useRef, useCallback, useEffect } from "react";

export function useSpeechRecognition() {
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  const isSupported =
    typeof window !== "undefined" &&
    !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech Recognition is not supported in this browser.");
      return;
    }

    setError(null);
    setTranscript("");
    setInterimTranscript("");

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";

      // IMPORTANT: start at event.resultIndex, not 0.
      // event.results holds ALL results from the whole session.
      // Starting at 0 would re-process old words every time a new one arrives,
      // causing the transcript to double/triple up.
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript + " ";
        } else {
          interimText += result[0].transcript;
        }
      }

      if (finalText) setTranscript((prev) => (prev + finalText).trim());
      setInterimTranscript(interimText);
    };

    recognition.onerror = (event) => {
      setError(event.error === "not-allowed"
        ? "Microphone access denied. Please allow microphone permission."
        : `Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
    setInterimTranscript("");
  }, []);

  const setManualTranscript = useCallback((text) => {
    setTranscript(text);
    setInterimTranscript("");
  }, []);

  const displayTranscript = (transcript + " " + interimTranscript).trim();

  return {
    transcript,
    interimTranscript,
    displayTranscript,
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
    setManualTranscript,
  };
}
