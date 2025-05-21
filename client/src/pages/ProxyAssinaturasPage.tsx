import { useState } from "react";
import { useGlassmorphism } from "@/hooks/useGlassmorphism";
import ThemeToggle from "@/components/layout/ThemeToggle";
import Sidebar from "@/components/layout/Sidebar";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Calendar,
  ArrowRightLeft,
  Check,
  Clock,
  AlertTriangle,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Tipos para a interface
interface ProxyAssinatura {
  id: number;
  codigo: string;
  status: 'ativo' | 'renovacao' | 'vencido' | 'cancelado';
  quantidade: number;
  precoTotal: number;
  produto: string;
  regiaoProxy: string;
  usuario: {
    nome: string;
    email: string;
    dominio?: string;
  };
  renovacaoAutomatica: boolean;
  dataVencimento: Date;
  criadoEm: Date;
}

// Dados mock
const mockAssinaturas: ProxyAssinatura[] = [
  {
    id: 1,
    codigo: '2505135113',
    status: 'ativo',
    quantidade: 1,
    precoTotal: 25.00,
    produto: 'PROXY ULTRA IPV6 SOCKS5 BRASIL',
    regiaoProxy: 'Região Sudeste/Central',
    usuario: {
      nome: 'Victor de Oliveira Araujo',
      email: 'victor.tucaarujo@gmail.com',
      dominio: 'clientes.fbflixvipsdigitais.com.br'
    },
    renovacaoAutomatica: true,
    dataVencimento: new Date(2025, 5, 13, 13, 33), // 13/06/2025 13:33
    criadoEm: new Date(2025, 5, 12, 13, 33), // 12/06/2025 13:33
  },
  {
    id: 2,
    codigo: '2505136471',
    status: 'ativo',
    quantidade: 1,
    precoTotal: 25.00,
    produto: 'PROXY ULTRA IPV6 SOCKS5 BRASIL',
    regiaoProxy: 'Região Sudeste/Central',
    usuario: {
      nome: 'Clésio',
      email: 'xilove.pereira@hotmail.com',
      dominio: 'clientes.fbflixvipsdigitais.com.br'
    },
    renovacaoAutomatica: true,
    dataVencimento: new Date(2025, 5, 13, 12, 40), // 13/06/2025 12:40
    criadoEm: new Date(2025, 5, 12, 12, 40), // 12/06/2025 12:40
  },
  {
    id: 3,
    codigo: '2505135466',
    status: 'ativo',
    quantidade: 1,
    precoTotal: 25.00,
    produto: 'PROXY ULTRA IPV6 SOCKS5 BRASIL',
    regiaoProxy: 'Região Sudeste/Central',
    usuario: {
      nome: 'Luci Viviane da Silva Madalena',
      email: 'medvivanet09@gmail.com',
      dominio: 'clientes.fbflixvipsdigitais.com.br'
    },
    renovacaoAutomatica: true,
    dataVencimento: new Date(2025, 5, 13, 11, 8), // 13/06/2025 11:08
    criadoEm: new Date(2025, 5, 12, 11, 8), // 12/06/2025 11:08
  },
  {
    id: 4,
    codigo: '2505123183',
    status: 'ativo',
    quantidade: 1,
    precoTotal: 25.00,
    produto: 'PROXY ULTRA IPV6 SOCKS5 BRASIL',
    regiaoProxy: 'Região Sudeste/Central',
    usuario: {
      nome: 'Marvin Vinicius Pereira',
      email: 'marvin.pereira@hotmail.com',
      dominio: 'clientes.fbflixvipsdigitais.com.br'
    },
    renovacaoAutomatica: false,
    dataVencimento: new Date(2025, 5, 12, 17, 44), // 12/06/2025 17:44
    criadoEm: new Date(2025, 5, 11, 17, 44), // 11/06/2025 17:44
  },
  {
    id: 5,
    codigo: '2505128504',
    status: 'ativo',
    quantidade: 1,
    precoTotal: 25.00,
    produto: 'PROXY ULTRA IPV6 SOCKS5 BRASIL',
    regiaoProxy: 'Região Sudeste/Central',
    usuario: {
      nome: 'Marvin Vinicius Pereira',
      email: 'marvin.pereira@hotmail.com',
      dominio: 'clientes.fbflixvipsdigitais.com.br'
    },
    renovacaoAutomatica: false,
    dataVencimento: new Date(2025, 5, 12, 17, 24), // 12/06/2025 17:24
    criadoEm: new Date(2025, 5, 11, 17, 24), // 11/06/2025 17:24
  },
  {
    id: 6,
    codigo: '2504098712',
    status: 'renovacao',
    quantidade: 2,
    precoTotal: 45.00,
    produto: 'PROXY ULTRA IPV6 SOCKS5 BRASIL',
    regiaoProxy: 'Região Sudeste/Central',
    usuario: {
      nome: 'Juliana Martins',
      email: 'juliana.martins@gmail.com',
      dominio: 'clientes.fbflixvipsdigitais.com.br'
    },
    renovacaoAutomatica: true,
    dataVencimento: new Date(2025, 5, 10, 9, 15), // 10/06/2025 09:15
    criadoEm: new Date(2025, 4, 10, 9, 15), // 10/05/2025 09:15
  },
  {
    id: 7,
    codigo: '2503087645',
    status: 'vencido',
    quantidade: 1,
    precoTotal: 25.00,
    produto: 'PROXY ULTRA IPV6 SOCKS5 BRASIL',
    regiaoProxy: 'Região Sudeste/Central',
    usuario: {
      nome: 'Carlos Eduardo Silva',
      email: 'carlosed@gmail.com',
      dominio: 'clientes.fbflixvipsdigitais.com.br'
    },
    renovacaoAutomatica: false,
    dataVencimento: new Date(2025, 4, 29, 14, 30), // 29/05/2025 14:30
    criadoEm: new Date(2025, 3, 29, 14, 30), // 29/04/2025 14:30
  },
  {
    id: 8,
    codigo: '2502076538',
    status: 'cancelado',
    quantidade: 3,
    precoTotal: 60.00,
    produto: 'PROXY ULTRA IPV6 SOCKS5 BRASIL',
    regiaoProxy: 'Região Sudeste/Central',
    usuario: {
      nome: 'Patricia Andrade',
      email: 'patricia.andrade@hotmail.com',
      dominio: 'clientes.fbflixvipsdigitais.com.br'
    },
    renovacaoAutomatica: false,
    dataVencimento: new Date(2025, 4, 15, 16, 45), // 15/05/2025 16:45
    criadoEm: new Date(2025, 3, 15, 16, 45), // 15/04/2025 16:45
  },
];

