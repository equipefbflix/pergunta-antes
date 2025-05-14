import { useGlassmorphism } from "@/hooks/useGlassmorphism";
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  RefreshCw,
  ArrowUp
} from "lucide-react";

interface KpiCardProps {
  title: string;
  value: number;
  percentChange: number;
  icon: string;
  color: string;
  format?: (value: number) => string;
}

function KpiCard({ title, value, percentChange, icon, color, format }: KpiCardProps) {
  const glassStyles = useGlassmorphism();
  
  const formattedValue = format ? format(value) : value.toString();
  
  // Get icon component
  const getIcon = () => {
    const colorClass = `text-${color}-400`;
    const bgColorClass = `bg-${color}-900 bg-opacity-30`;
    
    switch(icon) {
      case 'users':
        return (
          <div className={`w-10 h-10 rounded-full ${bgColorClass} flex items-center justify-center`}>
            <Users className={colorClass} />
          </div>
        );
      case 'shopping-cart':
        return (
          <div className={`w-10 h-10 rounded-full ${bgColorClass} flex items-center justify-center`}>
            <ShoppingCart className={colorClass} />
          </div>
        );
      case 'dollar-sign':
        return (
          <div className={`w-10 h-10 rounded-full ${bgColorClass} flex items-center justify-center`}>
            <DollarSign className={colorClass} />
          </div>
        );
      case 'sync':
        return (
          <div className={`w-10 h-10 rounded-full ${bgColorClass} flex items-center justify-center`}>
            <RefreshCw className={colorClass} />
          </div>
        );
      default:
        return (
          <div className={`w-10 h-10 rounded-full ${bgColorClass} flex items-center justify-center`}>
            <DollarSign className={colorClass} />
          </div>
        );
    }
  };

  return (
    <div className={`${glassStyles.className} rounded-xl p-6`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-400 text-sm">{title}</h3>
        {getIcon()}
      </div>
      <div className="text-2xl font-bold text-white">{formattedValue}</div>
      <div className="flex items-center mt-2">
        <span className="text-green-400 text-sm flex items-center">
          <ArrowUp className="mr-1 h-3 w-3" />
          {percentChange}%
        </span>
        <span className="text-gray-400 text-xs ml-2">vs último mês</span>
      </div>
    </div>
  );
}

export function KpiCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <KpiCard
        title="Total de Usuários"
        value={1248}
        percentChange={12}
        icon="users"
        color="indigo"
      />
      
      <KpiCard
        title="Pedidos"
        value={3576}
        percentChange={8}
        icon="shopping-cart"
        color="green"
      />
      
      <KpiCard
        title="Receita"
        value={287492}
        percentChange={17}
        icon="dollar-sign"
        color="primary"
        format={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
      />
      
      <KpiCard
        title="Assinaturas Ativas"
        value={892}
        percentChange={5}
        icon="sync"
        color="blue"
      />
    </div>
  );
}

export default KpiCards;
