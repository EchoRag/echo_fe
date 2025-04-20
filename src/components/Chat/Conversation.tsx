import { useEffect, useRef, useState } from 'react';
import { Message } from './Chat';
import ReactMarkdown from 'react-markdown';
import { useTypewriter } from '../../hooks/useTypewriter';
import useAxios from '../../hooks/useAxios';
import { API_PATHS } from '../../utils/apiPaths';

interface ConversationProps {
  messages: Message[];
  isLoading: boolean;
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.sender === 'user';
  const { displayedText } = useTypewriter({
    text: message.content,
    enabled: !isUser,
    speed: 20,
  });
  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(null);
  const axios = useAxios();
  
  const handleFeedback = async (type: 'like' | 'dislike') => {
    if (!message.assistant_message_id) return;
    
    try {
      await axios.post(`${import.meta.env.VITE_APP_CHAT_API_URI}${API_PATHS.MESSAGE_VOTE(message.assistant_message_id)}`, {
        vote_type: type
      });
      setFeedback(type);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      // Optionally show an error message to the user
    }
  };
  
  return (
    <div data-testid="message-bubble" className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[70%] px-4 py-2 rounded-lg ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-100 text-gray-900 rounded-bl-none'
        }`}
      >
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="text-sm mb-2">{children}</p>,
              ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
              li: ({ children }) => <li className="text-sm mb-1">{children}</li>,
              strong: ({ children }) => (
                <strong className={`font-semibold ${isUser ? 'text-blue-100' : 'text-gray-900'}`}>
                  {children}
                </strong>
              ),
              em: ({ children }) => (
                <em className={`italic ${isUser ? 'text-blue-100' : 'text-gray-900'}`}>
                  {children}
                </em>
              ),
              code: ({ children }) => (
                <code className="bg-gray-200 dark:bg-gray-800 rounded px-1 py-0.5 text-xs">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="bg-gray-200 dark:bg-gray-800 rounded p-2 overflow-x-auto text-xs">
                  {children}
                </pre>
              ),
            }}
          >
            {isUser ? message.content : displayedText}
          </ReactMarkdown>
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className={`text-xs ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
          {!isUser && message.assistant_message_id && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleFeedback('like')}
                className={`p-1 rounded-full hover:bg-gray-200 transition-colors ${
                  feedback === 'like' ? 'text-green-500' : 'text-gray-500'
                }`}
                disabled={feedback !== null}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
              </button>
              <button
                onClick={() => handleFeedback('dislike')}
                className={`p-1 rounded-full hover:bg-gray-200 transition-colors ${
                  feedback === 'dislike' ? 'text-red-500' : 'text-gray-500'
                }`}
                disabled={feedback !== null}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Conversation({ messages, isLoading }: ConversationProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="max-w-3xl mx-auto">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-100 rounded-lg p-4 max-w-[70%]">
              <div data-testid="loading-indicator" className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
} 