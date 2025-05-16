import { Link } from "wouter";
import { useGlassmorphism } from "@/hooks/useGlassmorphism";
import { Subscription } from "@/types";
import { Button } from "@/components/ui/button";
import { Globe, UserCheck, BookOpen, Server } from "lucide-react";

interface SubscriptionsSectionProps {
  subscriptions: Subscription[];
  limit?: number;
  showViewAll?: boolean;
}

export function SubscriptionsSection({ 
  subscriptions, 
  limit = 2, 
  showViewAll = true 
}: SubscriptionsSectionProps) {
  const glassStyles = useGlassmorphism();
  
  // Filtrando para mostrar apenas assinaturas que não são proxies
  const filteredSubscriptions = subscriptions.filter(sub => 
    !sub.productTitle.toLowerCase().includes('proxy') && !sub.details.ip
  );
  
  const displaySubscriptions = limit 
    ? filteredSubscriptions.slice(0, limit) 
    : filteredSubscriptions;

  // Function to get icon component based on subscription icon string
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'globe':
        return <Globe className="text-2xl text-primary" />;
      case 'user-check':
        return <UserCheck className="text-2xl text-primary" />;
      case 'book-open':
        return <BookOpen className="text-2xl text-primary" />;
      default:
        return <Server className="text-2xl text-primary" />;
    }
  };

  // Function to get status badge color based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return "bg-green-100 text-green-800";
      case 'expired':
        return "bg-red-100 text-red-800";
      case 'pending_renewal':
        return "bg-yellow-100 text-yellow-800";
      case 'canceled':
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  // Function to get status text based on status
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return "Ativo";
      case 'expired':
        return "Vencido";
      case 'pending_renewal':
        return "Renovação pendente";
      case 'canceled':
        return "Cancelado";
      default:
        return "Desconhecido";
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold dark:text-white text-gray-800">
          {limit ? "Suas Assinaturas" : "Todas as Assinaturas"}
        </h2>
        {showViewAll && (
          <Link href="/assinaturas">
            <a className="text-primary text-sm hover:underline">Ver todas</a>
          </Link>
        )}
      </div>
      
      {displaySubscriptions.length === 0 ? (
        <div className={`${glassStyles.className} rounded-xl p-5 text-center`}>
          <p className="dark:text-gray-300 text-gray-600">
            Você ainda não possui assinaturas ativas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displaySubscriptions.map((subscription) => (
            <div 
              key={subscription.id}
              className={`${glassStyles.className} rounded-xl p-5 flex flex-col md:flex-row gap-4 items-center md:items-start`}
            >
              <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                {getIcon(subscription.icon)}
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <h3 className="text-lg font-semibold dark:text-white text-gray-900">
                    {subscription.productTitle}
                  </h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(subscription.status)}`}>
                    {getStatusText(subscription.status)}
                  </span>
                </div>
                <p className="text-sm dark:text-gray-300 text-gray-600 mb-2">
                  {subscription.details.ip && `IP: ${subscription.details.ip}`}
                  {subscription.details.id && `ID: ${subscription.details.id}`}
                </p>
                <p className="text-sm dark:text-gray-300 text-gray-600 mb-4">
                  Vencimento: {formatDate(subscription.details.expirationDate)}
                </p>
                <Button 
                  className="px-4 py-2 bg-primary hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
                >
                  Renovar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SubscriptionsSection;
