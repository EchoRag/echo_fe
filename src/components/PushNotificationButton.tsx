import React, { useEffect, useState } from 'react';
import { messaging } from '../firebase';
import { Button } from 'flowbite-react';
import { getToken } from 'firebase/messaging';
import useAxios from '../hooks/useAxios';
import { browserStorage } from '../utils/browserStorage';

const PushNotificationButton: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const axios = useAxios();

  useEffect(() => {
    // Check if notifications are already enabled
    if (Notification.permission === 'granted') {
      setIsEnabled(true);
    }
  }, []);

  const handleEnableNotifications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check if service workers are supported
      if (!('serviceWorker' in navigator)) {
        setError('Service workers are not supported by this browser');
        setIsLoading(false);
        return;
      }

      // Get user data from browser storage
      const userData = browserStorage.getUserData();
      if (!userData) {
        setError('User not authenticated');
        setIsLoading(false);
        return;
      }

      // Request notification permission
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        // Register service worker
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
          scope: '/'
        });

        // Wait for the service worker to be ready
        await navigator.serviceWorker.ready;

        // Get FCM token
        const token = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
          serviceWorkerRegistration: registration
        });

        console.log('FCM Token:', token);

        // Send token to backend
        await axios.post('/api/v1/notifications/token', {
          fcmToken: token,
          userProviderUid: userData.id,
          deviceType: 'web',
          deviceId: navigator.userAgent // Using user agent as device ID for web
        });

        setIsEnabled(true);
      }
    } catch (err) {
      console.error('Error enabling notifications:', err);
      setError(err instanceof Error ? err.message : 'Failed to enable notifications');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button
        color={isEnabled ? "success" : "primary"}
        onClick={handleEnableNotifications}
        disabled={isEnabled || isLoading}
        className="w-full"
      >
        {isLoading ? (
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Enabling...
          </div>
        ) : isEnabled ? (
          'Notifications Enabled'
        ) : (
          'Enable Push Notifications'
        )}
      </Button>
      {error && (
        <p className="mt-2 text-sm text-red-600" data-testid="error-message">{error}</p>
      )}
    </div>
  );
};

export default PushNotificationButton; 