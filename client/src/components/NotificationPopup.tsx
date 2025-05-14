import { useGlassmorphism } from "@/hooks/useGlassmorphism";
import { useNotifications } from "@/context/NotificationContext";
import { X, AlertCircle, InfoIcon, CheckCircle } from "lucide-react";
import { NotificationType } from "@/types";
import { useEffect } from "react";
import { Link } from "wouter";

export function NotificationPopup() {
  const { activeNotification, dismissNotification } = useNotifications();
  const glassStyles = useGlassmorphism();

  useEffect(() => {
    // Auto-dismiss notification after 8 seconds
    const timeout = setTimeout(() => {
      if (activeNotification) {
        dismissNotification();
      }
    }, 8000);

    return () => clearTimeout(timeout);
  }, [activeNotification, dismissNotification]);

  if (!activeNotification) return null;

  // Get icon based on notification type
  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "warning":
        return <AlertCircle className="text-yellow-400 h-5 w-5" />;
      case "info":
        return <InfoIcon className="text-blue-400 h-5 w-5" />;
      case "success":
        return <CheckCircle className="text-green-400 h-5 w-5" />;
      case "error":
        return <AlertCircle className="text-red-400 h-5 w-5" />;
      default:
        return <InfoIcon className="text-gray-400 h-5 w-5" />;
    }
  };

  return (
    <div
      className={`${glassStyles.className} fixed bottom-20 right-4 z-40 max-w-xs rounded-xl shadow-lg animate-in`}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon(activeNotification.type)}
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-white">{activeNotification.title}</p>
            <p className="mt-1 text-sm text-gray-300">{activeNotification.message}</p>
            <div className="mt-2 flex space-x-2">
              <Link href={activeNotification.primaryAction.link}>
                <a className="text-xs font-medium text-primary hover:text-red-400 transition-colors">
                  {activeNotification.primaryAction.text}
                </a>
              </Link>
              <button
                className="text-xs font-medium text-gray-400 hover:text-gray-300 transition-colors"
                onClick={dismissNotification}
              >
                {activeNotification.secondaryAction.text}
              </button>
            </div>
          </div>
          <button
            className="ml-4 text-gray-400 hover:text-white"
            onClick={dismissNotification}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotificationPopup;
