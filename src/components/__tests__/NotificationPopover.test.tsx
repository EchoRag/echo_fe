import { render, screen } from '@testing-library/react';
import { NotificationPopover } from '../NotificationPopover';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

describe('NotificationPopover', () => {
  const mockChild = (
    <button>Notification Button</button>
  );

  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children correctly', () => {
    renderWithRouter(
      <NotificationPopover>
        {mockChild}
      </NotificationPopover>
    );
    
    expect(screen.getByRole('button', { name: 'Notification Button' })).toBeInTheDocument();
  });

  it('shows notification badge when there are unread notifications', () => {
    renderWithRouter(
      <NotificationPopover>
        {mockChild}
      </NotificationPopover>
    );
    
    const badge = screen.getByText('2');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-red-500');
  });

  it('does not show notification badge when all notifications are read', () => {
    // const mockNotifications = [
    //   { id: '1', title: 'Test', message: 'Test', time: '1m ago', isRead: true }
    // ];
    
    jest.spyOn(Array.prototype, 'filter').mockReturnValueOnce([]);
    
    renderWithRouter(
      <NotificationPopover>
        {mockChild}
      </NotificationPopover>
    );
    
    expect(screen.queryByText('2')).not.toBeInTheDocument();
  });

  it('opens popover when clicked and shows notifications', async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <NotificationPopover>
        {mockChild}
      </NotificationPopover>
    );
    
    await user.click(screen.getByRole('button', { name: 'Notification Button' }));
    
    // Check for popover content
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Mark all as read')).toBeInTheDocument();
  });

  it('displays notifications with correct formatting', async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <NotificationPopover>
        {mockChild}
      </NotificationPopover>
    );
    
    await user.click(screen.getByRole('button', { name: 'Notification Button' }));
    
    // Check first notification
    const notification = screen.getByText('New Project Created').closest('div');
    expect(notification).toHaveTextContent('5 min ago');
    expect(notification).toHaveTextContent('New Project Created5 min ago');
  });

  it('shows correct styling for read vs unread notifications', async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <NotificationPopover>
        {mockChild}
      </NotificationPopover>
    );
    
    await user.click(screen.getByRole('button', { name: 'Notification Button' }));
    
    const unreadNotification = await screen.getByText('New Project Created').parentElement?.parentElement?.closest('div');
    const readNotification = await screen.getByText('Connection Status').parentElement?.parentElement?.closest('div');
    
    expect(unreadNotification).toHaveClass('bg-blue-50');
    expect(readNotification).not.toHaveClass('bg-blue-50');
  });

  it('shows "Mark all as read" button with correct styling', async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <NotificationPopover>
        {mockChild}
      </NotificationPopover>
    );
    
    await user.click(screen.getByRole('button', { name: 'Notification Button' }));
    
    const markAllButton = screen.getByRole('button', { name: 'Mark all as read' });
    expect(markAllButton).toHaveClass('text-blue-600');
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
    
    // Verify popover is shown
    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  // it('shows empty state when there are no notifications', async () => {
  //   jest.spyOn(Array.prototype, 'map').mockReturnValueOnce([]);

  //   const user = userEvent.setup();
  //   renderWithRouter(
  //     <NotificationPopover>
  //       {mockChild}
  //     </NotificationPopover>
  //   );
    
  //   await user.click(screen.getByRole('button', { name: 'Notification Button' }));
  //   expect(screen.getByText('No new notifications')).toBeInTheDocument();
  // });

  // it('shows loading state when notifications fail to load', async () => {
  //   jest.spyOn(Array.prototype, 'map').mockImplementationOnce(() => {
  //     throw new Error('Loading');
  //   });

  //   const user = userEvent.setup();
  //   renderWithRouter(
  //     <NotificationPopover>
  //       {mockChild}
  //     </NotificationPopover>
  //   );
    
  //   await user.click(screen.getByRole('button', { name: 'Notification Button' }));
  //   expect(screen.getByText('Loading notifications...')).toBeInTheDocument();
  // });
}); 