import { useState } from "react";
import { useGlassmorphism } from "@/hooks/useGlassmorphism";
import { topCustomers } from "@/mocks/data";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Calendar } from "lucide-react";

type TimeRange = "today" | "week" | "month" | "year";

export function TopCustomers() {
  const glassStyles = useGlassmorphism();
  const [timeRange, setTimeRange] = useState<TimeRange>("month");
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  // Get the color for ranking position
  const getRankColor = (position: number) => {
    switch (position) {
      case 0:
        return "text-yellow-400"; // Gold
      case 1:
        return "text-slate-300"; // Silver
      case 2:
        return "text-amber-600"; // Bronze
      default:
        return "text-gray-400"; // Others
    }
  };
  
  // Get icon for ranking position
  const getRankIcon = (position: number) => {
    if (position < 3) {
      return (
        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${position === 0 ? 'bg-yellow-400/20' : position === 1 ? 'bg-slate-300/20' : 'bg-amber-600/20'}`}>
          <Trophy className={`h-4 w-4 ${getRankColor(position)}`} />
        </div>
      );
    }
    return (
      <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-700/50">
        <span className="text-xs text-gray-400">{position + 1}</span>
      </div>
    );
  };
  
  return (
    <div className={`${glassStyles.className} rounded-xl p-6 mb-8`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">Top 10 Clientes</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant={timeRange === "today" ? "default" : "secondary"}
            size="sm"
            className={timeRange === "today" ? "bg-primary hover:bg-red-700" : "bg-gray-800 hover:bg-gray-700"}
            onClick={() => setTimeRange("today")}
          >
            Hoje
          </Button>
          <Button 
            variant={timeRange === "week" ? "default" : "secondary"}
            size="sm"
            className={timeRange === "week" ? "bg-primary hover:bg-red-700" : "bg-gray-800 hover:bg-gray-700"}
            onClick={() => setTimeRange("week")}
          >
            Semana
          </Button>
          <Button 
            variant={timeRange === "month" ? "default" : "secondary"}
            size="sm"
            className={timeRange === "month" ? "bg-primary hover:bg-red-700" : "bg-gray-800 hover:bg-gray-700"}
            onClick={() => setTimeRange("month")}
          >
            Mês
          </Button>
          <Button 
            variant={timeRange === "year" ? "default" : "secondary"}
            size="sm"
            className={timeRange === "year" ? "bg-primary hover:bg-red-700" : "bg-gray-800 hover:bg-gray-700"}
            onClick={() => setTimeRange("year")}
          >
            Ano
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-12">#</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Cliente</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <span>Total Gasto</span>
                  <DollarIcon className="h-3 w-3" />
                </div>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <span>Pedidos</span>
                  <Calendar className="h-3 w-3" />
                </div>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Ticket Médio</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {topCustomers.map((customer, index) => (
              <tr key={customer.id} className="group hover:bg-gray-800/50 transition-colors">
                <td className="px-3 py-3 whitespace-nowrap">
                  {getRankIcon(index)}
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full flex items-center justify-center bg-gray-700 group-hover:bg-primary/10 transition-colors">
                      <Users className="h-4 w-4 text-gray-300" />
                    </div>
                    <div className="ml-2">
                      <div className="text-sm font-medium text-white">{customer.name}</div>
                      <div className="text-xs text-gray-400">{customer.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-white font-medium">
                  {formatCurrency(customer.totalSpent)}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-300">
                  {customer.orderCount} pedidos
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-green-400">
                  {formatCurrency(customer.averageTicket)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Dollar sign icon component
function DollarIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="12" y1="1" x2="12" y2="23"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  );
}

export default TopCustomers;