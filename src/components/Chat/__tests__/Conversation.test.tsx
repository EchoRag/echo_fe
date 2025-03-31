import { render, screen } from '@testing-library/react';
import { Conversation } from '../Conversation';
import { Message } from '../Chat';

describe('Conversation', () => {
  const mockMessages: Message[] = [
    {
      id: '1',
      content: 'Hello',
      sender: 'user' as const,
      timestamp: new Date('2024-01-01T12:00:00'),
    },
    {
      id: '2',
      content: 'Hi there!',
      sender: 'assistant' as const,
      timestamp: new Date('2024-01-01T12:01:00'),
    },
  ];

  beforeEach(() => {
    // Mock scrollIntoView
    Element.prototype.scrollIntoView = jest.fn();
  });

  it('renders messages correctly', () => {
    render(<Conversation messages={mockMessages} isLoading={false} />);
    
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Hi there!')).toBeInTheDocument();
  });

  it('shows loading indicator when isLoading is true', () => {
    render(<Conversation messages={mockMessages} isLoading={true} />);
    
    // Check for the three loading dots
    const loadingDots = screen.getAllByRole('generic').filter(
      element => element.className.includes('animate-bounce')
    );
    expect(loadingDots).toHaveLength(3);
  });

  it('applies correct styles for user messages', () => {
    render(<Conversation messages={mockMessages} isLoading={false} />);
    
    const userMessage = screen.getByText('Hello').closest('div');
    expect(userMessage).toHaveClass('bg-blue-600', 'text-white', 'rounded-br-none');
  });

  it('applies correct styles for assistant messages', () => {
    render(<Conversation messages={mockMessages} isLoading={false} />);
    
    const assistantMessage = screen.getByText('Hi there!').closest('div');
    expect(assistantMessage).toHaveClass('bg-gray-100', 'text-gray-900', 'rounded-bl-none');
  });

  it('displays timestamps for messages', () => {
    render(<Conversation messages={mockMessages} isLoading={false} />);
    
    // Note: toLocaleTimeString output might vary based on the system locale
    const timestamp = new Date('2024-01-01T12:00:00').toLocaleTimeString();
    expect(screen.getByText(timestamp)).toBeInTheDocument();
  });

  it('scrolls to bottom when new messages are added', () => {
    render(<Conversation messages={mockMessages} isLoading={false} />);
    
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('renders empty state when no messages', () => {
    render(<Conversation messages={[]} isLoading={false} />);
    
    // expect(screen.queryByRole('generic')).toBeInTheDocument();
    expect(screen.queryByText('Hello')).not.toBeInTheDocument();
  });
}); 