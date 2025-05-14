import { useState } from "react";
import { useGlassmorphism } from "@/hooks/useGlassmorphism";
import ThemeToggle from "@/components/layout/ThemeToggle";
import Sidebar from "@/components/layout/Sidebar";
import KpiCards from "@/components/admin/KpiCards";
import RecentOrders from "@/components/admin/RecentOrders";
import { orders } from "@/mocks/data";
import { Bell } from "lucide-react";

export function AdminDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const glassStyles = useGlassmorphism();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <header className={`${glassStyles.className} sticky top-0 z-10`}>
          <div className="px-6 py-3 flex items-center justify-between">
            <button 
              className="md:hidden text-gray-400"
              onClick={() => setSidebarOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="relative">
                  <Bell className="text-gray-400 h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    5
                  </span>
                </button>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                <span className="text-white font-medium text-sm">AD</span>
              </div>
            </div>
          </div>
        </header>
        
        <main className="p-6">
          <h2 className="text-xl font-bold dark:text-white text-gray-800 mb-6">Dashboard Admin</h2>
          
          {/* KPI Cards */}
          <KpiCards />
          
          {/* Recent Orders */}
          <RecentOrders orders={orders} />
        </main>
      </div>
      
      <ThemeToggle />
    </div>
  );
}

export default AdminDashboardPage;
