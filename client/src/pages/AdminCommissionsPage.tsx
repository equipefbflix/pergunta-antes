import { useState } from "react";
import { useGlassmorphism } from "@/hooks/useGlassmorphism";
import Sidebar from "@/components/layout/Sidebar";
import { commissions } from "@/mocks/data";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Avatar, 
  AvatarFallback 
} from "@/components/ui/avatar";
import {
  Bell,
  Menu,
  Search,
  HandCoins,
  Copy,
  Eye,
  Wallet,
  CheckCircle,
  DollarSign,
  AlertCircle,
  Info,
  XCircle
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Commission, CommissionStatus } from "@/types";
import { useToast } from "@/hooks/use-toast";

export function AdminCommissionsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCommission, setSelectedCommission] = useState<Commission | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedCommissions, setSelectedCommissions] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CommissionStatus | "all">("all");
  
  const glassStyles = useGlassmorphism();
  const { toast } = useToast();

  // Calcular totais
  const totalCommissions = commissions.reduce((sum, commission) => sum + commission.commissionAmount, 0);
  const pendingCommissions = commissions
    .filter(commission => commission.status === 'pending')
    .reduce((sum, commission) => sum + commission.commissionAmount, 0);
  const paidCommissions = commissions
    .filter(commission => commission.status === 'paid')
    .reduce((sum, commission) => sum + commission.commissionAmount, 0);

  // Formatação de valores e datas
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(value);
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy HH:mm", { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  // Status badge
  const getStatusBadge = (status: CommissionStatus) => {
    switch (status) {
      case 'pending':
        return (
          <Badge className="uppercase bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
            Saldo a Receber
          </Badge>
        );
      case 'paid':
        return (
          <Badge className="uppercase bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            Pago
          </Badge>
        );
      case 'canceled':
        return (
          <Badge className="uppercase bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
            Cancelado
          </Badge>
        );
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  // Funções para lidar com seleção de comissões
  const toggleCommissionSelection = (id: number) => {
    setSelectedCommissions(prev => 
      prev.includes(id) 
        ? prev.filter(commissionId => commissionId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedCommissions.length === filteredCommissions.length) {
      setSelectedCommissions([]);
    } else {
      setSelectedCommissions(filteredCommissions.map(commission => commission.id));
    }
  };

  // Funções para manipular comissões
  const handleViewDetails = (commission: Commission) => {
    setSelectedCommission(commission);
    setDetailsOpen(true);
  };

  const handleCopyPaymentId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast({
      title: "ID copiado",
      description: "O ID do pagamento foi copiado para a área de transferência."
    });
  };

  const handlePayCommissions = () => {
    // Em uma aplicação real, isso processaria o pagamento das comissões selecionadas
    toast({
      title: "Comissões pagas",
      description: `${selectedCommissions.length} comissões foram marcadas como pagas.`
    });
    setSelectedCommissions([]);
  };

  // Filtragem de comissões
  const filteredCommissions = commissions.filter(commission => {
    const matchesQuery = searchQuery === "" || 
      commission.affiliateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      commission.affiliateEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      commission.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      commission.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      commission.paymentId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || commission.status === statusFilter;
    
    return matchesQuery && matchesStatus;
  });
  
  // Ordenar comissões da mais recente para a mais antiga
  const sortedCommissions = [...filteredCommissions].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

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
                <HandCoins className="text-primary h-5 w-5 mr-2" />
                <h1 className="text-white font-medium">Comissões</h1>
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
            <h1 className="text-2xl font-bold text-white">Comissões</h1>
            <p className="text-sm text-gray-400">
              Gestão de comissões de afiliados para pagamentos da plataforma
            </p>
          </div>

          {/* Cards de estatísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card className="bg-indigo-600 border-0">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-indigo-100">Total</p>
                    <h2 className="text-2xl font-bold text-white mt-1">
                      {formatCurrency(totalCommissions)}
                    </h2>
                  </div>
                  <div className="h-10 w-10 bg-indigo-500 rounded-full flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-amber-500 border-0">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-amber-100">Saldo a Receber</p>
                    <h2 className="text-2xl font-bold text-white mt-1">
                      {formatCurrency(pendingCommissions)}
                    </h2>
                  </div>
                  <div className="h-10 w-10 bg-amber-400 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-green-600 border-0">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-green-100">Paid</p>
                    <h2 className="text-2xl font-bold text-white mt-1">
                      {formatCurrency(paidCommissions)}
                    </h2>
                  </div>
                  <div className="h-10 w-10 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Botão de pagar selecionados */}
          {selectedCommissions.length > 0 && (
            <div className="bg-gray-800/60 p-4 rounded-lg mb-6 flex justify-between items-center">
              <div className="text-white">
                <span className="font-medium">{selectedCommissions.length}</span> comissões selecionadas
              </div>
              <Button 
                onClick={handlePayCommissions}
                className="bg-green-600 hover:bg-green-700"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Pagar Selecionadas
              </Button>
            </div>
          )}

          {/* Ferramentas e Filtros */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Buscar por afiliado, usuário ou ID de pagamento..."
                className="pl-10 bg-gray-900 border-gray-700 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Tabs 
              defaultValue="all" 
              className="w-full md:w-auto"
              onValueChange={(value) => setStatusFilter(value as CommissionStatus | "all")}
            >
              <TabsContent value="all" className="mt-0"></TabsContent>
              <TabsContent value="pending" className="mt-0"></TabsContent>
              <TabsContent value="paid" className="mt-0"></TabsContent>
              <TabsContent value="canceled" className="mt-0"></TabsContent>
              
              <TabsList className="w-full md:w-auto bg-gray-900 border-gray-700">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="pending">Saldo a Receber</TabsTrigger>
                <TabsTrigger value="paid">Pago</TabsTrigger>
                <TabsTrigger value="canceled">Cancelado</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Tabela de Comissões */}
          <div className={`${glassStyles.className} rounded-xl overflow-hidden`}>
            {sortedCommissions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">
                  Nenhuma comissão encontrada com os filtros atuais.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox 
                          checked={
                            filteredCommissions.length > 0 && 
                            selectedCommissions.length === filteredCommissions.length
                          }
                          onCheckedChange={toggleSelectAll}
                          aria-label="Selecionar todas as comissões"
                        />
                      </TableHead>
                      <TableHead className="text-white">Status</TableHead>
                      <TableHead className="text-white">Afiliado</TableHead>
                      <TableHead className="text-white">Usuário</TableHead>
                      <TableHead className="text-white">Pagamento</TableHead>
                      <TableHead className="text-white">Commission Percent</TableHead>
                      <TableHead className="text-white">Commission</TableHead>
                      <TableHead className="text-white">Pago em</TableHead>
                      <TableHead className="text-white text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedCommissions.map((commission) => (
                      <TableRow key={commission.id}>
                        <TableCell>
                          <Checkbox 
                            checked={selectedCommissions.includes(commission.id)}
                            onCheckedChange={() => toggleCommissionSelection(commission.id)}
                            aria-label={`Selecionar comissão ${commission.id}`}
                          />
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(commission.status)}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          <div>
                            <div className="font-medium">{commission.affiliateName}</div>
                            <div className="text-xs text-gray-400">{commission.affiliateEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          <div>
                            <div className="font-medium">{commission.userName}</div>
                            <div className="text-xs text-gray-400">{commission.userEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          <div>
                            <div className="font-medium">
                              {formatCurrency(commission.paymentAmount)}
                            </div>
                            <div className="flex items-center text-xs text-gray-400">
                              <span className="truncate max-w-[100px]" title={commission.paymentId}>
                                {commission.paymentId}
                              </span>
                              <button 
                                onClick={() => handleCopyPaymentId(commission.paymentId)}
                                className="ml-1 text-gray-400 hover:text-gray-300"
                              >
                                <Copy className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {commission.commissionPercentage}%
                        </TableCell>
                        <TableCell className="text-gray-300 font-medium">
                          {formatCurrency(commission.commissionAmount)}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {formatDate(commission.paidAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="text-gray-400 hover:text-white hover:bg-gray-800"
                            onClick={() => handleViewDetails(commission)}
                          >
                            <Eye className="h-4 w-4" />
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
      
      {/* Modal de Detalhes da Comissão */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className={`${glassStyles.className} max-w-lg mx-auto p-0 border-0 text-white`}>
          {selectedCommission && (
            <div>
              <DialogHeader className="p-6 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-xl font-bold text-white">
                    Detalhes da Comissão
                  </DialogTitle>
                  {getStatusBadge(selectedCommission.status)}
                </div>
                <DialogDescription className="text-gray-400 mt-1">
                  ID: {selectedCommission.id}
                </DialogDescription>
              </DialogHeader>
              
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white flex items-center">
                    <HandCoins className="h-5 w-5 mr-2 text-primary" />
                    Informações da Comissão
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 bg-gray-800/60 p-4 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-400">Valor da Comissão</p>
                      <p className="text-white font-medium">
                        {formatCurrency(selectedCommission.commissionAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Percentual</p>
                      <p className="text-white font-medium">
                        {selectedCommission.commissionPercentage}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Data de Criação</p>
                      <p className="text-white">
                        {formatDate(selectedCommission.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Data de Pagamento</p>
                      <p className="text-white">
                        {formatDate(selectedCommission.paidAt)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-primary" />
                    Detalhes do Pagamento
                  </h3>
                  
                  <div className="bg-gray-800/60 p-4 rounded-lg">
                    <div className="mb-3">
                      <p className="text-sm text-gray-400">ID do Pagamento</p>
                      <div className="flex items-center">
                        <p className="text-white font-mono text-sm mr-2">
                          {selectedCommission.paymentId}
                        </p>
                        <button 
                          onClick={() => handleCopyPaymentId(selectedCommission.paymentId)}
                          className="text-gray-400 hover:text-gray-300"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="text-sm text-gray-400">Valor do Pagamento</p>
                      <p className="text-white font-medium">
                        {formatCurrency(selectedCommission.paymentAmount)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white flex items-center">
                    <Info className="h-5 w-5 mr-2 text-primary" />
                    Informações do Afiliado e Cliente
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800/60 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Afiliado</h4>
                      <p className="font-medium text-white">
                        {selectedCommission.affiliateName}
                      </p>
                      <p className="text-sm text-gray-400">
                        {selectedCommission.affiliateEmail}
                      </p>
                    </div>
                    
                    <div className="bg-gray-800/60 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Cliente</h4>
                      <p className="font-medium text-white">
                        {selectedCommission.userName}
                      </p>
                      <p className="text-sm text-gray-400">
                        {selectedCommission.userEmail}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="p-6 border-t border-gray-800">
                {selectedCommission.status === 'pending' && (
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      // Em uma aplicação real, isso processaria o pagamento da comissão
                      toast({
                        title: "Comissão paga",
                        description: `A comissão para ${selectedCommission.affiliateName} foi marcada como paga.`
                      });
                      setDetailsOpen(false);
                    }}
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Marcar como Pago
                  </Button>
                )}
                
                {selectedCommission.status === 'pending' && (
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      // Em uma aplicação real, isso cancelaria a comissão
                      toast({
                        title: "Comissão cancelada",
                        description: `A comissão para ${selectedCommission.affiliateName} foi cancelada.`
                      });
                      setDetailsOpen(false);
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancelar Comissão
                  </Button>
                )}
                
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

export default AdminCommissionsPage;