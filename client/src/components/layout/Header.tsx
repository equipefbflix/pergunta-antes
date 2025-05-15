import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import ThemeToggle from "./ThemeToggle";
import { useState } from "react";
import { useGlassmorphism } from "@/hooks/useGlassmorphism";
import { Menu, Bell, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddBalanceModal } from "@/components/modals/AddBalanceModal";
import { useNotifications } from "@/context/NotificationContext";

interface HeaderProps {
  isCheckout?: boolean;
  toggleSidebar?: () => void;
}

export function Header({ isCheckout = false, toggleSidebar }: HeaderProps) {
  const [location] = useLocation();
  const { user } = useAuth();
  const { notifications, showNotification } = useNotifications();
  const [balanceModalOpen, setBalanceModalOpen] = useState(false);
  const glassStyles = useGlassmorphism();

  // Only show notification count for unread notifications
  const notificationCount = notifications.length;

  const handleShowAddBalanceModal = () => {
    setBalanceModalOpen(true);
  };

  const handleShowRandomNotification = () => {
    if (notifications.length > 0) {
      // Show a random notification from the list
      const randomIndex = Math.floor(Math.random() * notifications.length);
      showNotification(notifications[randomIndex].id);
    }
  };

  return (
    <>
      <header className={`${glassStyles.className} sticky top-0 z-40`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              {isCheckout ? (
                <Link href="/dashboard">
                  <a className="mr-4 text-gray-400 hover:text-white transition-all">
                    <ChevronLeft className="h-5 w-5" />
                  </a>
                </Link>
              ) : (
                <button
                  onClick={toggleSidebar}
                  className="md:hidden text-gray-400 hover:text-white transition-all"
                >
                  <Menu className="h-5 w-5" />
                </button>
              )}
              <h1 className="text-primary font-bold text-2xl">FBFLIX</h1>
              
              {!isCheckout && (
                <nav className="hidden md:flex items-center space-x-6">
                  <Link href="/dashboard">
                    <a className={`font-medium hover:text-primary transition-colors ${location === "/dashboard" ? "text-white" : "text-gray-400"}`}>
                      Dashboard
                    </a>
                  </Link>
                  <Link href="/assinaturas">
                    <a className={`font-medium hover:text-primary transition-colors ${location === "/assinaturas" ? "text-white" : "text-gray-400"}`}>
                      Assinaturas
                    </a>
                  </Link>
                  <Link href="/pedidos">
                    <a className={`font-medium hover:text-primary transition-colors ${location === "/pedidos" ? "text-white" : "text-gray-400"}`}>
                      Pedidos
                    </a>
                  </Link>
                  <Link href="/tutoriais">
                    <a className={`font-medium hover:text-primary transition-colors ${location === "/tutoriais" ? "text-white" : "text-gray-400"}`}>
                      Tutoriais
                    </a>
                  </Link>
                  <Link href="/anuncios">
                    <a className={`font-medium hover:text-primary transition-colors ${location === "/anuncios" ? "text-white" : "text-gray-400"} flex items-center gap-1`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                      </svg>
                      Anuncie Aqui
                    </a>
                  </Link>
                </nav>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {isCheckout ? (
                <div className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-sm text-gray-300">Pagamento Seguro</span>
                </div>
              ) : (
                <>
                  <button 
                    onClick={handleShowAddBalanceModal}
                    className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 px-3 py-1 rounded-full hover:from-green-600 hover:to-green-700 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span className="text-white font-semibold">R$ {user?.balance.toFixed(2)}</span>
                  </button>
                  
                  <button
                    onClick={handleShowRandomNotification}
                    className="relative"
                  >
                    <Bell className="text-gray-400 h-5 w-5" />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                        {notificationCount}
                      </span>
                    )}
                  </button>
                </>
              )}
              
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                <span className="text-white font-medium text-sm">{user?.initials}</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {balanceModalOpen && <AddBalanceModal isOpen={balanceModalOpen} onClose={() => setBalanceModalOpen(false)} />}
    </>
  );
}

export default Header;
