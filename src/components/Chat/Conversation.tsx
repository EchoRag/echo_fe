import { useEffect, useRef } from 'react';
import { Message } from './Chat';
import ReactMarkdown from 'react-markdown';
import { useTypewriter } from '../../hooks/useTypewriter';

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
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
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
        <p className={`text-xs mt-1 ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
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
              <div className="flex space-x-2">
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