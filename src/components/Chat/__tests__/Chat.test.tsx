import { render, screen, fireEvent, act } from '@testing-library/react';
import { Chat } from '../Chat';
import { useAuthContext } from '../../../context/AuthContext';

// Mock the auth context
jest.mock('../../../context/AuthContext', () => ({
  useAuthContext: jest.fn(),
}));

// Mock child components
jest.mock('../ChatInput', () => ({
  ChatInput: ({ onSend }: { onSend: (message: string) => void }) => (
    <input
      data-testid="chat-input"
      onChange={(e) => onSend(e.target.value)}
    />
  ),
}));

jest.mock('../ActionCards', () => ({
  ActionCards: () => <div data-testid="action-cards">Action Cards</div>,
}));

jest.mock('../Conversation', () => ({
  Conversation: ({ messages, isLoading }: { messages: any[], isLoading: boolean }) => (
    <div data-testid="conversation">
      {messages.map((msg: any) => (
        <div key={msg.id}>{msg.content}</div>
      ))}
      {isLoading && <div>Loading...</div>}
    </div>
  ),
}));

describe('Chat', () => {
  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
  };

  beforeEach(() => {
    (useAuthContext as jest.Mock).mockReturnValue({ user: mockUser });
  });

  it('renders initial state correctly', () => {
    render(<Chat />);
    
    expect(screen.getByAltText('Echo Logo')).toBeInTheDocument();
    expect(screen.getByText(`Hi, ${mockUser.name}`)).toBeInTheDocument();
    expect(screen.getByTestId('action-cards')).toBeInTheDocument();
    expect(screen.getByTestId('chat-input')).toBeInTheDocument();
  });

  it('renders "Guest" when user is not logged in', () => {
    (useAuthContext as jest.Mock).mockReturnValue({ user: null });
    render(<Chat />);
    
    expect(screen.getByText('Hi, Guest')).toBeInTheDocument();
  });

  it('transitions to conversation state when message is sent', async () => {
    render(<Chat />);
    
    const input = screen.getByTestId('chat-input');
    fireEvent.change(input, { target: { value: 'Hello' } });

    // Wait for the mock response
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1100));
    });

    expect(screen.getByTestId('conversation')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('This is a mock response. Implement actual AI response here.')).toBeInTheDocument();
  });

  it('shows loading state while waiting for response', async () => {
    render(<Chat />);
    
    const input = screen.getByTestId('chat-input');
    fireEvent.change(input, { target: { value: 'Hello' } });

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for the mock response
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1100));
    });

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });
}); 