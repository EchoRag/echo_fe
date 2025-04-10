import { useState, useEffect } from 'react';
import useAxios from './useAxios';
import { API_PATHS } from '../utils/apiPaths';

interface Message {
  id: string;
  conversationId: string;
  role: string;
  content: string;
  createdAt: string;
}

interface Conversation {
  id: string;
  userProviderUid: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

interface MappedConversation {
  id: string;
  name: string;
  isPinned: boolean;
  path: string;
}

export const useConversations = () => {
  const [conversations, setConversations] = useState<MappedConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const axios = useAxios();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get<Conversation[]>(API_PATHS.CONVERSATIONS);
        const data = response.data.map((conv: Conversation) => {
          // Get the first message content as the conversation name
          const firstMessage = conv.messages[0]?.content || 'New Conversation';
          // Truncate the name if it's too long
          const name = firstMessage.length > 50 
            ? `${firstMessage.substring(0, 47)}...` 
            : firstMessage;

          return {
            id: conv.id,
            name,
            isPinned: false, // Default to false since it's not in the API response
            path: `/chat/${conv.id}`
          };
        });
        setConversations(data);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching conversations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [axios]);

  return { conversations, loading, error };
}; 