import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ToastProvider, useToast } from '../Toast';

// Test component that uses the toast
function TestComponent() {
  const { showToast } = useToast();
  return (
    <div>
      <button onClick={() => showToast('Success message', 'success')} data-testid="success-btn">
        Show Success
      </button>
      <button onClick={() => showToast('Error message', 'error')} data-testid="error-btn">
        Show Error
      </button>
      <button onClick={() => showToast('Warning message', 'warning')} data-testid="warning-btn">
        Show Warning
      </button>
      <button onClick={() => showToast('Info message', 'info')} data-testid="info-btn">
        Show Info
      </button>
    </div>
  );
}

describe('Toast', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('shows success toast', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByTestId('success-btn'));
    expect(screen.getByText('Success message')).toBeInTheDocument();
  });

  it('shows error toast', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByTestId('error-btn'));
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('shows warning toast', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByTestId('warning-btn'));
    expect(screen.getByText('Warning message')).toBeInTheDocument();
  });

  it('shows info toast', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByTestId('info-btn'));
    expect(screen.getByText('Info message')).toBeInTheDocument();
  });

  it('auto dismisses toast after 5 seconds', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByTestId('success-btn'));
    expect(screen.getByText('Success message')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(screen.queryByText('Success message')).not.toBeInTheDocument();
  });

  it('can be manually dismissed', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByTestId('success-btn'));
    expect(screen.getByText('Success message')).toBeInTheDocument();

    const dismissButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(dismissButton);

    expect(screen.queryByText('Success message')).not.toBeInTheDocument();
  });

  it('throws error when useToast is used outside provider', () => {
    const consoleError = console.error;
    console.error = jest.fn();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useToast must be used within a ToastProvider');

    console.error = consoleError;
  });
}); 