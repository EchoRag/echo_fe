import { renderHook, act } from '@testing-library/react';
import { useTypewriter } from '../useTypewriter';
import { vi } from 'vitest';

describe('useTypewriter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with empty text', () => {
    const { result } = renderHook(() => useTypewriter({ text: '' }));
    expect(result.current.displayedText).toBe('');
    expect(result.current.isTypingComplete).toBe(false);
  });

  it('should display full text immediately when disabled', () => {
    const { result } = renderHook(() => useTypewriter({ 
      text: 'Hello World', 
      enabled: false 
    }));
    expect(result.current.displayedText).toBe('Hello World');
    expect(result.current.isTypingComplete).toBe(true);
  });

  it('should type out text character by character', () => {
    const { result } = renderHook(() => useTypewriter({ 
      text: 'Hi', 
      speed: 100 
    }));

    // Initial state
    expect(result.current.displayedText).toBe('');
    expect(result.current.isTypingComplete).toBe(false);

    // After first character
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current.displayedText).toBe('H');
    expect(result.current.isTypingComplete).toBe(false);

    // After second character
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current.displayedText).toBe('Hi');
    expect(result.current.isTypingComplete).toBe(true);
  });

  it('should handle text updates', () => {
    const { result, rerender } = renderHook(
      ({ text }) => useTypewriter({ text, speed: 100 }),
      { initialProps: { text: 'Hi' } }
    );

    // Initial text
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current.displayedText).toBe('Hi');

    // Update text
    rerender({ text: 'Hello' });
    expect(result.current.displayedText).toBe('');
    expect(result.current.isTypingComplete).toBe(false);

    // Type new text
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current.displayedText).toBe('Hello');
    expect(result.current.isTypingComplete).toBe(true);
  });

  it('should cleanup interval on unmount', () => {
    const clearIntervalSpy = vi.spyOn(window, 'clearInterval');
    const { unmount } = renderHook(() => useTypewriter({ text: 'Hi', speed: 100 }));

    unmount();
    expect(clearIntervalSpy).toHaveBeenCalled();
  });
}); 