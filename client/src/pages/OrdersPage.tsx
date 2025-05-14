import { useState } from "react";
import Header from "@/components/layout/Header";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { useGlassmorphism } from "@/hooks/useGlassmorphism";
import { orders } from "@/mocks/data";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Info } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export function OrdersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const glassStyles = useGlassmorphism();
  const { toast } = useToast();

  // Function to get status badge color based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Concluído</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Falhou</Badge>;
      case 'canceled':
        return <Badge className="bg-gray-100 text-gray-800">Cancelado</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-800">Processando</Badge>;
    }
  };

  const handleViewDetails = (orderId: number) => {
    setSelectedOrderId(orderId);
    setDetailsOpen(true);
  };

  const handleDownload = (orderId: number) => {
    // In a real app, this would download a file
    toast({
      title: "Arquivo baixado",
      description: `O arquivo do pedido #${orderId} foi baixado com sucesso.`,
      variant: "success",
    });
  };

  const selectedOrder = orders.find(order => order.id === selectedOrderId);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold dark:text-white text-gray-800">Seus Pedidos</h1>
          <p className="text-sm dark:text-gray-300 text-gray-600 mt-1">
            Histórico completo de suas compras e transações
          </p>
        </div>
        
        <div className={`${glassStyles.className} rounded-xl p-6 overflow-hidden`}>
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="dark:text-gray-300 text-gray-600">
                Você ainda não realizou nenhum pedido.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pedido #</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id}</TableCell>
                      <TableCell>{order.productTitle}</TableCell>
                      <TableCell>{new Date(order.date).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>R$ {order.price.toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex items-center gap-1"
                            onClick={() => handleViewDetails(order.id)}
                          >
                            <Info className="h-4 w-4" />
                            <span className="hidden sm:inline">Detalhes</span>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex items-center gap-1"
                            onClick={() => handleDownload(order.id)}
                          >
                            <Download className="h-4 w-4" />
                            <span className="hidden sm:inline">Download</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>
      
      {/* Order Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className={`${glassStyles.className} max-w-md mx-auto p-0 border-0`}>
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">
                Detalhes do Pedido #{selectedOrderId}
              </DialogTitle>
              <DialogDescription className="text-gray-300">
                Informações completas sobre sua compra
              </DialogDescription>
            </DialogHeader>
            
            {selectedOrder && (
              <div className="mt-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Produto:</span>
                  <span className="text-white font-medium">{selectedOrder.productTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Data:</span>
                  <span className="text-white">{new Date(selectedOrder.date).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Valor:</span>
                  <span className="text-white">R$ {selectedOrder.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span>{getStatusBadge(selectedOrder.status)}</span>
                </div>
                <div className="border-t border-gray-700 pt-4 mt-4">
                  <h4 className="text-white font-medium mb-2">Dados de acesso</h4>
                  <div className={`${glassStyles.className} p-3 rounded-lg text-sm`}>
                    <div className="mb-1">
                      <span className="text-gray-400">Username:</span>
                      <span className="text-white ml-2">user_{selectedOrder.id}@fbflix.com</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Senha:</span>
                      <span className="text-white ml-2">********</span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button 
                      onClick={() => handleDownload(selectedOrder.id)}
                      className="bg-primary hover:bg-red-700"
                    >
                      Download Dados
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <ThemeToggle />
    </div>
  );
}

export default OrdersPage;
