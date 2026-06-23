import { useVoice } from "../context/VoiceContext.jsx";

export default function FeedbackBanner() {
  const { feedback, clearFeedback } = useVoice();

  if (!feedback) return null;

  return (
    <div className={`feedback-banner ${feedback.type}`}>
      <span>{feedback.message}</span>
      <button onClick={clearFeedback} aria-label="Dismiss">
        ×
      </button>
    </div>
  );
}
