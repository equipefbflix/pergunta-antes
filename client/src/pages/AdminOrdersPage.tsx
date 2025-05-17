import { useState } from "react";
import { useGlassmorphism } from "@/hooks/useGlassmorphism";
import Sidebar from "@/components/layout/Sidebar";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Bell,
  ChevronDown,
  ClipboardCopy,
  Database,
  Download,
  ExternalLink,
  FileText,
  Filter,
  Info,
  Link2,
  Menu,
  Search,
  ShoppingCart,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { OrderStatus, Order } from "@/types";

export function AdminOrdersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const glassStyles = useGlassmorphism();
  const { toast } = useToast();

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy HH:mm", { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  // Função para pegar a badge de status
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Concluído</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">Pendente</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Falhou</Badge>;
      case 'canceled':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">Cancelado</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">Processando</Badge>;
    }
  };

  // Função para lidar com a visualização de detalhes
  const handleViewDetails = (orderId: number) => {
    setSelectedOrderId(orderId);
    setDetailsOpen(true);
  };

  // Função para copiar os detalhes do pedido
  const handleCopyOrderDetails = (order: Order) => {
    const orderDetails = `
Fatura: ${order.invoiceNumber}
Cliente: ${order.userName} (${order.userEmail})
Produto: ${order.productTitle}
Valor: R$ ${order.price.toFixed(2)}
Status: ${order.status}
Data: ${formatDate(order.date)}
    `;
    navigator.clipboard.writeText(orderDetails.trim());
    toast({
      title: "Informações copiadas",
      description: "Os detalhes do pedido foram copiados para a área de transferência.",
    });
  };

  // Função para baixar o arquivo
  const handleDownload = (content: any) => {
    // Em uma aplicação real, isso faria download do arquivo
    toast({
      title: "Arquivo baixado",
      description: `O arquivo ${content.fileName || 'do pedido'} foi baixado com sucesso.`,
    });
  };

  // Função para copiar o link
  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copiado",
      description: "O link foi copiado para a área de transferência.",
    });
  };

  // Filtragem de pedidos
  const filteredOrders = orders.filter(order => {
    const matchesQuery = searchQuery === "" || 
      order.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.productTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.userEmail && order.userEmail.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesQuery && matchesStatus;
  });

  // Ordenar pedidos do mais recente para o mais antigo
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const selectedOrder = orders.find(order => order.id === selectedOrderId);

  return (
    <div className="flex h-screen overflow-hidden bg-background relative">
      {/* Background gradient effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-40">
        <div className="absolute top-10 right-20 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply blur-[80px] opacity-30"></div>
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply blur-[80px] opacity-20"></div>
      </div>
      
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <header className={`${glassStyles.className} sticky top-0 z-10 border-b border-gray-800`}>
          <div className="px-6 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <button 
                className="md:hidden text-gray-400 mr-3"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="flex items-center">
                <ShoppingCart className="text-primary h-5 w-5 mr-2" />
                <h1 className="text-white font-medium">Gerenciamento de Pedidos</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="relative">
                  <Bell className="text-gray-400 h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    3
                  </span>
                </button>
              </div>
              <div>
                <Avatar className="h-8 w-8 bg-primary/10">
                  <AvatarFallback className="text-primary">AD</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </header>
        
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">Pedidos</h1>
            <p className="text-sm text-gray-400">
              Gerencie e visualize todos os pedidos feitos na plataforma
            </p>
          </div>

          {/* Ferramentas e Filtros */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Buscar por fatura, produto ou cliente..."
                className="pl-10 bg-gray-900 border-gray-700 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-gray-900 border-gray-700 text-white">
                  <Filter className="h-4 w-4 mr-2" />
                  Status
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-900 border-gray-700 text-white">
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                  Todos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("completed")}>
                  Concluídos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                  Pendentes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("failed")}>
                  Falhos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("canceled")}>
                  Cancelados
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Tabela de Pedidos */}
          <div className={`${glassStyles.className} rounded-xl overflow-hidden`}>
            {sortedOrders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">
                  Nenhum pedido encontrado com os filtros atuais.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-white">Fatura</TableHead>
                      <TableHead className="text-white">Produto</TableHead>
                      <TableHead className="text-white">Usuário</TableHead>
                      <TableHead className="text-white">Data</TableHead>
                      <TableHead className="text-white">Valor</TableHead>
                      <TableHead className="text-white">Status</TableHead>
                      <TableHead className="text-white text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium text-white">
                          <div className="flex items-center">
                            {order.invoiceNumber || `#${order.id}`}
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="ml-2 p-0 h-auto" 
                              onClick={() => handleCopyOrderDetails(order)}
                            >
                              <ClipboardCopy className="h-3.5 w-3.5 text-gray-400" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          <div className="max-w-[250px] truncate" title={order.productTitle}>
                            {order.productTitle}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2 bg-primary/20">
                              <AvatarFallback className="text-primary text-xs">
                                {order.userInitials}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{order.userName}</div>
                              <div className="text-xs text-gray-400">{order.userEmail}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          <div className="whitespace-nowrap">
                            {formatDate(order.date)}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          R$ {order.price.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(order.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-gray-700 text-white hover:bg-gray-800"
                            onClick={() => handleViewDetails(order.id)}
                          >
                            <Info className="h-4 w-4 mr-1" />
                            Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </main>
      </div>
      
      {/* Modal de Detalhes do Pedido */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className={`${glassStyles.className} max-w-2xl mx-auto p-0 border-0 text-white`}>
          {selectedOrder && (
            <div>
              <DialogHeader className="p-6 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-xl font-bold text-white">
                    Detalhes do Pedido
                  </DialogTitle>
                  <Badge className="ml-auto">{selectedOrder.invoiceNumber}</Badge>
                </div>
                <DialogDescription className="text-gray-400 mt-1">
                  Informações completas sobre a transação
                </DialogDescription>
              </DialogHeader>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informações do Cliente */}
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md text-white">Cliente</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center mb-4">
                      <Avatar className="h-10 w-10 mr-3 bg-primary/20">
                        <AvatarFallback className="text-primary">
                          {selectedOrder.userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-white">{selectedOrder.userName}</div>
                        <div className="text-sm text-gray-400">{selectedOrder.userEmail}</div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">ID Cliente:</span>
                        <span className="text-white">{selectedOrder.userId}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Detalhes do Pagamento */}
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md text-white">Pagamento</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Preço unitário:</span>
                      <span className="text-white">R$ {selectedOrder.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Quantidade:</span>
                      <span className="text-white">{selectedOrder.quantity || 1}</span>
                    </div>
                    {selectedOrder.discount && selectedOrder.discount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Desconto:</span>
                        <span className="text-white">{selectedOrder.discount}%</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-gray-800 font-medium">
                      <span className="text-gray-400">Total:</span>
                      <span className="text-white">
                        R$ {(selectedOrder.price * (selectedOrder.quantity || 1) * (1 - (selectedOrder.discount || 0) / 100)).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-gray-400">Status:</span>
                      <span>{getStatusBadge(selectedOrder.status)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Data:</span>
                      <span className="text-white">{formatDate(selectedOrder.date)}</span>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Detalhes do Produto */}
                <Card className="bg-gray-900/50 border-gray-800 md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md text-white">Produto</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <h4 className="font-medium text-white mb-1">{selectedOrder.productTitle}</h4>
                    </div>
                    
                    {selectedOrder.contents && selectedOrder.contents.length > 0 ? (
                      <div className="mt-4">
                        <h4 className="text-white font-medium mb-3">Conteúdo</h4>
                        <div className="space-y-3">
                          {selectedOrder.contents.map((content) => (
                            <div 
                              key={content.id} 
                              className="bg-gray-800/60 p-3 rounded-lg flex items-center justify-between"
                            >
                              <div className="flex items-center">
                                {content.type === 'file' ? (
                                  <FileText className="text-primary h-4 w-4 mr-2" />
                                ) : (
                                  <Link2 className="text-blue-400 h-4 w-4 mr-2" />
                                )}
                                <span className="text-sm text-gray-300">
                                  {content.type === 'file' 
                                    ? content.fileName || 'Arquivo' 
                                    : 'Link de acesso'}
                                </span>
                              </div>
                              <div className="flex gap-2">
                                {content.type === 'file' ? (
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="h-8 border-gray-700 text-white hover:bg-gray-800"
                                    onClick={() => handleDownload(content)}
                                  >
                                    <Download className="h-3.5 w-3.5 mr-1" />
                                    <span className="text-xs">Baixar</span>
                                  </Button>
                                ) : (
                                  <>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="h-8 border-gray-700 text-white hover:bg-gray-800"
                                      onClick={() => handleCopyLink(content.content)}
                                    >
                                      <ClipboardCopy className="h-3.5 w-3.5 mr-1" />
                                      <span className="text-xs">Copiar</span>
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="h-8 border-gray-700 text-white hover:bg-gray-800"
                                      onClick={() => window.open(content.content, '_blank')}
                                    >
                                      <ExternalLink className="h-3.5 w-3.5 mr-1" />
                                      <span className="text-xs">Abrir</span>
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400 italic">
                        Nenhum conteúdo disponível para este pedido.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminOrdersPage;