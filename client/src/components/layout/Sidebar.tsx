import { Link, useLocation } from "wouter";
import { useGlassmorphism } from "@/hooks/useGlassmorphism";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  RefreshCw,
  Tag,
  HandCoins,
  Video,
  Image,
  FileText,
  Bell,
  X,
  Network
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();
  const glassStyles = useGlassmorphism();

  const menuItems = [
    { icon: <LayoutDashboard className="mr-3 h-5 w-5" />, name: "Dashboard", path: "/admin" },
    { icon: <Package className="mr-3 h-5 w-5" />, name: "Produtos", path: "/admin/produtos" },
    { icon: <ShoppingCart className="mr-3 h-5 w-5" />, name: "Pedidos", path: "/admin/pedidos" },
    { icon: <RefreshCw className="mr-3 h-5 w-5" />, name: "Assinaturas", path: "/admin/assinaturas" },
    { icon: <Network className="mr-3 h-5 w-5" />, name: "Proxy", path: "/proxy" },
    { icon: <Tag className="mr-3 h-5 w-5" />, name: "Cupons", path: "/admin/cupons" },
    { icon: <HandCoins className="mr-3 h-5 w-5" />, name: "Comissões", path: "/admin/comissoes" },
    { icon: <Video className="mr-3 h-5 w-5" />, name: "Tutoriais", path: "/admin/tutoriais" },
    { icon: <Image className="mr-3 h-5 w-5" />, name: "Banners", path: "/admin/banners" },
    { icon: <FileText className="mr-3 h-5 w-5" />, name: "Termos de uso", path: "/admin/termos" },
    { icon: <Bell className="mr-3 h-5 w-5" />, name: "Avisos", path: "/admin/avisos" },
  ];

  const sidebarClass = `
    ${glassStyles.className} 
    fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    md:translate-x-0 md:static md:z-0
  `;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      <aside className={sidebarClass}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-primary font-bold text-2xl">FBFLIX</h1>
            <button className="md:hidden text-gray-400" onClick={onClose}>
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <nav className="space-y-1 flex-1">
            {menuItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <a 
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    location === item.path
                      ? "text-white bg-gray-800 bg-opacity-50"
                      : "text-gray-400 hover:text-white hover:bg-gray-800 hover:bg-opacity-30"
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </a>
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
