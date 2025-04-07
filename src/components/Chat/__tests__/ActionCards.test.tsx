import { render, screen, fireEvent } from '@testing-library/react';
import { ActionCards } from '../ActionCards';

describe('ActionCard', () => {
  const mockIcon = (
    <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  );

  it('should render with correct props', () => {
    const mockOnClick = jest.fn();
    render(
      <button
        onClick={mockOnClick}
        className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 w-48 space-y-2"
      >
        <div className="text-gray-800 w-12 h-12">
          {mockIcon}
        </div>
        <h3 className="font-semibold text-gray-800">Test Title</h3>
        <p className="text-sm text-gray-500 text-center">Test Description</p>
      </button>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveClass('flex', 'flex-col', 'items-center');
  });

  it('should call onClick when clicked', () => {
    const mockOnClick = jest.fn();
    render(
      <button
        onClick={mockOnClick}
        className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 w-48 space-y-2"
      >
        <div className="text-gray-800 w-12 h-12">
          {mockIcon}
        </div>
        <h3 className="font-semibold text-gray-800">Test Title</h3>
        <p className="text-sm text-gray-500 text-center">Test Description</p>
      </button>
    );

    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});

describe('ActionCards', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render all three action cards', () => {
    render(<ActionCards />);

    // Check if all cards are rendered with correct titles
    expect(screen.getByText('Upload Files')).toBeInTheDocument();
    expect(screen.getByText('Call recording')).toBeInTheDocument();
    expect(screen.getByText('Upload Transcript')).toBeInTheDocument();

    // Check if all descriptions are rendered
    expect(screen.getByText('hld, api spec, etc')).toBeInTheDocument();
    expect(screen.getByText('audio or video file')).toBeInTheDocument();
    expect(screen.getByText('txt, word file')).toBeInTheDocument();
  });

  it('should call console.log when Upload Files is clicked', () => {
    render(<ActionCards />);
    fireEvent.click(screen.getByText('Upload Files'));
    expect(console.log).toHaveBeenCalledWith('Upload files clicked');
  });

  it('should call console.log when Call recording is clicked', () => {
    render(<ActionCards />);
    fireEvent.click(screen.getByText('Call recording'));
    expect(console.log).toHaveBeenCalledWith('Call recording clicked');
  });

  it('should call console.log when Upload Transcript is clicked', () => {
    render(<ActionCards />);
    fireEvent.click(screen.getByText('Upload Transcript'));
    expect(console.log).toHaveBeenCalledWith('Upload transcript clicked');
  });

  it('should have correct styling for the container', () => {
    render(<ActionCards />);
    const container = screen.getByTestId('action-cards-container');
    expect(container).toHaveClass('flex', 'gap-6', 'flex-wrap', 'justify-center');
  });

  it('should render SVG icons for each card', () => {
    render(<ActionCards />);
    const iconContainers = screen.getAllByTestId('action-card-icon');
    expect(iconContainers).toHaveLength(3);
    iconContainers.forEach(container => {
      expect(container).toHaveClass('w-12', 'h-12');
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });
}); 