import { render, screen, fireEvent, act } from '@testing-library/react';
import { Chat } from '../Chat';
import { useAuthContext } from '../../../context/AuthContext';
import useAxios from '../../../hooks/useAxios';

// Mock the auth context
jest.mock('../../../context/AuthContext', () => ({
  useAuthContext: jest.fn(),
}));

// Mock the axios hook
jest.mock('../../../hooks/useAxios', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('Chat', () => {
  const mockUser = { name: 'Test User' };
  const mockAxios = {
    post: jest.fn(),
  };

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup auth context mock
    (useAuthContext as jest.Mock).mockReturnValue({ user: mockUser });
    
    // Setup axios mock
    (useAxios as jest.Mock).mockReturnValue(mockAxios);
  });

  it('renders initial state with user name and action cards', () => {
    render(<Chat />);
    
    // Check if user name is displayed
    expect(screen.getByText('Hi, Test User')).toBeInTheDocument();
    
    // Check if action cards are rendered
    expect(screen.getByText('Upload Files')).toBeInTheDocument();
    expect(screen.getByText('Call recording')).toBeInTheDocument();
    expect(screen.getByText('Upload Transcript')).toBeInTheDocument();
    
    // Check if chat input is present
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
  });

  it('handles message sending and displays loading state', async () => {
    const mockResponse = { data: { response: 'Test response' } };
    mockAxios.post.mockResolvedValue(mockResponse);

    render(<Chat />);
    
    // Type a message
    const input = screen.getByPlaceholderText('Type your message...');
    fireEvent.change(input, { target: { value: 'Hello' } });
    
    // Send the message
    const sendButton = screen.getByRole('button', { name: /send/i });
    await act(async () => {
      fireEvent.click(sendButton);
    });

    // Check if loading state is shown
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    // Wait for API response
    await act(async () => {
      await Promise.resolve();
    });

    // Check if message and response are displayed
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Test response')).toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    mockAxios.post.mockRejectedValue(new Error('API Error'));

    render(<Chat />);
    
    // Type a message
    const input = screen.getByPlaceholderText('Type your message...');
    fireEvent.change(input, { target: { value: 'Hello' } });
    
    // Send the message
    const sendButton = screen.getByRole('button', { name: /send/i });
    await act(async () => {
      fireEvent.click(sendButton);
    });

    // Wait for API response
    await act(async () => {
      await Promise.resolve();
    });

    // Check if error message is displayed
    expect(screen.getByText('Failed to get response from the assistant. Please try again.')).toBeInTheDocument();
  });

  it('displays conversation history correctly', async () => {
    const mockResponse = { data: { response: 'Test response' } };
    mockAxios.post.mockResolvedValue(mockResponse);

    render(<Chat />);
    
    // Send first message
    const input = screen.getByPlaceholderText('Type your message...');
    fireEvent.change(input, { target: { value: 'First message' } });
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /send/i }));
      await Promise.resolve();
    });

    // Send second message
    fireEvent.change(input, { target: { value: 'Second message' } });
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /send/i }));
      await Promise.resolve();
    });

    // Check if both messages and responses are displayed in order
    const messages = screen.getAllByText(/message/i);
    expect(messages).toHaveLength(2);
    expect(messages[0]).toHaveTextContent('First message');
    expect(messages[1]).toHaveTextContent('Second message');
  });

  it('does not send empty messages', async () => {
    render(<Chat />);
    
    // Try to send empty message
    const sendButton = screen.getByRole('button', { name: /send/i });
    await act(async () => {
      fireEvent.click(sendButton);
    });

    // Check that no API call was made
    expect(mockAxios.post).not.toHaveBeenCalled();
  });
}); 