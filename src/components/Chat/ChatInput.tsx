import { useState, KeyboardEvent, ChangeEvent, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
}

export function ChatInput({ onSend }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 180); // 180px is roughly 6 rows
      textarea.style.height = `${Math.max(48, newHeight)}px`; // 48px is roughly 1 row
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [message]);

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  return (
    <div className="relative flex items-end">
      <textarea
        ref={textareaRef}
        value={message}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        placeholder="Ask echo anything.... (Shift + Enter for new line)"
        className="w-full px-4 py-3 pr-12 text-gray-900 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[48px] max-h-[120px] overflow-y-auto"
        rows={1}
      />
      <button
        onClick={handleSend}
        className="absolute right-2 bottom-1 p-2 rounded-lg border border-black bg-transparent hover:bg-gray-100 transition-colors"
      >
        <svg
          className="w-6 h-6 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 5l7 7-7 7M5 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
} 