import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PushNotificationButton from '../PushNotificationButton';
import { messaging } from '../../firebase';
import { getToken } from 'firebase/messaging';
import useAxios from '../../hooks/useAxios';
import { browserStorage } from '../../utils/browserStorage';

// Mock the dependencies
jest.mock('../../firebase', () => ({
  messaging: {}
}));

jest.mock('firebase/messaging', () => ({
  getToken: jest.fn()
}));

jest.mock('../../hooks/useAxios', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('../../utils/browserStorage', () => ({
  browserStorage: {
    getUserData: jest.fn()
  }
}));

describe('PushNotificationButton', () => {
  const mockAxios = {
    post: jest.fn()
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    (useAxios as jest.Mock).mockReturnValue(mockAxios);
    
    // Mock Notification API
    Object.defineProperty(window, 'Notification', {
      value: {
        permission: 'default',
        requestPermission: jest.fn()
      },
      configurable: true
    });

    // Mock Service Worker API
    Object.defineProperty(navigator, 'serviceWorker', {
      value: {
        register: jest.fn().mockResolvedValue({}),
        ready: Promise.resolve()
      },
      configurable: true
    });
  });

  it('renders enable notifications button when notifications are not enabled', () => {
    render(<PushNotificationButton />);
    expect(screen.getByText('Enable Push Notifications')).toBeInTheDocument();
  });

  it('shows enabled state when notifications are already granted', () => {
    Object.defineProperty(window.Notification, 'permission', {
      value: 'granted',
      configurable: true
    });
    render(<PushNotificationButton />);
    expect(screen.getByText('Notifications Enabled')).toBeInTheDocument();
  });

  it('handles enabling notifications successfully', async () => {
    const mockUserData = { id: '123' };
    const mockFcmToken = 'mock-fcm-token';
    
    (browserStorage.getUserData as jest.Mock).mockReturnValue(mockUserData);
    (window.Notification.requestPermission as jest.Mock).mockResolvedValue('granted');
    (getToken as jest.Mock).mockResolvedValue(mockFcmToken);
    mockAxios.post.mockResolvedValue({});

    render(<PushNotificationButton />);
    
    const button = screen.getByText('Enable Push Notifications');
    fireEvent.click(button);

    // Check loading state
    expect(screen.getByText('Enabling...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Notifications Enabled')).toBeInTheDocument();
    });

    expect(getToken).toHaveBeenCalled();
    expect(mockAxios.post).toHaveBeenCalledWith('/api/v1/notifications/token', {
      fcmToken: mockFcmToken,
      userProviderUid: mockUserData.id,
      deviceType: 'web',
      deviceId: navigator.userAgent
    });
  });

  it('handles error when user is not authenticated', async () => {
    (browserStorage.getUserData as jest.Mock).mockReturnValue(null);
    (window.Notification.requestPermission as jest.Mock).mockResolvedValue('granted');

    render(<PushNotificationButton />);
    
    const button = screen.getByText('Enable Push Notifications');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('User not authenticated')).toBeInTheDocument();
    });
  });

  it('handles error when notification permission is denied', async () => {
    (window.Notification.requestPermission as jest.Mock).mockResolvedValue('denied');

    render(<PushNotificationButton />);
    
    const button = screen.getByText('Enable Push Notifications');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Enable Push Notifications')).toBeInTheDocument();
    });
  });
}); 