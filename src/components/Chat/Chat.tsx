import { useState } from 'react';
import { ChatInput } from './ChatInput';
import { ActionCards } from './ActionCards';
import { Conversation } from './Conversation';
import { useAuthContext } from '../../context/AuthContext';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthContext();

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);

    // TODO: Implement actual AI response logic
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'This is a mock response. Implement actual AI response here.',
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto">
      {messages.length === 0 ? (
        // Initial state
        <div className="flex-1 flex flex-col items-center justify-center space-y-8 p-4">
          <div className="text-center space-y-4">
            <img src="/echologo.svg" alt="Echo Logo" className="w-24 h-24 mx-auto" />
            <h1 className="text-4xl font-bold text-gray-800">Hi, {user?.name || 'Guest'}</h1>
            <p className="text-xl text-gray-600">Can I help you with anything?</p>
            <p className="text-sm text-gray-500">
              Ready to Assist you with anything you need, from answering questions to providing recommendations. Let's get started!
            </p>
          </div>
          <ActionCards />
          <div className="w-full max-w-2xl">
            <ChatInput onSend={handleSendMessage} />
          </div>
        </div>
      ) : (
        // Conversation state
        <div className="flex-1 flex flex-col">
          <Conversation messages={messages} isLoading={isLoading} />
          <div className="p-4 border-t">
            <ChatInput onSend={handleSendMessage} />
          </div>
        </div>
      )}
    </div>
  );
} 