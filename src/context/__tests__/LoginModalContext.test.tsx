import { render, screen, act } from '@testing-library/react';
import { LoginModalProvider, useLoginModal } from '../LoginModalContext';

// Test component that uses the context
function TestComponent() {
  const { showLoginModal, openLoginModal, closeLoginModal } = useLoginModal();
  return (
    <div>
      <div data-testid="modal-state">{showLoginModal.toString()}</div>
      <button onClick={openLoginModal}>Open Modal</button>
      <button onClick={closeLoginModal}>Close Modal</button>
    </div>
  );
}

describe('LoginModalContext', () => {
  it('provides initial state', () => {
    render(
      <LoginModalProvider>
        <TestComponent />
      </LoginModalProvider>
    );
    
    expect(screen.getByTestId('modal-state')).toHaveTextContent('false');
  });

  it('opens modal when openLoginModal is called', () => {
    render(
      <LoginModalProvider>
        <TestComponent />
      </LoginModalProvider>
    );
    
    act(() => {
      screen.getByText('Open Modal').click();
    });
    
    expect(screen.getByTestId('modal-state')).toHaveTextContent('true');
  });

  it('closes modal when closeLoginModal is called', () => {
    render(
      <LoginModalProvider>
        <TestComponent />
      </LoginModalProvider>
    );
    
    // First open the modal
    act(() => {
      screen.getByText('Open Modal').click();
    });
    expect(screen.getByTestId('modal-state')).toHaveTextContent('true');
    
    // Then close it
    act(() => {
      screen.getByText('Close Modal').click();
    });
    expect(screen.getByTestId('modal-state')).toHaveTextContent('false');
  });

  it('provides context to nested components', () => {
    function NestedComponent() {
      const { showLoginModal } = useLoginModal();
      return <div data-testid="nested-state">{showLoginModal.toString()}</div>;
    }

    render(
      <LoginModalProvider>
        <div>
          <TestComponent />
          <NestedComponent />
        </div>
      </LoginModalProvider>
    );
    
    const states = screen.getAllByText('false');
    expect(states).toHaveLength(2);
  });

  it('maintains state between renders', () => {
    function ReRenderComponent() {
      const { showLoginModal, openLoginModal } = useLoginModal();
      return (
        <div>
          <div data-testid="modal-state">{showLoginModal.toString()}</div>
          <button onClick={openLoginModal}>Open Modal</button>
          {showLoginModal && <div>Modal Content</div>}
        </div>
      );
    }

    const { rerender } = render(
      <LoginModalProvider>
        <ReRenderComponent />
      </LoginModalProvider>
    );

    act(() => {
      screen.getByText('Open Modal').click();
    });

    rerender(
      <LoginModalProvider>
        <ReRenderComponent />
      </LoginModalProvider>
    );

    expect(screen.getByTestId('modal-state')).toHaveTextContent('true');
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });
}); 