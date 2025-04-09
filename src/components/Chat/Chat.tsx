import { useState, useEffect } from 'react';
import { ChatInput } from './ChatInput';
import { ActionCards } from './ActionCards';
import { Conversation } from './Conversation';
import { useAuthContext } from '../../context/AuthContext';
import useAxios from '../../hooks/useAxios';
import { API_PATHS } from '../../utils/apiPaths';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatResponse {
  response: string;
  conversation_id: string;
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const { user } = useAuthContext();
  const axios = useAxios();

  // Initialize conversation ID from URL if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlConversationId = params.get('conversation_id');
    if (urlConversationId) {
      setConversationId(urlConversationId);
      // TODO: Fetch conversation history using the conversation ID
    }
  }, []);

  // Update URL when conversation ID changes
  useEffect(() => {
    if (conversationId) {
      const url = new URL(window.location.href);
      url.searchParams.set('conversation_id', conversationId);
      window.history.pushState({}, '', url.toString());
    }
  }, [conversationId]);

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
    setError(null);

    try {
      const response = await axios.post<ChatResponse>(
        `${import.meta.env.VITE_APP_CHAT_API_URI}${API_PATHS.CHAT_GENERATE}`,
        {
          prompt: content,
          model: "llama3.2",
          max_tokens: 1000,
          temperature: 0.7,
          conversation_id: conversationId
        }
      );

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.data.response,
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      
      // Update conversation ID from response
      if (response.data.conversation_id) {
        setConversationId(response.data.conversation_id);
      }
    } catch (err) {
      setError('Failed to get response from the assistant. Please try again.');
      console.error('Chat API error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto">
      {messages.length === 0 ? (
        // Initial state
        <div className="flex-1 flex flex-col items-center justify-center space-y-8 p-4">
          <div className="text-center space-y-4">
            <img src="/echologo.svg" alt="Echo Logo" className="w-24 h-24 mx-auto border border-gray-800 bg-gray-800 p-1 rounded" />
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
          {error && (
            <div className="p-2 text-red-500 text-sm text-center">
              {error}
            </div>
          )}
          <div className="p-4 border-t">
            <ChatInput onSend={handleSendMessage} />
          </div>
        </div>
      )}
    </div>
  );
} 