import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Notification, NotificationContextType } from '@/types';
import { notifications as mockNotifications } from '@/mocks/data';

const NotificationContext = createContext<NotificationContextType>({
  activeNotification: null,
  showNotification: () => {},
  dismissNotification: () => {},
  notifications: [],
});

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activeNotification, setActiveNotification] = useState<Notification | null>(null);

  // Show notification by ID
  const showNotification = (id: number) => {
    const notification = notifications.find(n => n.id === id);
    if (notification) {
      setActiveNotification(notification);
    }
  };

  // Dismiss active notification
  const dismissNotification = () => {
    setActiveNotification(null);
  };

  // Simulate random notification appearing after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (notifications.length > 0 && !activeNotification) {
        // Show the first notification after a delay
        showNotification(notifications[0].id);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        activeNotification,
        showNotification,
        dismissNotification,
        notifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
