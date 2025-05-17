import { useState } from "react";
import { useGlassmorphism } from "@/hooks/useGlassmorphism";
import Sidebar from "@/components/layout/Sidebar";
import { payments } from "@/mocks/data";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  Menu, 
  Search, 
  CreditCard,
  DollarSign,
  Copy,
  Eye
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { Payment, PaymentGateway, PaymentStatus } from "@/types";

export function AdminPaymentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "all">("all");
  const [gatewayFilter, setGatewayFilter] = useState<PaymentGateway | "all">("all");
  
  const glassStyles = useGlassmorphism();
  const { toast } = useToast();

  // Função para formatar a data
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy HH:mm", { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  // Função para formatar número de documento (CPF/CNPJ)
  const formatDocument = (doc: string, type: 'cpf' | 'cnpj') => {
    if (type === 'cpf') {
      return doc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    } else {
      return doc.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    }
  };

  // Função para pegar a badge de status
  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Sucesso</Badge>;
      case 'waiting':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">Esperando</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Expirado</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">Desconhecido</Badge>;
    }
  };

  // Função para pegar o nome do gateway
  const getGatewayName = (gateway: PaymentGateway) => {
    switch (gateway) {
      case 'openpix':
        return "OpenPix";
      case 'mercadopago':
        return "MercadoPago";
      default:
        return "Outro";
    }
  };

  // Função para lidar com a visualização de detalhes
  const handleViewDetails = (paymentId: string) => {
    setSelectedPaymentId(paymentId);
    setDetailsOpen(true);
  };

  // Função para copiar ID do pagamento
  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast({
      title: "ID copiado",
      description: "O ID do pagamento foi copiado para a área de transferência."
    });
  };

  // Filtragem de pagamentos
  const filteredPayments = payments.filter(payment => {
    const matchesQuery = searchQuery === "" || 
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.payerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.payerDocument.includes(searchQuery);
    
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    const matchesGateway = gatewayFilter === "all" || payment.gateway === gatewayFilter;
    
    return matchesQuery && matchesStatus && matchesGateway;
  });

  // Ordenar pagamentos do mais recente para o mais antigo
  const sortedPayments = [...filteredPayments].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const selectedPayment = payments.find(payment => payment.id === selectedPaymentId);

  // Contadores para o painel de resumo
  const totalSuccess = payments.filter(p => p.status === 'success').length;
  const totalWaiting = payments.filter(p => p.status === 'waiting').length;
  const totalExpired = payments.filter(p => p.status === 'expired').length;
  const totalAmount = payments
    .filter(p => p.status === 'success')
    .reduce((sum, payment) => sum + payment.amount, 0);

  // Contador por gateway
  const openPixTotal = payments.filter(p => p.status === 'success' && p.gateway === 'openpix').length;
  const mercadoPagoTotal = payments.filter(p => p.status === 'success' && p.gateway === 'mercadopago').length;

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
                <CreditCard className="text-primary h-5 w-5 mr-2" />
                <h1 className="text-white font-medium">Gestão Financeira</h1>
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
            <h1 className="text-2xl font-bold text-white">Pagamentos</h1>
            <p className="text-sm text-gray-400">
              Gestão de pagamentos e transações financeiras da plataforma
            </p>
          </div>

          {/* Dashboard de resumo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className={`${glassStyles.className} border-0`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total recebido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <DollarSign className="text-green-500 h-6 w-6 mr-2" />
                  <div className="text-2xl font-bold text-white">R$ {totalAmount.toFixed(2)}</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className={`${glassStyles.className} border-0`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Pagamentos com sucesso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div 
                    className="text-2xl font-bold text-white cursor-pointer"
                    onClick={() => setStatusFilter('success')}
                  >
                    {totalSuccess}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className={`${glassStyles.className} border-0`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Aguardando pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div 
                    className="text-2xl font-bold text-white cursor-pointer"
                    onClick={() => setStatusFilter('waiting')}
                  >
                    {totalWaiting}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className={`${glassStyles.className} border-0`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Expirados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div 
                    className="text-2xl font-bold text-white cursor-pointer"
                    onClick={() => setStatusFilter('expired')}
                  >
                    {totalExpired}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ferramentas e Filtros */}
          <div className="mb-6">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Buscar por ID, cliente, e-mail ou documento..."
                className="pl-10 bg-gray-900 border-gray-700 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Tabs 
                defaultValue="all" 
                className="w-full"
                onValueChange={(value) => setStatusFilter(value as PaymentStatus | "all")}
              >
                <TabsList className="w-full bg-gray-900 border-gray-700">
                  <TabsTrigger value="all" className="flex-1">Todos</TabsTrigger>
                  <TabsTrigger value="success" className="flex-1">Sucesso</TabsTrigger>
                  <TabsTrigger value="waiting" className="flex-1">Esperando</TabsTrigger>
                  <TabsTrigger value="expired" className="flex-1">Expirado</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Tabs 
                defaultValue="all" 
                className="w-full"
                onValueChange={(value) => setGatewayFilter(value as PaymentGateway | "all")}
              >
                <TabsContent value="all" className="mt-0"></TabsContent>
                <TabsContent value="openpix" className="mt-0"></TabsContent>
                <TabsContent value="mercadopago" className="mt-0"></TabsContent>
                
                <TabsList className="w-full bg-gray-900 border-gray-700">
                  <TabsTrigger value="all" className="flex-1">Todos</TabsTrigger>
                  <TabsTrigger value="openpix" className="flex-1">OpenPix ({openPixTotal})</TabsTrigger>
                  <TabsTrigger value="mercadopago" className="flex-1">MercadoPago ({mercadoPagoTotal})</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          {/* Tabela de Pagamentos */}
          <div className={`${glassStyles.className} rounded-xl overflow-hidden`}>
            {sortedPayments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">
                  Nenhum pagamento encontrado com os filtros atuais.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-white">Status</TableHead>
                      <TableHead className="text-white">Valor</TableHead>
                      <TableHead className="text-white">ID</TableHead>
                      <TableHead className="text-white">Usuário</TableHead>
                      <TableHead className="text-white">Pagador</TableHead>
                      <TableHead className="text-white">Criado em</TableHead>
                      <TableHead className="text-white">Pago em</TableHead>
                      <TableHead className="text-white">Cashback</TableHead>
                      <TableHead className="text-white text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          {getStatusBadge(payment.status)}
                        </TableCell>
                        <TableCell className="font-medium text-white">
                          R$ {payment.amount.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          <div className="flex items-center max-w-[100px] truncate">
                            <span className="truncate text-xs" title={payment.id}>
                              {payment.id}
                            </span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="ml-1 p-0 h-auto" 
                              onClick={() => handleCopyId(payment.id)}
                            >
                              <Copy className="h-3 w-3 text-gray-400" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          <div>
                            <div className="font-medium">{payment.userName}</div>
                            <div className="text-xs text-gray-400">{payment.userEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          <div>
                            <div className="font-medium">{payment.payerName}</div>
                            <div className="text-xs text-gray-400">
                              {formatDocument(payment.payerDocument, payment.payerDocumentType)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300 whitespace-nowrap">
                          {formatDate(payment.createdAt)}
                        </TableCell>
                        <TableCell className="text-gray-300 whitespace-nowrap">
                          {formatDate(payment.paidAt)}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {payment.coupon && (
                            <div>
                              <div className="text-xs">{`Cupom ${payment.coupon}`}</div>
                              {payment.cashback && (
                                <div className="text-xs text-gray-400">
                                  {`Cashback R$ ${payment.cashback.toFixed(2)}`}
                                </div>
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-gray-700 text-white hover:bg-gray-800"
                            onClick={() => handleViewDetails(payment.id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
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
      
      {/* Modal de Detalhes do Pagamento */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className={`${glassStyles.className} max-w-2xl mx-auto p-0 border-0 text-white`}>
          {selectedPayment && (
            <div>
              <DialogHeader className="p-6 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-xl font-bold text-white">
                    Detalhes do Pagamento
                  </DialogTitle>
                  <Badge className="ml-auto">
                    {getGatewayName(selectedPayment.gateway)}
                  </Badge>
                </div>
                <DialogDescription className="text-gray-400 mt-1">
                  Informações completas sobre a transação
                </DialogDescription>
              </DialogHeader>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informações do pagamento */}
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md text-white">Pagamento</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span>{getStatusBadge(selectedPayment.status)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">ID da transação:</span>
                      <div className="flex items-center">
                        <span className="text-white text-xs max-w-[140px] truncate mr-1" title={selectedPayment.id}>
                          {selectedPayment.id}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-0 h-auto" 
                          onClick={() => handleCopyId(selectedPayment.id)}
                        >
                          <Copy className="h-3 w-3 text-gray-400" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Gateway:</span>
                      <span className="text-white">{getGatewayName(selectedPayment.gateway)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Valor:</span>
                      <span className="text-white">R$ {selectedPayment.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Criado em:</span>
                      <span className="text-white">{formatDate(selectedPayment.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Pago em:</span>
                      <span className="text-white">{formatDate(selectedPayment.paidAt)}</span>
                    </div>
                    {selectedPayment.coupon && (
                      <>
                        <div className="pt-2 border-t border-gray-800"></div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Cupom:</span>
                          <span className="text-white">{selectedPayment.coupon}</span>
                        </div>
                        {selectedPayment.couponPercentage && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Desconto:</span>
                            <span className="text-white">{selectedPayment.couponPercentage}%</span>
                          </div>
                        )}
                        {selectedPayment.cashback && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Cashback:</span>
                            <span className="text-white">R$ {selectedPayment.cashback.toFixed(2)}</span>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Informações do pagador */}
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md text-white">Pagador</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Nome:</span>
                      <span className="text-white">{selectedPayment.payerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Documento:</span>
                      <span className="text-white">
                        {formatDocument(selectedPayment.payerDocument, selectedPayment.payerDocumentType)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tipo:</span>
                      <span className="text-white">{selectedPayment.payerDocumentType.toUpperCase()}</span>
                    </div>
                    {selectedPayment.company && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Empresa:</span>
                        <span className="text-white">{selectedPayment.company}</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-gray-800"></div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Cliente:</span>
                      <span className="text-white">{selectedPayment.userName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">E-mail:</span>
                      <span className="text-white">{selectedPayment.userEmail}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <DialogFooter className="p-6 border-t border-gray-800">
                <Button 
                  variant="outline" 
                  className="border-gray-700 text-white hover:bg-gray-800"
                  onClick={() => setDetailsOpen(false)}
                >
                  Fechar
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminPaymentsPage;