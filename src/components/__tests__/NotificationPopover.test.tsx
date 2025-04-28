// Mock Faro configuration
jest.mock('../../utils/faroConfig', () => ({
  faro: {
    api: {
      getOTEL: () => null,
      pushEvent: jest.fn(),
    },
  },
}));

// Mock Firebase
jest.mock('../../firebase', () => ({
  messaging: {
    onMessage: jest.fn(),
  },
}));

import { render, screen, waitFor } from '@testing-library/react';
import { NotificationPopover } from '../NotificationPopover';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import useAxios from '../../hooks/useAxios';

// Mock useAxios
jest.mock('../../hooks/useAxios');

describe('NotificationPopover', () => {
  const mockChild = (
    <button>Notification Button</button>
  );

  const mockNotifications = [
    {
      id: '1',
      type: 'project',
      title: 'New Project Created',
      body: 'A new project has been created',
      data: { projectId: '123' },
      userProviderUid: 'user1',
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
      updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      receipts: [{ id: '1', notificationId: '1', userProviderUid: 'user1', isRead: false, createdAt: new Date().toISOString() }]
    },
    {
      id: '2',
      type: 'connection',
      title: 'Connection Status',
      body: 'Connection status updated',
      data: { status: 'connected' },
      userProviderUid: 'user1',
      createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
      updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      receipts: [{ id: '2', notificationId: '2', userProviderUid: 'user1', isRead: true, createdAt: new Date().toISOString() }]
    }
  ];

  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAxios as jest.Mock).mockReturnValue({
      get: jest.fn().mockResolvedValue({
        data: {
          notifications: mockNotifications,
          total: mockNotifications.length,
          page: 1,
          limit: 6
        }
      }),
      put: jest.fn().mockResolvedValue({})
    });
  });

  it('renders children correctly', () => {
    renderWithRouter(
      <NotificationPopover>
        {mockChild}
      </NotificationPopover>
    );
    
    expect(screen.getByRole('button', { name: 'Notification Button' })).toBeInTheDocument();
  });

  it('shows notification badge when there are unread notifications', async () => {
    renderWithRouter(
      <NotificationPopover>
        {mockChild}
      </NotificationPopover>
    );
    
    await waitFor(() => {
      const badge = screen.getByText('1');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-red-500');
    });
  });

  it('does not show notification badge when all notifications are read', async () => {
    (useAxios as jest.Mock).mockReturnValue({
      get: jest.fn().mockResolvedValue({
        data: {
          notifications: mockNotifications.map(n => ({
            ...n,
            receipts: [{ ...n.receipts[0], isRead: true }]
          })),
          total: mockNotifications.length,
          page: 1,
          limit: 6
        }
      }),
      put: jest.fn().mockResolvedValue({})
    });
    
    renderWithRouter(
      <NotificationPopover>
        {mockChild}
      </NotificationPopover>
    );
    
    await waitFor(() => {
      expect(screen.queryByText('1')).not.toBeInTheDocument();
    });
  });

  it('opens popover when clicked and shows notifications', async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <NotificationPopover>
        {mockChild}
      </NotificationPopover>
    );
    
    await user.click(screen.getByRole('button', { name: 'Notification Button' }));
    
    await waitFor(() => {
      expect(screen.getByText('Notifications')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Mark all as read' })).toBeInTheDocument();
    });
  });

  it('displays notifications with correct formatting', async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <NotificationPopover>
        {mockChild}
      </NotificationPopover>
    );
    
    await user.click(screen.getByRole('button', { name: 'Notification Button' }));
    
    await waitFor(() => {
      const notification = screen.getByText('New Project Created').closest('div[class*="px-4 py-2"]');
      expect(notification).toHaveTextContent('5m ago');
      expect(notification).toHaveTextContent('A new project has been created');
    });
  });

  it('shows correct styling for read vs unread notifications', async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <NotificationPopover>
        {mockChild}
      </NotificationPopover>
    );
    
    await user.click(screen.getByRole('button', { name: 'Notification Button' }));
    
    await waitFor(() => {
      const unreadNotification = screen.getByText('New Project Created').closest('div[class*="px-4 py-2"]');
      const readNotification = screen.getByText('Connection Status').closest('div[class*="px-4 py-2"]');
      
      expect(unreadNotification).toHaveClass('bg-blue-50');
      expect(readNotification).not.toHaveClass('bg-blue-50');
    });
  });

  it('shows "Mark all as read" button with correct styling', async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <NotificationPopover>
        {mockChild}
      </NotificationPopover>
    );
    
    await user.click(screen.getByRole('button', { name: 'Notification Button' }));
    
    await waitFor(() => {
      const markAllButton = screen.getByRole('button', { name: 'Mark all as read' });
      expect(markAllButton).toHaveClass('text-blue-600');
    });
  });

  it('handles keyboard interaction', async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <NotificationPopover>
        {mockChild}
      </NotificationPopover>
    );
    
    const button = screen.getByRole('button', { name: 'Notification Button' });
    button.focus();
    await user.keyboard('{Enter}');
    
    await waitFor(() => {
      expect(screen.getByText('Notifications')).toBeInTheDocument();
    });
  });
}); 