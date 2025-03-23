// import { useState } from 'react';
import { Modal } from 'flowbite-react';
import { SignIn } from '@clerk/clerk-react';

interface LoginModalProps {
  show: boolean;
  onClose: () => void;
}

export function LoginModal({ show, onClose }: LoginModalProps) {
  return (
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
  );
} 