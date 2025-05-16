import { useState, useEffect } from "react";
import { useGlassmorphism } from "@/hooks/useGlassmorphism";
import ThemeToggle from "@/components/layout/ThemeToggle";
import Sidebar from "@/components/layout/Sidebar";
import { 
  Calendar, 
  CopyIcon, 
  RefreshCw, 
  Search, 
  Menu, 
  MessageSquare, 
  CheckCircle2, 
  RotateCw, 
  ArrowDownUp, 
  CircleOff, 
  AlertCircle, 
  Network,
  Plus,
  Download,
  FileText,
  ClipboardCopy
} from "lucide-react";
import { proxies } from "@/mocks/data";
import { Proxy, ProxyStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, isTomorrow, isToday, parseISO, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale";

export function ProxyPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const glassStyles = useGlassmorphism();
  const [proxyList, setProxyList] = useState<Proxy[]>(proxies);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProxyStatus | "all">("all");
  const [renewalFilter, setRenewalFilter] = useState<boolean | null>(null);
  const [expirationFilter, setExpirationFilter] = useState<"today" | "tomorrow" | "all">("all");
  const [showRenewDialog, setShowRenewDialog] = useState(false);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [selectedProxy, setSelectedProxy] = useState<Proxy | null>(null);
  const [proxyNote, setProxyNote] = useState("");

  // Stats
  const activeProxies = proxyList.filter(proxy => proxy.status === 'active').length;
  const expiringTodayProxies = proxyList.filter(proxy => 
    proxy.status === 'active' && isToday(parseISO(proxy.expirationDate))
  ).length;
  const expiredProxies = proxyList.filter(proxy => proxy.status === 'expired').length;
  const cancelledProxies = proxyList.filter(proxy => proxy.status === 'cancelled').length;

  // Filtered proxies
  const filteredProxies = proxyList.filter(proxy => {
    const matchesSearch = (
      proxy.ipAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proxy.profileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${proxy.ipAddress}:${proxy.port}:${proxy.username}:${proxy.password}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesStatus = statusFilter === "all" || proxy.status === statusFilter;

    const matchesRenewal = renewalFilter === null || proxy.autoRenewal === renewalFilter;

    let matchesExpiration = true;
    if (expirationFilter === "today") {
      matchesExpiration = isToday(parseISO(proxy.expirationDate));
    } else if (expirationFilter === "tomorrow") {
      matchesExpiration = isTomorrow(parseISO(proxy.expirationDate));
    }

    return matchesSearch && matchesStatus && matchesRenewal && matchesExpiration;
  });

  const handleToggleAutoRenewal = (proxyId: number) => {
    const updatedProxies = proxyList.map(proxy => 
      proxy.id === proxyId ? { ...proxy, autoRenewal: !proxy.autoRenewal } : proxy
    );
    setProxyList(updatedProxies);
    
    const proxy = updatedProxies.find(p => p.id === proxyId);
    toast({
      title: proxy?.autoRenewal ? "Renovação automática ativada" : "Renovação automática desativada",
      description: `A renovação automática para o proxy ${proxy?.ipAddress} foi ${proxy?.autoRenewal ? "ativada" : "desativada"}.`,
    });
  };

  const handleRenewProxy = () => {
    if (!selectedProxy) return;

    // Set new expiration date to 30 days from now
    const newExpirationDate = new Date();
    newExpirationDate.setDate(newExpirationDate.getDate() + 30);

    const updatedProxies = proxyList.map(proxy => 
      proxy.id === selectedProxy.id
        ? { 
            ...proxy, 
            status: 'active' as ProxyStatus, 
            expirationDate: newExpirationDate.toISOString() 
          }
        : proxy
    );

    setProxyList(updatedProxies);
    setShowRenewDialog(false);

    toast({
      title: "Proxy renovado",
      description: `O proxy ${selectedProxy.ipAddress} foi renovado por mais 30 dias.`,
    });
  };

  const handleSaveNote = () => {
    if (!selectedProxy) return;

    const updatedProxies = proxyList.map(proxy => 
      proxy.id === selectedProxy.id
        ? { ...proxy, note: proxyNote }
        : proxy
    );

    setProxyList(updatedProxies);
    setShowNoteDialog(false);

    toast({
      title: "Nota salva",
      description: "A nota foi salva com sucesso.",
    });
  };

  const handleCopyProxy = (proxy: Proxy) => {
    const proxyString = `${proxy.ipAddress}:${proxy.port}:${proxy.username}:${proxy.password}`;
    navigator.clipboard.writeText(proxyString);
    
    toast({
      title: "Proxy copiado",
      description: "Os detalhes do proxy foram copiados para a área de transferência.",
    });
  };

  const handleSwapProxy = (proxy: Proxy) => {
    // In a real app, this would request a new proxy from the server
    // Here, we'll just simulate by changing the IP
    const newIp = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    
    const updatedProxies = proxyList.map(p => 
      p.id === proxy.id
        ? { ...p, ipAddress: newIp }
        : p
    );

    setProxyList(updatedProxies);
    
    toast({
      title: "Proxy substituído",
      description: `O proxy foi substituído por um novo IP: ${newIp}.`,
    });
  };

  const renderStatusBadge = (status: ProxyStatus) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-green-600/70 hover:bg-green-600">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            Ativo
          </Badge>
        );
      case 'expired':
        return (
          <Badge className="bg-amber-600/70 hover:bg-amber-600">
            <AlertCircle className="w-3.5 h-3.5 mr-1" />
            Vencido
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge className="bg-red-600/70 hover:bg-red-600">
            <CircleOff className="w-3.5 h-3.5 mr-1" />
            Cancelado
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-600/70">
            Desconhecido
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };

  // Effects
  useEffect(() => {
    // If status filter is clicked from stat cards, ensure all other filters are reset
    if (statusFilter !== "all") {
      setRenewalFilter(null);
      setExpirationFilter("all");
      setSearchTerm("");
    }
  }, [statusFilter]);

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
                <Network className="text-primary h-5 w-5 mr-2" />
                <h1 className="text-white font-medium">Proxy</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="px-6 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {/* Active Proxies */}
            <button
              onClick={() => setStatusFilter(statusFilter === 'active' ? 'all' : 'active')}
              className={`${glassStyles.className} p-5 rounded-xl border ${statusFilter === 'active' ? 'border-primary/50' : 'border-gray-700/30'} transition-all duration-200 hover:border-primary/30 group`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm">Proxies Ativos</p>
                  <h3 className="text-2xl font-bold text-white mt-2">{activeProxies}</h3>
                </div>
                <div className="bg-green-900/30 p-2 rounded-full">
                  <CheckCircle2 className="text-green-400 h-5 w-5" />
                </div>
              </div>
            </button>

            {/* Expiring Today */}
            <button
              onClick={() => {
                setStatusFilter('active');
                setExpirationFilter(expirationFilter === 'today' ? 'all' : 'today');
              }}
              className={`${glassStyles.className} p-5 rounded-xl border ${expirationFilter === 'today' ? 'border-primary/50' : 'border-gray-700/30'} transition-all duration-200 hover:border-primary/30 group`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm">Para renovar hoje</p>
                  <h3 className="text-2xl font-bold text-white mt-2">{expiringTodayProxies}</h3>
                </div>
                <div className="bg-amber-900/30 p-2 rounded-full">
                  <Calendar className="text-amber-400 h-5 w-5" />
                </div>
              </div>
            </button>

            {/* Expired */}
            <button
              onClick={() => setStatusFilter(statusFilter === 'expired' ? 'all' : 'expired')}
              className={`${glassStyles.className} p-5 rounded-xl border ${statusFilter === 'expired' ? 'border-primary/50' : 'border-gray-700/30'} transition-all duration-200 hover:border-primary/30 group`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm">Vencidos</p>
                  <h3 className="text-2xl font-bold text-white mt-2">{expiredProxies}</h3>
                </div>
                <div className="bg-amber-900/30 p-2 rounded-full">
                  <AlertCircle className="text-amber-400 h-5 w-5" />
                </div>
              </div>
            </button>

            {/* Cancelled */}
            <button
              onClick={() => setStatusFilter(statusFilter === 'cancelled' ? 'all' : 'cancelled')}
              className={`${glassStyles.className} p-5 rounded-xl border ${statusFilter === 'cancelled' ? 'border-primary/50' : 'border-gray-700/30'} transition-all duration-200 hover:border-primary/30 group`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm">Cancelados</p>
                  <h3 className="text-2xl font-bold text-white mt-2">{cancelledProxies}</h3>
                </div>
                <div className="bg-red-900/30 p-2 rounded-full">
                  <CircleOff className="text-red-400 h-5 w-5" />
                </div>
              </div>
            </button>
          </div>

          {/* Search and Filters */}
          <div className={`${glassStyles.className} p-4 rounded-lg mb-6 border border-gray-800`}>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative flex-grow max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por IP, perfil ou formato completo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-background/50 border-gray-700"
                />
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="auto-renewal" className="text-gray-300">Auto-renovação:</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="bg-background/50 border-gray-700">
                      {renewalFilter === null ? 'Todos' : 
                       renewalFilter ? 'Ativada' : 'Desativada'}
                      <ArrowDownUp className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setRenewalFilter(null)}>
                      Todos
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setRenewalFilter(true)}>
                      Ativada
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setRenewalFilter(false)}>
                      Desativada
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="expiration" className="text-gray-300">Vencimento:</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="bg-background/50 border-gray-700">
                      {expirationFilter === 'all' ? 'Todos' : 
                       expirationFilter === 'today' ? 'Hoje' : 'Amanhã'}
                      <Calendar className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setExpirationFilter('all')}>
                      Todos
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setExpirationFilter('today')}>
                      Hoje
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setExpirationFilter('tomorrow')}>
                      Amanhã
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setStatusFilter('all');
                    setRenewalFilter(null);
                    setExpirationFilter('all');
                    setSearchTerm('');
                  }}
                >
                  Limpar filtros
                </Button>
              </div>
            </div>
          </div>

          {/* Proxy Table */}
          {filteredProxies.length === 0 ? (
            <div className={`${glassStyles.className} rounded-lg p-12 text-center border border-gray-800`}>
              <Network className="h-12 w-12 mx-auto text-gray-500 mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">Nenhum proxy encontrado</h3>
              <p className="text-gray-400 mb-6">Ajuste os filtros ou limpe a busca para ver todos os proxies.</p>
              <Button
                variant="default"
                onClick={() => {
                  setStatusFilter('all');
                  setRenewalFilter(null);
                  setExpirationFilter('all');
                  setSearchTerm('');
                }}
              >
                Limpar filtros
              </Button>
            </div>
          ) : (
            <div className={`${glassStyles.className} rounded-lg overflow-hidden border border-gray-800`}>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-gray-800/50 border-gray-800">
                    <TableHead>Proxy</TableHead>
                    <TableHead>Perfil</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Renovação automática</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProxies.map((proxy) => {
                    const isExpired = proxy.status === 'expired' || 
                                      (proxy.status === 'active' && isBefore(parseISO(proxy.expirationDate), new Date()));
                    const expirationDate = parseISO(proxy.expirationDate);
                    const expirationLabel = isToday(expirationDate) 
                      ? 'Hoje' 
                      : isTomorrow(expirationDate) 
                        ? 'Amanhã' 
                        : formatDate(proxy.expirationDate);
                    
                    return (
                      <TableRow 
                        key={proxy.id}
                        className="hover:bg-gray-800/50 border-gray-800"
                      >
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center">
                                  <Network className="h-4 w-4 text-primary mr-2" />
                                  <span className="font-medium text-gray-300">
                                    {proxy.ipAddress}:{proxy.port}
                                  </span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="bottom">
                                <p>Clique no botão Copiar para obter o formato completo</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          {proxy.note && (
                            <div className="mt-1 text-xs text-gray-400 flex items-center">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              <span className="truncate w-40">{proxy.note}</span>
                            </div>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          <span className="text-gray-300">{proxy.profileName}</span>
                        </TableCell>
                        
                        <TableCell>
                          {renderStatusBadge(proxy.status)}
                        </TableCell>
                        
                        <TableCell>
                          <div className={`flex items-center ${
                            isToday(expirationDate) 
                              ? 'text-amber-400' 
                              : isExpired 
                                ? 'text-red-400' 
                                : 'text-gray-300'
                          }`}>
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{expirationLabel}</span>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <Switch
                            id={`auto-renewal-${proxy.id}`}
                            checked={proxy.autoRenewal}
                            onCheckedChange={() => handleToggleAutoRenewal(proxy.id)}
                            disabled={proxy.status === 'cancelled'}
                          />
                        </TableCell>
                        
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleCopyProxy(proxy)}
                                  >
                                    <CopyIcon className="h-4 w-4 text-gray-400" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  <p>Copiar proxy</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleSwapProxy(proxy)}
                                    disabled={proxy.status !== 'active'}
                                  >
                                    <RotateCw className="h-4 w-4 text-gray-400" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  <p>Trocar proxy</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      setSelectedProxy(proxy);
                                      setShowRenewDialog(true);
                                    }}
                                    disabled={proxy.status === 'cancelled'}
                                  >
                                    <RefreshCw className="h-4 w-4 text-gray-400" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  <p>Renovar proxy</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      setSelectedProxy(proxy);
                                      setProxyNote(proxy.note || '');
                                      setShowNoteDialog(true);
                                    }}
                                  >
                                    <MessageSquare className="h-4 w-4 text-gray-400" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  <p>Adicionar/editar nota</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </main>
      </div>

      <ThemeToggle />

      {/* Renew Dialog */}
      <Dialog open={showRenewDialog} onOpenChange={setShowRenewDialog}>
        <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle>Renovar Proxy</DialogTitle>
            <DialogDescription>
              Deseja renovar este proxy por mais 30 dias?
            </DialogDescription>
          </DialogHeader>
          
          {selectedProxy && (
            <div className="py-4">
              <div className="bg-gray-800 p-3 rounded mb-3">
                <div className="flex items-center mb-2">
                  <Network className="h-4 w-4 text-primary mr-2" />
                  <span className="font-medium text-gray-300">
                    {selectedProxy.ipAddress}:{selectedProxy.port}
                  </span>
                </div>
                <div className="text-sm text-gray-400">
                  Vencimento atual: {formatDate(selectedProxy.expirationDate)}
                </div>
                <div className="text-sm text-green-400 mt-1">
                  Novo vencimento: {format(new Date(new Date().setDate(new Date().getDate() + 30)), "dd/MM/yyyy", { locale: ptBR })}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mb-4">
                <Switch
                  id="enable-auto-renewal"
                  checked={selectedProxy.autoRenewal}
                  onCheckedChange={() => handleToggleAutoRenewal(selectedProxy.id)}
                />
                <Label htmlFor="enable-auto-renewal">Ativar renovação automática</Label>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRenewDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleRenewProxy}>
              Renovar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Note Dialog */}
      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle>Adicionar/Editar Nota</DialogTitle>
            <DialogDescription>
              Adicione uma nota para este proxy para referência futura.
            </DialogDescription>
          </DialogHeader>
          
          {selectedProxy && (
            <div className="py-4">
              <div className="mb-3 flex items-center">
                <Network className="h-4 w-4 text-primary mr-2" />
                <span className="font-medium text-gray-300">
                  {selectedProxy.ipAddress}:{selectedProxy.port}
                </span>
              </div>
              
              <Textarea
                value={proxyNote}
                onChange={(e) => setProxyNote(e.target.value)}
                placeholder="Adicione uma nota sobre este proxy..."
                className="bg-gray-800 border-gray-700 h-24"
              />
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNoteDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveNote}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProxyPage;