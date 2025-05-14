import { useState } from "react";
import Header from "@/components/layout/Header";
import ThemeToggle from "@/components/layout/ThemeToggle";
import BannerSlider from "@/components/dashboard/BannerSlider";
import CategoryFilter from "@/components/dashboard/CategoryFilter";
import ProductGrid from "@/components/dashboard/ProductGrid";
import SubscriptionsSection from "@/components/dashboard/SubscriptionsSection";
import TutorialsSection from "@/components/dashboard/TutorialsSection";
import { products, subscriptions, tutorials } from "@/mocks/data";
import { ProductCategory } from "@/types";

export function DashboardPage() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleCategoryChange = (category: ProductCategory) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <main className="container mx-auto px-4 py-6">
        {/* Banner Slider */}
        <BannerSlider />
        
        {/* Category Filter & Products */}
        <CategoryFilter 
          onFilterChange={handleCategoryChange}
          selectedCategory={selectedCategory}
        />
        <ProductGrid 
          products={products}
          category={selectedCategory}
        />
        
        {/* Subscriptions Section */}
        <SubscriptionsSection subscriptions={subscriptions} />
        
        {/* Tutorials Section */}
        <TutorialsSection tutorials={tutorials} />
      </main>
      
      <ThemeToggle />
    </div>
  );
}

export default DashboardPage;
