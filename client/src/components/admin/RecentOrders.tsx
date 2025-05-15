import { useGlassmorphism } from "@/hooks/useGlassmorphism";
import { Order } from "@/types";
import { Link } from "wouter";
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertTriangle,
  Package,
  ShieldCheck,
  Smartphone,
  Briefcase,
  LifeBuoy
} from "lucide-react";

interface RecentOrdersProps {
  orders: Order[];
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  const glassStyles = useGlassmorphism();

  // Function to get status badge based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          className: "bg-green-900/50 text-green-300 border border-green-500/30",
          icon: <CheckCircle className="h-3.5 w-3.5 mr-1" />
        };
      case 'pending':
        return {
          className: "bg-yellow-900/50 text-yellow-300 border border-yellow-500/30",
          icon: <Clock className="h-3.5 w-3.5 mr-1" />
        };
      case 'failed':
        return {
          className: "bg-red-900/50 text-red-300 border border-red-500/30",
          icon: <XCircle className="h-3.5 w-3.5 mr-1" />
        };
      case 'canceled':
        return {
          className: "bg-gray-800/70 text-gray-300 border border-gray-600/30",
          icon: <AlertTriangle className="h-3.5 w-3.5 mr-1" />
        };
      default:
        return {
          className: "bg-blue-900/50 text-blue-300 border border-blue-500/30",
          icon: <Clock className="h-3.5 w-3.5 mr-1" />
        };
    }
  };

  // Function to get status text based on status
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return "Concluído";
      case 'pending':
        return "Pendente";
      case 'failed':
        return "Falhou";
      case 'canceled':
        return "Cancelado";
      default:
        return "Desconhecido";
    }
  };
  
  // Function to get product icon
  const getProductIcon = (productTitle: string) => {
    if (productTitle.toLowerCase().includes('proxy')) {
      return <ShieldCheck className="h-4 w-4 text-indigo-400" />;
    } else if (productTitle.toLowerCase().includes('perfil')) {
      return <Smartphone className="h-4 w-4 text-blue-400" />;
    } else if (productTitle.toLowerCase().includes('bm') || productTitle.toLowerCase().includes('business')) {
      return <Briefcase className="h-4 w-4 text-yellow-400" />;
    } else if (productTitle.toLowerCase().includes('contingência')) {
      return <LifeBuoy className="h-4 w-4 text-red-400" />;
    } else {
      return <Package className="h-4 w-4 text-green-400" />;
    }
  };

  return (
    <div className={`${glassStyles.className} rounded-xl p-6 mb-8 border border-gray-700/30 backdrop-blur-lg`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Pedidos Recentes</h3>
        <Link href="/admin/pedidos">
          <a className="text-primary hover:text-red-400 text-sm hover:underline flex items-center">
            Ver todos
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 ml-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full min-w-full divide-y divide-gray-700/50">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Cliente</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Produto</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Valor</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/50">
            {orders.map((order) => {
              const statusBadge = getStatusBadge(order.status);
              
              return (
                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                    #{order.id}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center mr-2 border border-gray-600/50">
                        <span className="text-white text-xs">{order.userInitials}</span>
                      </div>
                      <span className="text-white">{order.userName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-6 w-6 rounded bg-gray-800 flex items-center justify-center mr-2">
                        {getProductIcon(order.productTitle)}
                      </div>
                      <span>{order.productTitle}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <div className={`px-3 py-1 rounded-full text-xs flex items-center w-fit ${statusBadge.className}`}>
                      {statusBadge.icon}
                      <span>{getStatusText(order.status)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span className="font-medium text-white">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(order.price)}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                    {new Date(order.date).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentOrders;
