import { useEffect } from 'react';

const TTS = ({ text }) => {
  useEffect(() => {
    if (text) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  }, [text]);

  return null;
};

export default TTS;