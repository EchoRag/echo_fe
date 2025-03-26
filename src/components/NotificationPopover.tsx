import { Popover } from 'flowbite-react';
import { useState } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

interface NotificationPopoverProps {
  children: React.ReactElement;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Project Created',
    message: 'Project "API Integration" has been created successfully.',
    time: '5 min ago',
    isRead: false,
  },
  {
    id: '2',
    title: 'System Update',
    message: 'Echo Platform has been updated to version 2.0.',
    time: '1 hour ago',
    isRead: false,
  },
  {
    id: '3',
    title: 'Connection Status',
    message: 'All systems are operational.',
    time: '2 hours ago',
    isRead: true,
  },
];

export function NotificationPopover({ children }: NotificationPopoverProps) {
  const [isLoading] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  return (
    <Popover
      trigger="click"
      placement="right"
      content={
        <div className="w-80 max-h-[400px] overflow-y-auto bg-white rounded-lg shadow-lg">
          <div className="p-3 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <button 
                onClick={handleMarkAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Mark all as read
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No new notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex justify-between">
                    <h4 className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </h4>
                    <span className="text-xs text-gray-500">{notification.time}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      }
      className="w-80"
    >
      <div className="relative">
        {children}
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </div>
        )}
      </div>
    </Popover>
  );
} 