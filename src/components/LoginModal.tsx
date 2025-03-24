// import { useState } from 'react';
import { Modal } from 'flowbite-react';
import { SignIn } from '@clerk/clerk-react';
import { Provider } from 'react-redux';
import store from '../store';
import { AuthProvider } from '../context/AuthContext';

interface LoginModalProps {
  show: boolean;
  onClose: () => void;
}

export function LoginModal({ show, onClose }: LoginModalProps) {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Modal show={show} onClose={onClose} size="md">
          <Modal.Header>
            Sign In
          </Modal.Header>
          <Modal.Body>
            <div className="flex justify-center">
              <SignIn />
            </div>
          </Modal.Body>
        </Modal>
      </AuthProvider>
    </Provider>
  );
}