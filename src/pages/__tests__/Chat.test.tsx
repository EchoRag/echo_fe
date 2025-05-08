import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Chat } from '../Chat';
import { useAuthContext } from '../../context/AuthContext';
import useAxios from '../../hooks/useAxios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { faro } from '../../utils/faroConfig';

// Mock window.history
const mockReplaceState = jest.fn();
Object.defineProperty(window, 'history', {
  value: {
    replaceState: mockReplaceState,
  },
  writable: true,
});

// Mock the dependencies
jest.mock('../../context/AuthContext');
jest.mock('../../hooks/useAxios');
jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));
jest.mock('../../utils/faroConfig', () => ({
  faro: {
    pushEvent: jest.fn(),
  },
}));

// Mock child components
jest.mock('../../components/Chat/ChatInput', () => ({
  ChatInput: ({ onSend }: { onSend: (message: string) => void }) => (
    <div>
      <input type="text" role="textbox" />
      <button onClick={() => onSend('Test message')}>Send</button>
    </div>
  ),
}));

jest.mock('../../components/Chat/Conversation', () => ({
  Conversation: ({ messages, isLoading }: { messages: any[], isLoading: boolean }) => (
    <div>
      {messages.map((msg) => (
        <div key={msg.id}>
          <p>{msg.content}</p>
        </div>
      ))}
      {isLoading && <div>Loading...</div>}
    </div>
  ),
}));

jest.mock('../../components/Chat/ActionCards', () => ({
  ActionCards: () => <div>Action Cards</div>,
}));

jest.mock('../../components/AnimatedLogo', () => ({
  AnimatedLogo: () => <div>Logo</div>,
}));

describe('Chat', () => {
  const mockUser = { name: 'Test User' };
  const mockAxios = {
    get: jest.fn(),
    post: jest.fn(),
  };
  const mockNavigate = jest.fn();
  const mockLocation = { pathname: '/' };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthContext as jest.Mock).mockReturnValue({ user: mockUser });
    (useAxios as jest.Mock).mockReturnValue(mockAxios);
    (useParams as jest.Mock).mockReturnValue({ conversationId: null });
    (useLocation as jest.Mock).mockReturnValue(mockLocation);
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  it('renders initial state correctly', () => {
    render(<Chat />);
    
    expect(screen.getByText(`Hi, ${mockUser.name}`)).toBeInTheDocument();
    expect(screen.getByText('Can I help you with anything?')).toBeInTheDocument();
    expect(screen.getByText('Ready to Assist you with anything you need, from answering questions to providing recommendations. Let\'s get started!')).toBeInTheDocument();
  });

  it('sends a message and displays it in the conversation', async () => {
    const mockResponse = {
      data: {
        response: 'Test response',
        conversation_id: '123',
        assistant_message_id: '456',
      },
    };
    mockAxios.post.mockResolvedValueOnce(mockResponse);

    render(<Chat />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    // Check if user message appears
    expect(screen.getByText('Test message')).toBeInTheDocument();

    // Wait for assistant response
    await waitFor(() => {
      expect(screen.getByText('Test response')).toBeInTheDocument();
    });

    // Verify API call
    expect(mockAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/conversations/generate'),
      expect.objectContaining({
        prompt: 'Test message',
        model: 'llama3.2',
      })
    );

    // Verify faro event
    expect(faro.pushEvent).toHaveBeenCalledWith('message_sent', expect.any(Object));
    expect(faro.pushEvent).toHaveBeenCalledWith('message_received', expect.any(Object));
  });

  it('handles API errors correctly', async () => {
    mockAxios.post.mockRejectedValueOnce(new Error('API Error'));

    render(<Chat />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    // Check if error message appears
    await waitFor(() => {
      expect(screen.getByText('Failed to get response from the assistant. Please try again.')).toBeInTheDocument();
    });

    // Verify faro error event
    expect(faro.pushEvent).toHaveBeenCalledWith('message_error', expect.any(Object));
  });

  it('loads conversation history when URL has conversation ID', async () => {
    const mockConversationId = '123';
    const mockHistory = [
      {
        id: '1',
        content: 'Previous message',
        role: 'user',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        content: 'Previous response',
        role: 'assistant',
        createdAt: new Date().toISOString(),
      },
    ];

    (useParams as jest.Mock).mockReturnValue({ conversationId: mockConversationId });
    mockAxios.get.mockResolvedValueOnce({ data: mockHistory });

    render(<Chat />);

    // Wait for conversation history to load
    await waitFor(() => {
      expect(screen.getByText('Previous message')).toBeInTheDocument();
      expect(screen.getByText('Previous response')).toBeInTheDocument();
    });

    // Verify API call
    expect(mockAxios.get).toHaveBeenCalledWith(
      expect.stringContaining(`/conversations/${mockConversationId}/history`)
    );

    // Verify faro event
    expect(faro.pushEvent).toHaveBeenCalledWith('conversation_loaded', {
      conversation_id: mockConversationId,
    });
  });

  it('handles queued responses correctly', async () => {
    const mockQueuedResponse = {
      data: {
        status: 'queued',
        message: 'Your request has been queued. Please wait...',
        queueId: '789',
      },
    };
    mockAxios.post.mockResolvedValueOnce(mockQueuedResponse);

    render(<Chat />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    // Check if queued message appears
    await waitFor(() => {
      expect(screen.getByText('Your request has been queued. Please wait...')).toBeInTheDocument();
    });

    // Verify faro event
    expect(faro.pushEvent).toHaveBeenCalledWith('message_queued', expect.any(Object));
  });

  it('clears state when navigating to root route', () => {
    const mockLocation = { pathname: '/' };
    (useLocation as jest.Mock).mockReturnValue(mockLocation);

    render(<Chat />);
    
    // Verify URL is cleared
    expect(mockReplaceState).toHaveBeenCalledWith({}, '', '/');
  });

  it('updates URL when conversation ID changes', async () => {
    const mockResponse = {
      data: {
        response: 'Test response',
        conversation_id: '123',
        assistant_message_id: '456',
      },
    };
    mockAxios.post.mockResolvedValueOnce(mockResponse);

    render(<Chat />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    // Wait for conversation ID to be set
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/chat/123', { replace: true });
    });

    // Verify faro event
    expect(faro.pushEvent).toHaveBeenCalledWith('conversation_id_updated', {
      conversation_id: '123',
    });
  });
}); 