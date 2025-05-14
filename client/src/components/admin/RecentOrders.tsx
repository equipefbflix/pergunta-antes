import { useGlassmorphism } from "@/hooks/useGlassmorphism";
import { Order } from "@/types";
import { Link } from "wouter";

interface RecentOrdersProps {
  orders: Order[];
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  const glassStyles = useGlassmorphism();

  // Function to get status badge color based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return "bg-green-900 text-green-300";
      case 'pending':
        return "bg-yellow-900 text-yellow-300";
      case 'failed':
        return "bg-red-900 text-red-300";
      case 'canceled':
        return "bg-gray-700 text-gray-300";
      default:
        return "bg-blue-900 text-blue-300";
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

  return (
    <div className={`${glassStyles.className} rounded-xl p-6 mb-8`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Pedidos Recentes</h3>
        <Link href="/admin/pedidos">
          <a className="text-primary text-sm hover:underline">Ver todos</a>
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full min-w-full divide-y divide-gray-700">
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
          <tbody className="divide-y divide-gray-700">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                  #{order.id}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center mr-2">
                      <span className="text-white text-xs">{order.userInitials}</span>
                    </div>
                    <span className="text-white">{order.userName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                  {order.productTitle}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                  R$ {order.price.toFixed(2)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                  {new Date(order.date).toLocaleDateString('pt-BR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentOrders;
