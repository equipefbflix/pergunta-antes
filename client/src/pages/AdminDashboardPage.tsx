import { useState } from "react";
import { useGlassmorphism } from "@/hooks/useGlassmorphism";
import ThemeToggle from "@/components/layout/ThemeToggle";
import Sidebar from "@/components/layout/Sidebar";
import KpiCards from "@/components/admin/KpiCards";
import RecentOrders from "@/components/admin/RecentOrders";
import AdminCharts from "@/components/admin/AdminCharts";
import TopCustomers from "@/components/admin/TopCustomers";
import { orders } from "@/mocks/data";
import { Bell, LayoutDashboard, Menu } from "lucide-react";

export function AdminDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const glassStyles = useGlassmorphism();

  return (
    <div className="flex h-screen overflow-hidden bg-background relative">
      {/* Background gradient effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-40">
        <div className="absolute top-10 right-20 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply blur-[80px] opacity-30"></div>
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply blur-[80px] opacity-20"></div>
      </div>
      
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <header className={`${glassStyles.className} sticky top-0 z-10 border-b border-gray-800`}>
          <div className="px-6 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <button 
                className="md:hidden text-gray-400 mr-3"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="flex items-center">
                <LayoutDashboard className="text-primary h-5 w-5 mr-2" />
                <h1 className="text-white font-medium">Administrador do painel</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="relative">
                  <Bell className="text-gray-400 h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    5
                  </span>
                </button>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center border border-gray-600/50">
                <span className="text-white font-medium text-sm">AD</span>
              </div>
            </div>
          </div>
        </header>
        
        <main className="px-6 py-8">
          {/* KPI Cards */}
          <KpiCards />
          
          {/* Advanced Charts */}
          <AdminCharts />
          
          {/* Top Customers Ranking */}
          <TopCustomers />
          
          {/* Recent Orders */}
          <RecentOrders orders={orders} />
        </main>
      </div>
      
      <ThemeToggle />
    </div>
  );
}

export default AdminDashboardPage;
