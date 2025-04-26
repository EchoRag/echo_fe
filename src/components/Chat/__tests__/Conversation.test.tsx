import { render, screen } from '@testing-library/react';
import { Conversation } from '../Conversation';
import { Message } from '../../../pages/Chat';

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

// Mock react-markdown
jest.mock('react-markdown', () => {
  return function MockReactMarkdown({ children }: { children: string }) {
    return <div data-testid="mock-markdown">{children}</div>;
  };
});

interface TypewriterProps {
  text: string;
  enabled: boolean;
  speed: number;
}

// Mock the useTypewriter hook
jest.mock('../../../hooks/useTypewriter', () => ({
  useTypewriter: jest.fn().mockImplementation(({ text }: TypewriterProps) => ({
    displayedText: text,
  })),
}));

describe('Conversation', () => {
  const mockMessages: Message[] = [
    {
      id: '1',
      content: 'Hello, how can I help you?',
      sender: 'assistant',
      timestamp: new Date('2024-01-01T12:00:00'),
    },
    {
      id: '2',
      content: 'I need help with my code',
      sender: 'user',
      timestamp: new Date('2024-01-01T12:01:00'),
    },
    {
      id: '3',
      content: 'Here is some **markdown** and `code`',
      sender: 'assistant',
      timestamp: new Date('2024-01-01T12:02:00'),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all messages correctly', () => {
    render(<Conversation messages={mockMessages} isLoading={false} onMessageTyped={function (_messageId: string): void {
      throw new Error('Function not implemented.');
    } } />);
    
    // Check if all messages are rendered
    expect(screen.getByText('Hello, how can I help you?')).toBeInTheDocument();
    expect(screen.getByText('I need help with my code')).toBeInTheDocument();
    expect(screen.getByText('Here is some **markdown** and `code`')).toBeInTheDocument();
  });

  it('renders markdown content correctly', () => {
    render(<Conversation messages={mockMessages} isLoading={false} onMessageTyped={function (_messageId: string): void {
      throw new Error('Function not implemented.');
    } } />);
    
    // Check if markdown is rendered properly
    const markdownElements = screen.getAllByTestId('mock-markdown');
    expect(markdownElements).toHaveLength(3); // One for each message
  });

  it('shows loading indicator when isLoading is true', () => {
    render(<Conversation messages={mockMessages} isLoading={true} onMessageTyped={function (_messageId: string): void {
      throw new Error('Function not implemented.');
    } } />);
    
    // Check if loading indicator is present
    const loadingContainer = screen.getByTestId('loading-indicator');
    const loadingDots = loadingContainer.querySelectorAll('div');
    expect(loadingDots).toHaveLength(3); // Three dots in the loading animation
  });

  it('does not show loading indicator when isLoading is false', () => {
    render(<Conversation messages={mockMessages} isLoading={false} onMessageTyped={function (_messageId: string): void {
      throw new Error('Function not implemented.');
    } } />);
    
    // Check that loading indicator is not present
    const loadingIndicator = screen.queryByTestId('loading-indicator');
    expect(loadingIndicator).not.toBeInTheDocument();
  });

  it('renders messages with correct styling based on sender', () => {
    render(<Conversation messages={mockMessages} isLoading={false} onMessageTyped={function (_messageId: string): void {
      throw new Error('Function not implemented.');
    } } />);
    
    // Find all message containers
    const messageContainers = screen.getAllByTestId('message-bubble');
    
    // Check user message styling (last message)
    const userMessage = messageContainers[1];
    expect(userMessage).toHaveClass('justify-end');
    
    // Check user message bubble styling
    const userMessageBubble = userMessage.querySelector('div');
    expect(userMessageBubble).toHaveClass('bg-blue-600');
    expect(userMessageBubble).toHaveClass('text-white');
    
    // Check assistant message styling (first message)
    const assistantMessage = messageContainers[0];
    expect(assistantMessage).toHaveClass('justify-start');
    
    // Check assistant message bubble styling
    const assistantMessageBubble = assistantMessage.querySelector('div');
    expect(assistantMessageBubble).toHaveClass('bg-gray-100');
    expect(assistantMessageBubble).toHaveClass('text-gray-900');
  });

  it('renders timestamps correctly', () => {
    render(<Conversation messages={mockMessages} isLoading={false} onMessageTyped={function (_messageId: string): void {
      throw new Error('Function not implemented.');
    } } />);
    
    // Check if timestamps are rendered
    const timestamps = screen.getAllByText(/12:00|12:01|12:02/);
    expect(timestamps).toHaveLength(3);
  });

  it('handles empty messages array', () => {
    render(<Conversation messages={[]} isLoading={false} onMessageTyped={function (_messageId: string): void {
      throw new Error('Function not implemented.');
    } } />);
    
    // Check that no messages are rendered
    const messageElements = screen.queryAllByTestId('mock-markdown');
    expect(messageElements).toHaveLength(0);
  });

  it('applies typewriter effect to assistant messages', () => {
    const mockUseTypewriter = jest.requireMock('../../../hooks/useTypewriter').useTypewriter;
    mockUseTypewriter.mockImplementation(({ text }: TypewriterProps) => ({
      displayedText: text,
    }));

    render(<Conversation messages={mockMessages} isLoading={false} onMessageTyped={function (_messageId: string): void {
      throw new Error('Function not implemented.');
    } } />);
    
    // Verify that useTypewriter was called for assistant messages
    expect(mockUseTypewriter).toHaveBeenCalledWith(
      expect.objectContaining({
        text: 'Hello, how can I help you?',
        enabled: true,
        speed: 20,
      })
    );
  });

  it('calls scrollIntoView when messages change', () => {
    render(<Conversation messages={mockMessages} isLoading={false} onMessageTyped={function (_messageId: string): void {
      throw new Error('Function not implemented.');
    } } />);
    
    // Verify that scrollIntoView was called
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
  });
}); 