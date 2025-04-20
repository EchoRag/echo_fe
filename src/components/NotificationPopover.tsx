import { Popover } from 'flowbite-react';
import { useState, useEffect } from 'react';
import useAxios from '../hooks/useAxios';
import { API_PATHS } from '../utils/apiPaths';
import { messaging } from '../firebase';
import { onMessage } from 'firebase/messaging';
import { useNavigate } from 'react-router-dom';

interface NotificationData {
  link?: string;
  status?: string;
  projectId?: string;
  documentId?: string;
}

interface NotificationReceipt {
  id: string;
  notificationId: string;
  userProviderUid: string;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  data: NotificationData;
  userProviderUid: string;
  createdAt: string;
  updatedAt: string;
  receipts: NotificationReceipt[];
}

interface NotificationPopoverProps {
  children: React.ReactElement;
}

export function NotificationPopover({ children }: NotificationPopoverProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState<Set<string>>(new Set());
  const axios = useAxios();
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.receipts[0]?.isRead).length;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(API_PATHS.NOTIFICATIONS);
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();

    // Set up Firebase message handler
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Received foreground message:', payload);
      
      // Create a new notification from the payload
      const newNotification: Notification = {
        id: payload.data?.notificationId || Date.now().toString(),
        type: payload.data?.type || 'default',
        title: payload.notification?.title || 'New Notification',
        body: payload.notification?.body || '',
        data: {
          link: payload.data?.link,
          status: payload.data?.status,
          projectId: payload.data?.projectId,
          documentId: payload.data?.documentId
        },
        userProviderUid: payload.data?.userProviderUid || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        receipts: [{
          id: Date.now().toString(),
          notificationId: payload.data?.notificationId || Date.now().toString(),
          userProviderUid: payload.data?.userProviderUid || '',
          isRead: false,
          createdAt: new Date().toISOString()
        }]
      };

      // Add the new notification to the list
      setNotifications(prevNotifications => [newNotification, ...prevNotifications]);
    });

    // Clean up the message handler when component unmounts
    return () => {
      unsubscribe();
    };
  }, [axios]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      setLoadingNotifications(prev => new Set(prev).add(notificationId));
      await axios.put(API_PATHS.NOTIFICATION_READ(notificationId));
      setNotifications(prevNotifications =>
        prevNotifications.map(n =>
          n.id === notificationId 
            ? {
                ...n,
                receipts: n.receipts.map(r => ({ ...r, isRead: true, readAt: new Date().toISOString() }))
              }
            : n
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    } finally {
      setLoadingNotifications(prev => {
        const next = new Set(prev);
        next.delete(notificationId);
        return next;
      });
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (notification.data.link) {
      navigate(notification.data.link);
    }
    if (!notification.receipts[0]?.isRead) {
      handleMarkAsRead(notification.id);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // TODO: Implement mark all as read API endpoint
      setNotifications(prevNotifications =>
        prevNotifications.map(n => ({
          ...n,
          receipts: n.receipts.map(r => ({ ...r, isRead: true, readAt: new Date().toISOString() }))
        }))
      );
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return `${minutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
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
              {notifications.length > 0 && (
                <button 
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Mark all as read
                </button>
              )}
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
                    !notification.receipts[0]?.isRead ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {formatDate(notification.createdAt)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{notification.body}</p>
                    </div>
                    {!notification.receipts[0]?.isRead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notification.id);
                        }}
                        className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                        title="Mark as read"
                        disabled={loadingNotifications.has(notification.id)}
                      >
                        {loadingNotifications.has(notification.id) ? (
                          <svg
                            className="animate-spin h-4 w-4 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      }
      className="w-80 z-50"
    >
      <div className="relative">
        {children}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 py-1 text-xs font-bold leading-none text-white transform translate-x-1/8 -translate-y-1/8 bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </div>
    </Popover>
  );
} 