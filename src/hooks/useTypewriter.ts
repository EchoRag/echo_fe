import { useState, useEffect } from 'react';

interface UseTypewriterProps {
  text: string;
  speed?: number;
  enabled?: boolean;
}

export function useTypewriter({ text, speed = 30, enabled = true }: UseTypewriterProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setDisplayedText(text);
      setIsTypingComplete(true);
      return;
    }

    setDisplayedText('');
    setIsTypingComplete(false);
    let currentIndex = 0;

    const intervalId = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(prev => prev + (text[currentIndex] || ""));
        currentIndex++;
      } else {
        setIsTypingComplete(true);
        clearInterval(intervalId);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed, enabled]);

  return { displayedText, isTypingComplete };
} 