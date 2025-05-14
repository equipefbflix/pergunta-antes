import { useState } from "react";
import Header from "@/components/layout/Header";
import ThemeToggle from "@/components/layout/ThemeToggle";
import SubscriptionsSection from "@/components/dashboard/SubscriptionsSection";
import { subscriptions } from "@/mocks/data";

export function SubscriptionsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold dark:text-white text-gray-800">Suas Assinaturas</h1>
          <p className="text-sm dark:text-gray-300 text-gray-600 mt-1">
            Gerencie todos os seus serviços ativos e pendentes
          </p>
        </div>
        
        <SubscriptionsSection 
          subscriptions={subscriptions} 
          limit={0} 
          showViewAll={false} 
        />
      </main>
      
      <ThemeToggle />
    </div>
  );
}

export default SubscriptionsPage;