export function ProxyAssinaturasPage() {
  const glassStyles = useGlassmorphism();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [renovacaoFilter, setRenovacaoFilter] = useState<string>("todos");
  const [assinaturas, setAssinaturas] = useState<ProxyAssinatura[]>(mockAssinaturas);
  const [selectedAssinatura, setSelectedAssinatura] = useState<ProxyAssinatura | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isMigrationDialogOpen, setIsMigrationDialogOpen] = useState(false);

  // Filtrar assinaturas com base nos critérios de pesquisa e filtros
  const filteredAssinaturas = assinaturas.filter((assinatura) => {
    // Filtro de pesquisa
    const matchesSearch =
      searchTerm === "" ||
      assinatura.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assinatura.produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assinatura.usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assinatura.usuario.email.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtro de status
    const matchesStatus =
      statusFilter === "todos" || assinatura.status === statusFilter;

    // Filtro de renovação automática
    const matchesRenovacao =
      renovacaoFilter === "todos" ||
      (renovacaoFilter === "yes" && assinatura.renovacaoAutomatica) ||
      (renovacaoFilter === "no" && !assinatura.renovacaoAutomatica);

    return matchesSearch && matchesStatus && matchesRenovacao;
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return (
          <Badge className="bg-green-600 text-xs uppercase font-bold">
            Ativo
          </Badge>
        );
      case 'renovacao':
        return (
          <Badge className="bg-blue-600 text-xs uppercase font-bold">
            Renovação
          </Badge>
        );
      case 'vencido':
        return (
          <Badge className="bg-yellow-600 text-xs uppercase font-bold">
            Vencido
          </Badge>
        );
      case 'cancelado':
        return (
          <Badge className="bg-destructive text-xs uppercase font-bold">
            Cancelado
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-600 text-xs uppercase font-bold">
            {status}
          </Badge>
        );
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ativo':
        return (
          <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
            <Check className="h-4 w-4 text-white" />
          </div>
        );
      case 'renovacao':
        return (
          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
            <Clock className="h-4 w-4 text-white" />
          </div>
        );
      case 'vencido':
        return (
          <div className="w-6 h-6 rounded-full bg-yellow-600 flex items-center justify-center">
            <AlertTriangle className="h-4 w-4 text-white" />
          </div>
        );
      case 'cancelado':
        return (
          <div className="w-6 h-6 rounded-full bg-destructive flex items-center justify-center">
            <X className="h-4 w-4 text-white" />
          </div>
        );
      default:
        return (
          <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center">
            <Check className="h-4 w-4 text-white" />
          </div>
        );
    }
  };

  const getRenovacaoIcon = (renovacaoAutomatica: boolean) => {
    if (renovacaoAutomatica) {
      return (
        <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center">
          <Check className="h-4 w-4 text-white" />
        </div>
      );
    } else {
      return (
        <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center">
          <X className="h-4 w-4 text-white" />
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className={`${glassStyles.className} z-10 py-4 px-6 flex justify-between items-center`}>
          <div className="flex items-center">
            <button
              className="md:hidden mr-4 text-gray-400"
              onClick={() => setIsMenuOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-foreground">Assinaturas de Proxy</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="default" onClick={() => setIsMigrationDialogOpen(true)}>
              <ArrowRightLeft className="mr-2 h-4 w-4" />
              Migrar
            </Button>
            <ThemeToggle />
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className={`${glassStyles.className} p-6 rounded-lg`}>
            {/* Filtros */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative w-full md:w-1/3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Pesquisa"
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex flex-col xs:flex-row gap-4 w-full md:w-2/3">
                <div className="flex-1">
                  <div className="text-sm mb-2">Status</div>
                  <div className="flex space-x-1">
                    <Button
                      variant={statusFilter === "todos" ? "default" : "outline"}
                      size="sm"
                      className="flex-1"
                      onClick={() => setStatusFilter("todos")}
                    >
                      Todos
                    </Button>
                    <Button
                      variant={statusFilter === "ativo" ? "default" : "outline"}
                      size="sm"
                      className="flex-1"
                      onClick={() => setStatusFilter("ativo")}
                    >
                      Ativo
                    </Button>
                    <Button
                      variant={statusFilter === "renovacao" ? "default" : "outline"}
                      size="sm"
                      className="flex-1"
                      onClick={() => setStatusFilter("renovacao")}
                    >
                      Renovação
                    </Button>
                    <Button
                      variant={statusFilter === "vencido" ? "default" : "outline"}
                      size="sm"
                      className="flex-1"
                      onClick={() => setStatusFilter("vencido")}
                    >
                      Vencido
                    </Button>
                    <Button
                      variant={statusFilter === "cancelado" ? "default" : "outline"}
                      size="sm"
                      className="flex-1"
                      onClick={() => setStatusFilter("cancelado")}
                    >
                      Cancelado
                    </Button>
                  </div>
                </div>
                
                <div className="w-full xs:w-auto">
                  <div className="text-sm mb-2">Renovação automática</div>
                  <div className="flex space-x-1">
                    <Button
                      variant={renovacaoFilter === "todos" ? "default" : "outline"}
                      size="sm"
                      className="flex-1"
                      onClick={() => setRenovacaoFilter("todos")}
                    >
                      Todos
                    </Button>
                    <Button
                      variant={renovacaoFilter === "yes" ? "default" : "outline"}
                      size="sm"
                      className="flex-1"
                      onClick={() => setRenovacaoFilter("yes")}
                    >
                      Yes
                    </Button>
                    <Button
                      variant={renovacaoFilter === "no" ? "default" : "outline"}
                      size="sm"
                      className="flex-1"
                      onClick={() => setRenovacaoFilter("no")}
                    >
                      No
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tabela de assinaturas */}
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="uppercase text-xs font-bold">Status</TableHead>
                    <TableHead className="uppercase text-xs font-bold">Código</TableHead>
                    <TableHead className="uppercase text-xs font-bold">Proxies</TableHead>
                    <TableHead className="uppercase text-xs font-bold">Preço Total</TableHead>
                    <TableHead className="uppercase text-xs font-bold">Produto</TableHead>
                    <TableHead className="uppercase text-xs font-bold">Usuário</TableHead>
                    <TableHead className="uppercase text-xs font-bold">Data de vencimento</TableHead>
                    <TableHead className="uppercase text-xs font-bold">Criado em</TableHead>
                    <TableHead className="text-right uppercase text-xs font-bold">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssinaturas.map((assinatura) => (
                    <TableRow key={assinatura.id}>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(assinatura.status)}
                          <span className="ml-2">{getStatusBadge(assinatura.status)}</span>
                        </div>
                      </TableCell>
                      <TableCell>{assinatura.codigo}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="bg-background">
                          {assinatura.quantidade}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(assinatura.precoTotal)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{assinatura.produto}</span>
                          <span className="text-xs text-muted-foreground">{assinatura.regiaoProxy}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{assinatura.usuario.nome}</span>
                          <span className="text-xs text-muted-foreground">{assinatura.usuario.email}</span>
                          {assinatura.usuario.dominio && (
                            <span className="text-xs text-muted-foreground">{assinatura.usuario.dominio}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(assinatura.dataVencimento)}</TableCell>
                      <TableCell>{formatDate(assinatura.criadoEm)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 hover:text-orange-700"
                            onClick={() => {
                              setSelectedAssinatura(assinatura);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 hover:text-purple-700"
                            onClick={() => {
                              setSelectedAssinatura(assinatura);
                              setIsDetailsDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredAssinaturas.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma assinatura encontrada com os filtros selecionados.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      
      {/* Dialog para Detalhes da Assinatura */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-3xl">
          {selectedAssinatura && (
            <>
              <DialogHeader>
                <DialogTitle>Detalhes da Assinatura</DialogTitle>
                <DialogDescription>
                  Código: {selectedAssinatura.codigo}
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="detalhes" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="detalhes" className="flex-1">Detalhes</TabsTrigger>
                  <TabsTrigger value="proxies" className="flex-1">Proxies</TabsTrigger>
                  <TabsTrigger value="historico" className="flex-1">Histórico</TabsTrigger>
                </TabsList>
                
                <TabsContent value="detalhes">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
                    <div>
                      <h3 className="text-sm font-medium mb-3">Informações da Assinatura</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-sm text-muted-foreground">Status:</div>
                          <div className="flex items-center">
                            {getStatusBadge(selectedAssinatura.status)}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-sm text-muted-foreground">Renovação:</div>
                          <div className="flex items-center">
                            {selectedAssinatura.renovacaoAutomatica ? 'Automática' : 'Manual'}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-sm text-muted-foreground">Quantidade:</div>
                          <div>{selectedAssinatura.quantidade} proxies</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-sm text-muted-foreground">Preço Total:</div>
                          <div>{formatCurrency(selectedAssinatura.precoTotal)}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-sm text-muted-foreground">Data de Vencimento:</div>
                          <div>{formatDate(selectedAssinatura.dataVencimento)}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-sm text-muted-foreground">Criado em:</div>
                          <div>{formatDate(selectedAssinatura.criadoEm)}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-3">Informações do Produto</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-2">
                          <div className="text-sm text-muted-foreground">Produto:</div>
                          <div className="font-medium">{selectedAssinatura.produto}</div>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          <div className="text-sm text-muted-foreground">Região:</div>
                          <div>{selectedAssinatura.regiaoProxy}</div>
                        </div>
                        
                        <h3 className="text-sm font-medium mb-1 mt-6">Informações do Cliente</h3>
                        <div className="grid grid-cols-1 gap-2">
                          <div className="text-sm text-muted-foreground">Nome:</div>
                          <div className="font-medium">{selectedAssinatura.usuario.nome}</div>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          <div className="text-sm text-muted-foreground">Email:</div>
                          <div>{selectedAssinatura.usuario.email}</div>
                        </div>
                        {selectedAssinatura.usuario.dominio && (
                          <div className="grid grid-cols-1 gap-2">
                            <div className="text-sm text-muted-foreground">Domínio:</div>
                            <div>{selectedAssinatura.usuario.dominio}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="proxies">
                  <div className="py-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>IP</TableHead>
                          <TableHead>Porta</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Região</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Array.from({ length: selectedAssinatura.quantidade }).map((_, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-mono text-sm">186.192.{Math.floor(Math.random() * 255)}.{Math.floor(Math.random() * 255)}</TableCell>
                            <TableCell className="font-mono text-sm">{10000 + Math.floor(Math.random() * 50000)}</TableCell>
                            <TableCell>SOCKS5</TableCell>
                            <TableCell>Brasil (Sudeste)</TableCell>
                            <TableCell>
                              <Badge className="bg-green-600">Online</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                <TabsContent value="historico">
                  <div className="py-4">
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <Check className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium">Assinatura criada</div>
                          <div className="text-sm text-muted-foreground">{formatDate(selectedAssinatura.criadoEm)}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <Check className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">Proxy ativado</div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(new Date(selectedAssinatura.criadoEm.getTime() + 5 * 60000))}
                          </div>
                        </div>
                      </div>
                      
                      {selectedAssinatura.status === 'renovacao' && (
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                            <Calendar className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-medium">Renovação agendada</div>
                            <div className="text-sm text-muted-foreground">
                              {formatDate(new Date(selectedAssinatura.dataVencimento.getTime() - 2 * 24 * 60 * 60 * 1000))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
                  Fechar
                </Button>
                <Button onClick={() => {
                  setIsDetailsDialogOpen(false);
                  setIsEditDialogOpen(true);
                }}>
                  Editar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Dialog para Editar Assinatura */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          {selectedAssinatura && (
            <>
              <DialogHeader>
                <DialogTitle>Editar Assinatura</DialogTitle>
                <DialogDescription>
                  Código: {selectedAssinatura.codigo}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <select className="w-full p-2 rounded-md border border-input bg-background">
                      <option value="ativo">Ativo</option>
                      <option value="renovacao">Renovação</option>
                      <option value="vencido">Vencido</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Renovação Automática</label>
                    <select className="w-full p-2 rounded-md border border-input bg-background">
                      <option value="true">Sim</option>
                      <option value="false">Não</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Quantidade de Proxies</label>
                    <input
                      type="number"
                      className="w-full p-2 rounded-md border border-input bg-background"
                      defaultValue={selectedAssinatura.quantidade}
                      min="1"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Preço Total</label>
                    <input
                      type="number"
                      className="w-full p-2 rounded-md border border-input bg-background"
                      defaultValue={selectedAssinatura.precoTotal}
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Data de Vencimento</label>
                  <input
                    type="datetime-local"
                    className="w-full p-2 rounded-md border border-input bg-background"
                    defaultValue={selectedAssinatura.dataVencimento.toISOString().slice(0, 16)}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setIsEditDialogOpen(false)}>
                  Salvar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Dialog para Migração */}
      <Dialog open={isMigrationDialogOpen} onOpenChange={setIsMigrationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Migrar Proxies</DialogTitle>
            <DialogDescription>
              Selecione o tipo de migração que deseja realizar.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Migração</label>
              <select className="w-full p-2 rounded-md border border-input bg-background">
                <option value="sistema">Migração de Sistema</option>
                <option value="provedor">Troca de Provedor</option>
                <option value="servidor">Migração de Servidor</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Assinaturas a Migrar</label>
              <select className="w-full p-2 rounded-md border border-input bg-background">
                <option value="todas">Todas as Assinaturas</option>
                <option value="ativas">Apenas Assinaturas Ativas</option>
                <option value="selecionadas">Assinaturas Selecionadas</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Data de Migração</label>
              <input
                type="datetime-local"
                className="w-full p-2 rounded-md border border-input bg-background"
                defaultValue={new Date().toISOString().slice(0, 16)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Observações</label>
              <textarea
                className="w-full p-2 rounded-md border border-input bg-background min-h-[100px]"
                placeholder="Informações adicionais sobre a migração..."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMigrationDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setIsMigrationDialogOpen(false)}>
              Iniciar Migração
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProxyAssinaturasPage;