import { useGlassmorphism } from "@/hooks/useGlassmorphism";
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  LifeBuoy,
  ArrowUp,
  ArrowDown,
  Package,
  Shield,
  Receipt,
  Wallet,
} from "lucide-react";
import { kpiData } from "@/mocks/data";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: number;
  percentChange: number;
  icon: React.ReactNode;
  color: string;
  format?: (value: number) => string;
  tooltip?: string;
}

function KpiCard({ title, value, percentChange, icon, color, format, tooltip }: KpiCardProps) {
  const glassStyles = useGlassmorphism();
  const isPositiveChange = percentChange >= 0;
  
  const formattedValue = format ? format(value) : value.toLocaleString('pt-BR');

  return (
    <div className={`${glassStyles.className} rounded-xl p-5 backdrop-blur-lg border border-gray-700/30 relative overflow-hidden`}>
      {/* Card shine effect */}
      <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-white/5 to-transparent opacity-40 blur-xl"></div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-gray-300 text-sm font-medium">{title}</h3>
          
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-gray-500 hover:text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-xs max-w-[200px]">{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        
        <div className={`w-10 h-10 rounded-full bg-${color}-900/30 flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      
      <div className="text-2xl font-bold text-white">{formattedValue}</div>
      
      <div className="flex items-center mt-3">
        <span className={`${isPositiveChange ? 'text-green-400' : 'text-red-400'} text-sm flex items-center`}>
          {isPositiveChange ? (
            <ArrowUp className="mr-1 h-3 w-3" />
          ) : (
            <ArrowDown className="mr-1 h-3 w-3" />
          )}
          {Math.abs(percentChange)}%
        </span>
        <span className="text-gray-400 text-xs ml-2">vs último mês</span>
      </div>
    </div>
  );
}

// Function to convert icon string to component
const getIconComponent = (iconName: string, color: string): React.ReactNode => {
  const className = `text-${color}-400`;
  
  switch(iconName) {
    case 'users':
      return <Users className={className} />;
    case 'shield':
      return <Shield className={className} />;
    case 'life-buoy':
      return <LifeBuoy className={className} />;
    case 'receipt':
      return <Receipt className={className} />;
    case 'package':
      return <Package className={className} />;
    case 'wallet':
      return <Wallet className={className} />;
    case 'shopping-cart':
      return <ShoppingCart className={className} />;
    case 'dollar-sign':
      return <DollarSign className={className} />;
    default:
      return <DollarSign className={className} />;
  }
};

export function KpiCards() {
  const [visible, setVisible] = useState(3);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Tooltips for each KPI
  const tooltips = {
    activeClients: "Clientes com saldo, pedidos ou interações nos últimos 30 dias",
    activeProxies: "Assinaturas de proxies atualmente ativas",
    contingencySubscriptions: "Planos de contingência ativos por assinatura",
    totalTransactions: "Total de transações finalizadas (pagas) na plataforma",
    itemsSold: "Soma total de unidades de todos os produtos vendidos",
    clientBalance: "Valor total de todos os saldos somados dos clientes na plataforma"
  };
  
  // Toggle expanded view
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    setVisible(isExpanded ? 3 : 6);
  };
  
  // Calculate visible KPIs
  const entries = Object.entries(kpiData).slice(0, visible);
  
  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {entries.map(([key, data]) => (
          <KpiCard
            key={key}
            title={key === 'activeClients' ? 'Clientes Ativos' : 
                  key === 'activeProxies' ? 'Proxys Ativas' :
                  key === 'contingencySubscriptions' ? 'Assinaturas (Contingência)' :
                  key === 'totalTransactions' ? 'Total de Transações' :
                  key === 'itemsSold' ? 'Itens Vendidos' :
                  key === 'clientBalance' ? 'Saldo em Conta dos Clientes' : ''}
            value={data.value}
            percentChange={data.percentChange}
            icon={getIconComponent(data.icon, data.color)}
            color={data.color}
            format={key === 'clientBalance' ? formatCurrency : undefined}
            tooltip={tooltips[key as keyof typeof tooltips]}
          />
        ))}
      </div>
      
      <div className="flex justify-center mt-4">
        <Button
          variant="link"
          className="text-gray-400 hover:text-white text-sm"
          onClick={toggleExpand}
        >
          {isExpanded ? "Mostrar menos métricas" : "Mostrar mais métricas"}
        </Button>
      </div>
    </div>
  );
}

export default KpiCards;
