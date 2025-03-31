import { render, screen, fireEvent } from '@testing-library/react';
import { ActionCards } from '../ActionCards';

describe('ActionCards', () => {
  beforeEach(() => {
    // Clear mock console logs
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders all three action cards', () => {
    render(<ActionCards />);
    
    expect(screen.getByText('Upload Files')).toBeInTheDocument();
    expect(screen.getByText('Call recording')).toBeInTheDocument();
    expect(screen.getByText('Upload Transcript')).toBeInTheDocument();
  });

  it('renders descriptions for each card', () => {
    render(<ActionCards />);
    
    expect(screen.getByText('hld, api spec, etc')).toBeInTheDocument();
    expect(screen.getByText('audio or video file')).toBeInTheDocument();
    expect(screen.getByText('txt, word file')).toBeInTheDocument();
  });

  it('handles click on Upload Files card', () => {
    render(<ActionCards />);
    
    fireEvent.click(screen.getByText('Upload Files'));
    expect(console.log).toHaveBeenCalledWith('Upload files clicked');
  });

  it('handles click on Call recording card', () => {
    render(<ActionCards />);
    
    fireEvent.click(screen.getByText('Call recording'));
    expect(console.log).toHaveBeenCalledWith('Call recording clicked');
  });

  it('handles click on Upload Transcript card', () => {
    render(<ActionCards />);
    
    fireEvent.click(screen.getByText('Upload Transcript'));
    expect(console.log).toHaveBeenCalledWith('Upload transcript clicked');
  });

  it('renders icons for each card', () => {
    render(<ActionCards />);
    
    const icons = screen.getAllByRole('button').map(button => 
      button.querySelector('svg')
    );
    
    expect(icons).toHaveLength(3);
    icons.forEach(icon => {
      expect(icon).toBeInTheDocument();
    });
  });

  it('applies hover styles to cards', () => {
    render(<ActionCards />);
    
    const cards = screen.getAllByRole('button');
    cards.forEach(card => {
      expect(card).toHaveClass('hover:shadow-xl', 'transition-shadow');
    });
  });
}); 