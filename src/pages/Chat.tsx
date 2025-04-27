import { useState, useEffect } from 'react';
import { ChatInput } from '../components/Chat/ChatInput';
import { ActionCards } from '../components/Chat/ActionCards';
import { Conversation } from '../components/Chat/Conversation';
import { useAuthContext } from '../context/AuthContext';
import useAxios from '../hooks/useAxios';
import { API_PATHS } from '../utils/apiPaths';
import { faro } from '../utils/faroConfig';
import { AnimatedLogo } from '../components/AnimatedLogo';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  assistant_message_id?: string;
  isTyping?: boolean;
}

interface ChatResponse {
  response?: string;
  conversation_id?: string;
  assistant_message_id?: string;
  status?: 'queued';
  message?: string;
  queueId?: string;
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const { user } = useAuthContext();
  const axios = useAxios();
  const { conversationId: urlConversationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Clear parameters when on root route
  useEffect(() => {
    if (location.pathname === '/') {
      // Clear URL parameters
      window.history.replaceState({}, '', '/');
      // Reset state
      setMessages([]);
      setConversationId(null);
      setError(null);
    }
  }, [location.pathname]);

  // Reset state when URL changes
  useEffect(() => {
    if (!urlConversationId) {
      setMessages([]);
      setConversationId(null);
      setError(null);
    }
  }, [urlConversationId]);

  // Initialize conversation ID from URL if present
  useEffect(() => {
    if (urlConversationId) {
      setConversationId(urlConversationId);
      const fetchConversationHistory = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_APP_API_URI}${API_PATHS.CONVERSATIONS}/${urlConversationId}/history`
          );
          const history = response.data.map((msg: any) => ({
            id: msg.id,
            content: msg.content,
            sender: msg.role === 'user' ? 'user' : 'assistant',
            timestamp: new Date(msg.createdAt),
            assistant_message_id: msg.role === 'assistant' ? msg.id : undefined,
            isTyping: false
          }));
          setMessages(history);
        } catch (err) {
          console.error('Failed to fetch conversation history:', err);
          setError('Failed to load conversation history');
        }
      };
      fetchConversationHistory();
      
      faro.pushEvent('conversation_loaded', {
        conversation_id: urlConversationId,
      });
    }
  }, [urlConversationId, axios]);

  // Update URL when conversation ID changes
  useEffect(() => {
    if (conversationId) {
      // Use navigate to update the URL with hash routing
      navigate(`/chat/${conversationId}`, { replace: true });
      faro.pushEvent('conversation_id_updated', {
        conversation_id: conversationId,
      });
    }
  }, [conversationId, navigate]);

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
      faro.pushEvent('message_sent', {
        conversation_id: conversationId,
        message_length: content.length,
      });

      const response = await axios.post<ChatResponse>(
        `${import.meta.env.VITE_APP_API_URI}${API_PATHS.CHAT_GENERATE}`,
        {
          prompt: content,
          model: "llama3.2",
          max_tokens: 1000,
          temperature: 0.7,
          conversation_id: conversationId
        }
      );

      if (response.data.status === 'queued') {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response.data.message || 'Your request has been queued. Please wait...',
          sender: 'assistant',
          timestamp: new Date(),
          isTyping: true
        };
        setMessages(prev => [...prev, assistantMessage]);
        faro.pushEvent('message_queued', {
          conversation_id: conversationId,
          queue_id: response.data.queueId,
        });
      } else if (response.data.response) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response.data.response,
          sender: 'assistant',
          timestamp: new Date(),
          assistant_message_id: response.data.assistant_message_id,
          isTyping: true
        };
        setMessages(prev => [...prev, assistantMessage]);
        
        // Update conversation ID from response
        if (response.data.conversation_id) {
          setConversationId(response.data.conversation_id);
        }

        faro.pushEvent('message_received', {
          conversation_id: conversationId,
          response_length: response.data.response.length,
        });
      }
    } catch (err) {
      setError('Failed to get response from the assistant. Please try again.');
      console.error('Chat API error:', err);
      faro.pushEvent('message_error', {
        conversation_id: conversationId,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to mark the most recent message as not typing
  const markMessageAsTyped = (messageId: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, isTyping: false }
          : msg
      )
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto">
      {messages.length === 0 ? (
        // Initial state
        <div className="flex-1 flex flex-col items-center justify-center space-y-8 p-4">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 mx-auto border border-gray-800 bg-gray-800 p-1 rounded">
              <AnimatedLogo className="w-full h-full" />
            </div>
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
          <Conversation 
            messages={messages} 
            isLoading={isLoading} 
            onMessageTyped={markMessageAsTyped}
          />
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