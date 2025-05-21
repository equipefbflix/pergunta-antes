import { useState } from "react";
import { useGlassmorphism } from "@/hooks/useGlassmorphism";
import ThemeToggle from "@/components/layout/ThemeToggle";
import Sidebar from "@/components/layout/Sidebar";
import { 
  Plus, 
  Trash2, 
  Edit, 
  RefreshCw, 
  Package, 
  Users, 
  ShoppingBag, 
  Check, 
  Clock, 
  AlertTriangle,
  UserPlus,
  CalendarClock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

// Tipos para o sistema de assinaturas
interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  billingPeriod: 'monthly' | 'quarterly' | 'semiannual' | 'annual';
  status: 'active' | 'inactive' | 'draft';
  createdAt: Date;
  items: SubscriptionItem[];
  automaticDistribution: boolean;
}

interface SubscriptionItem {
  id: number;
  type: 'profile' | 'bm';
  category: string;
  quantity: number;
}

interface UserSubscription {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  planId: number;
  planName: string;
  status: 'active' | 'cancelled' | 'pending' | 'expired';
  startDate: Date;
  endDate: Date;
  lastPayment: Date;
  totalPaid: number;
  assignedItems: AssignedItem[];
}

interface AssignedItem {
  id: number;
  type: 'profile' | 'bm';
  name: string;
  category: string;
  assignedAt: Date;
}

interface RecurrenceItem {
  id: number;
  type: 'profile' | 'bm';
  name: string;
  category: string;
  status: 'available' | 'assigned';
  createdAt: Date;
}

// Dados mock para exemplos
const mockSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: 1,
    name: "Pacote Básico",
    description: "Pacote com perfis e BMs para iniciantes",
    price: 99.90,
    billingPeriod: 'monthly',
    status: 'active',
    createdAt: new Date(2025, 1, 15),
    items: [
      { id: 1, type: 'profile', category: 'premium', quantity: 3 },
      { id: 2, type: 'bm', category: 'standard', quantity: 1 },
    ],
    automaticDistribution: true
  },
  {
    id: 2,
    name: "Pacote Profissional",
    description: "Pacote completo para profissionais",
    price: 249.90,
    billingPeriod: 'monthly',
    status: 'active',
    createdAt: new Date(2025, 2, 10),
    items: [
      { id: 3, type: 'profile', category: 'premium', quantity: 5 },
      { id: 4, type: 'bm', category: 'premium', quantity: 3 },
    ],
    automaticDistribution: true
  },
  {
    id: 3,
    name: "Pacote Anual",
    description: "Assinatura anual com desconto",
    price: 1999.90,
    billingPeriod: 'annual',
    status: 'active',
    createdAt: new Date(2025, 3, 5),
    items: [
      { id: 5, type: 'profile', category: 'premium', quantity: 5 },
      { id: 6, type: 'profile', category: 'ultra', quantity: 2 },
      { id: 7, type: 'bm', category: 'premium', quantity: 4 },
    ],
    automaticDistribution: false
  },
];

const mockUserSubscriptions: UserSubscription[] = [
  {
    id: 1,
    userId: 101,
    userName: "João Silva",
    userEmail: "joao.silva@example.com",
    planId: 1,
    planName: "Pacote Básico",
    status: 'active',
    startDate: new Date(2025, 1, 20),
    endDate: new Date(2025, 2, 20),
    lastPayment: new Date(2025, 1, 20),
    totalPaid: 99.90,
    assignedItems: [
      { id: 1, type: 'profile', name: 'Perfil Premium #1254', category: 'premium', assignedAt: new Date(2025, 1, 21) },
      { id: 2, type: 'profile', name: 'Perfil Premium #3322', category: 'premium', assignedAt: new Date(2025, 1, 21) },
      { id: 3, type: 'bm', name: 'BM Standard #092', category: 'standard', assignedAt: new Date(2025, 1, 21) },
    ],
  },
  {
    id: 2,
    userId: 102,
    userName: "Maria Oliveira",
    userEmail: "maria.oliveira@example.com",
    planId: 2,
    planName: "Pacote Profissional",
    status: 'active',
    startDate: new Date(2025, 2, 15),
    endDate: new Date(2025, 3, 15),
    lastPayment: new Date(2025, 2, 15),
    totalPaid: 249.90,
    assignedItems: [
      { id: 4, type: 'profile', name: 'Perfil Premium #5421', category: 'premium', assignedAt: new Date(2025, 2, 16) },
      { id: 5, type: 'profile', name: 'Perfil Premium #1111', category: 'premium', assignedAt: new Date(2025, 2, 16) },
      { id: 6, type: 'bm', name: 'BM Premium #732', category: 'premium', assignedAt: new Date(2025, 2, 16) },
    ],
  },
  {
    id: 3,
    userId: 103,
    userName: "Carlos Mendes",
    userEmail: "carlos.mendes@example.com",
    planId: 3,
    planName: "Pacote Anual",
    status: 'pending',
    startDate: new Date(2025, 3, 10),
    endDate: new Date(2026, 3, 10),
    lastPayment: new Date(2025, 3, 10),
    totalPaid: 1999.90,
    assignedItems: [],
  },
];

const mockRecurrenceItems: RecurrenceItem[] = [
  { id: 1, type: 'profile', name: 'Perfil Premium #8754', category: 'premium', status: 'available', createdAt: new Date(2025, 1, 10) },
  { id: 2, type: 'profile', name: 'Perfil Premium #9322', category: 'premium', status: 'available', createdAt: new Date(2025, 1, 15) },
  { id: 3, type: 'profile', name: 'Perfil Ultra #2234', category: 'ultra', status: 'available', createdAt: new Date(2025, 2, 5) },
  { id: 4, type: 'bm', name: 'BM Standard #532', category: 'standard', status: 'available', createdAt: new Date(2025, 1, 20) },
  { id: 5, type: 'bm', name: 'BM Premium #876', category: 'premium', status: 'available', createdAt: new Date(2025, 2, 10) },
  { id: 6, type: 'bm', name: 'BM Premium #987', category: 'premium', status: 'available', createdAt: new Date(2025, 2, 15) },
];

export function AdminAssinaturasPage() {
  const glassStyles = useGlassmorphism();
  const { toast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("pacotes");
  
  // Estados para planos de assinatura
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>(mockSubscriptionPlans);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [isAddPlanDialogOpen, setIsAddPlanDialogOpen] = useState(false);
  
  // Estados para assinaturas de usuários
  const [userSubscriptions, setUserSubscriptions] = useState<UserSubscription[]>(mockUserSubscriptions);
  const [selectedSubscription, setSelectedSubscription] = useState<UserSubscription | null>(null);
  const [isUserSubDialogOpen, setIsUserSubDialogOpen] = useState(false);
  
  // Estados para itens de recorrência
  const [recurrenceItems, setRecurrenceItems] = useState<RecurrenceItem[]>(mockRecurrenceItems);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  
  // Novo plano
  const [newPlan, setNewPlan] = useState<Partial<SubscriptionPlan>>({
    name: "",
    description: "",
    price: 0,
    billingPeriod: 'monthly',
    status: 'draft',
    items: [],
    automaticDistribution: true
  });
  
  // Novo item do plano
  const [newItem, setNewItem] = useState<Partial<SubscriptionItem>>({
    type: 'profile',
    category: 'premium',
    quantity: 1
  });

  // Estados para gerenciamento de itens em assinaturas
  const [selectedUserSub, setSelectedUserSub] = useState<UserSubscription | null>(null);
  const [isAssignItemsDialogOpen, setIsAssignItemsDialogOpen] = useState(false);
  const [itemsToAssign, setItemsToAssign] = useState<number[]>([]);

  const handleAddPlan = () => {
    // Implementação para adicionar novo plano
    const id = Math.max(0, ...subscriptionPlans.map(p => p.id)) + 1;
    const createdPlan: SubscriptionPlan = {
      id,
      name: newPlan.name || `Novo Pacote #${id}`,
      description: newPlan.description || "",
      price: newPlan.price || 0,
      billingPeriod: newPlan.billingPeriod || 'monthly',
      status: newPlan.status || 'draft',
      createdAt: new Date(),
      items: newPlan.items || [],
      automaticDistribution: newPlan.automaticDistribution || false
    };
    
    setSubscriptionPlans([...subscriptionPlans, createdPlan]);
    setIsAddPlanDialogOpen(false);
    setNewPlan({
      name: "",
      description: "",
      price: 0,
      billingPeriod: 'monthly',
      status: 'draft',
      items: [],
      automaticDistribution: true
    });
    
    toast({
      title: "Plano criado",
      description: `O plano "${createdPlan.name}" foi criado com sucesso.`,
    });
  };

  const handleAddItemToPlan = () => {
    if (!newItem.type || !newItem.category || !newItem.quantity) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos do item.",
        variant: "destructive"
      });
      return;
    }
    
    const id = Math.max(0, ...subscriptionPlans.flatMap(p => p.items).map(i => i.id)) + 1;
    const newItemComplete: SubscriptionItem = {
      id,
      type: newItem.type,
      category: newItem.category,
      quantity: newItem.quantity
    };
    
    setNewPlan({
      ...newPlan,
      items: [...(newPlan.items || []), newItemComplete]
    });
    
    setNewItem({
      type: 'profile',
      category: 'premium',
      quantity: 1
    });
  };

  const handleRemoveItemFromPlan = (itemId: number) => {
    setNewPlan({
      ...newPlan,
      items: (newPlan.items || []).filter(item => item.id !== itemId)
    });
  };

  const handleUpdatePlanStatus = (planId: number, newStatus: 'active' | 'inactive' | 'draft') => {
    setSubscriptionPlans(subscriptionPlans.map(plan => 
      plan.id === planId ? { ...plan, status: newStatus } : plan
    ));
    
    toast({
      title: "Status atualizado",
      description: `O status do plano foi alterado para "${newStatus}".`,
    });
  };

  const handleAssignItems = () => {
    if (!selectedUserSub || itemsToAssign.length === 0) {
      toast({
        title: "Seleção necessária",
        description: "Selecione uma assinatura e pelo menos um item para atribuir.",
        variant: "destructive"
      });
      return;
    }
    
    // Obter os itens selecionados
    const itemsToAdd = recurrenceItems
      .filter(item => itemsToAssign.includes(item.id))
      .map(item => ({
        id: Math.max(0, ...userSubscriptions.flatMap(s => s.assignedItems).map(i => i.id)) + 1 + itemsToAssign.indexOf(item.id),
        type: item.type,
        name: item.name,
        category: item.category,
        assignedAt: new Date()
      }));
    
    // Atualizar a assinatura do usuário
    setUserSubscriptions(userSubscriptions.map(sub => 
      sub.id === selectedUserSub.id 
        ? { ...sub, assignedItems: [...sub.assignedItems, ...itemsToAdd] } 
        : sub
    ));
    
    // Marcar os itens como atribuídos
    setRecurrenceItems(recurrenceItems.map(item => 
      itemsToAssign.includes(item.id)
        ? { ...item, status: 'assigned' }
        : item
    ));
    
    setIsAssignItemsDialogOpen(false);
    setItemsToAssign([]);
    
    toast({
      title: "Itens atribuídos",
      description: `${itemsToAdd.length} item(s) foram atribuídos à assinatura.`,
    });
  };

  const handleAddRecurrenceItem = (type: 'profile' | 'bm', category: string, name: string) => {
    const id = Math.max(0, ...recurrenceItems.map(i => i.id)) + 1;
    const newItem: RecurrenceItem = {
      id,
      type,
      name,
      category,
      status: 'available',
      createdAt: new Date()
    };
    
    setRecurrenceItems([...recurrenceItems, newItem]);
    setIsItemDialogOpen(false);
    
    toast({
      title: "Item adicionado",
      description: `${type === 'profile' ? 'Perfil' : 'BM'} "${name}" adicionado ao estoque de recorrência.`,
    });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
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
      case 'active':
        return <Badge className="bg-green-600">Ativo</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inativo</Badge>;
      case 'draft':
        return <Badge variant="outline">Rascunho</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelado</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-600">Pendente</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expirado</Badge>;
      case 'available':
        return <Badge className="bg-blue-600">Disponível</Badge>;
      case 'assigned':
        return <Badge variant="secondary">Atribuído</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getBillingPeriodText = (period: string) => {
    switch (period) {
      case 'monthly':
        return 'Mensal';
      case 'quarterly':
        return 'Trimestral';
      case 'semiannual':
        return 'Semestral';
      case 'annual':
        return 'Anual';
      default:
        return period;
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
            <h1 className="text-2xl font-bold text-foreground">Assinaturas</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          <Tabs defaultValue="pacotes" className="mb-6" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pacotes" className="flex items-center">
                <Package className="mr-2 h-4 w-4" />
                <span>Pacotes</span>
              </TabsTrigger>
              <TabsTrigger value="assinaturas" className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                <span>Assinaturas</span>
              </TabsTrigger>
              <TabsTrigger value="estoque" className="flex items-center">
                <ShoppingBag className="mr-2 h-4 w-4" />
                <span>Estoque Recorrente</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Tab de Pacotes */}
            <TabsContent value="pacotes">
              <div className={`${glassStyles.className} p-6 rounded-lg`}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Pacotes de Assinatura</h2>
                  <Button onClick={() => setIsAddPlanDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Pacote
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subscriptionPlans.map((plan) => (
                    <Card key={plan.id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start mb-1">
                          <CardTitle className="text-lg">{plan.name}</CardTitle>
                          {getStatusBadge(plan.status)}
                        </div>
                        <CardDescription className="line-clamp-2">{plan.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="text-2xl font-bold mb-2">
                          {formatCurrency(plan.price)}
                          <span className="text-sm font-normal text-muted-foreground ml-1">
                            /{getBillingPeriodText(plan.billingPeriod)}
                          </span>
                        </div>
                        
                        <div className="text-sm mt-4">
                          <div className="font-medium">Itens incluídos:</div>
                          <ul className="mt-1 space-y-1">
                            {plan.items.map((item) => (
                              <li key={item.id} className="flex items-center">
                                <Check className="h-4 w-4 mr-2 text-green-500" />
                                <span>
                                  {item.quantity}x {item.type === 'profile' ? 'Perfil' : 'BM'} {item.category}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="flex items-center mt-4 text-sm text-muted-foreground">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          <span>
                            Distribuição {plan.automaticDistribution ? 'automática' : 'manual'}
                          </span>
                        </div>
                        
                        <div className="text-sm text-muted-foreground mt-2">
                          Criado em {formatDate(plan.createdAt)}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2 flex justify-between">
                        <Button variant="outline" size="sm" className="flex-1 mr-2" onClick={() => setEditingPlan(plan)}>
                          <Edit className="h-3.5 w-3.5 mr-1" />
                          Editar
                        </Button>
                        <Select
                          onValueChange={(value) => handleUpdatePlanStatus(plan.id, value as any)}
                          defaultValue={plan.status}
                        >
                          <SelectTrigger className="flex-1 h-9">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Ativar</SelectItem>
                            <SelectItem value="inactive">Desativar</SelectItem>
                            <SelectItem value="draft">Rascunho</SelectItem>
                          </SelectContent>
                        </Select>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            {/* Tab de Assinaturas */}
            <TabsContent value="assinaturas">
              <div className={`${glassStyles.className} p-6 rounded-lg`}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Assinaturas Ativas</h2>
                  <div className="flex space-x-2">
                    <Button onClick={() => setIsUserSubDialogOpen(true)}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Nova Assinatura
                    </Button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Plano</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Período</TableHead>
                        <TableHead>Último Pagamento</TableHead>
                        <TableHead>Itens</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userSubscriptions.map((sub) => (
                        <TableRow key={sub.id}>
                          <TableCell>
                            <div className="font-medium">{sub.userName}</div>
                            <div className="text-xs text-muted-foreground">{sub.userEmail}</div>
                          </TableCell>
                          <TableCell>{sub.planName}</TableCell>
                          <TableCell>{getStatusBadge(sub.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <CalendarClock className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                              <span className="text-sm">{formatDate(sub.startDate)} - {formatDate(sub.endDate)}</span>
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(sub.lastPayment)}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono">
                              {sub.assignedItems.length}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mr-2"
                              onClick={() => {
                                setSelectedUserSub(sub);
                                setIsAssignItemsDialogOpen(true);
                              }}
                            >
                              <Plus className="h-3.5 w-3.5 mr-1" />
                              Itens
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedSubscription(sub)}
                            >
                              <Edit className="h-3.5 w-3.5 mr-1" />
                              Detalhes
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
            
            {/* Tab de Estoque Recorrente */}
            <TabsContent value="estoque">
              <div className={`${glassStyles.className} p-6 rounded-lg`}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Estoque para Recorrência</h2>
                  <Button onClick={() => setIsItemDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Item
                  </Button>
                </div>
                
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <input 
                            type="checkbox" 
                            className="rounded-sm h-4 w-4"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedItems(recurrenceItems.filter(i => i.status === 'available').map(i => i.id));
                              } else {
                                setSelectedItems([]);
                              }
                            }}
                          />
                        </TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data de Adição</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recurrenceItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <input 
                              type="checkbox" 
                              className="rounded-sm h-4 w-4"
                              disabled={item.status !== 'available'}
                              checked={selectedItems.includes(item.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedItems([...selectedItems, item.id]);
                                } else {
                                  setSelectedItems(selectedItems.filter(id => id !== item.id));
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            {item.type === 'profile' ? 'Perfil' : 'BM'}
                          </TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.category}</Badge>
                          </TableCell>
                          <TableCell>{getStatusBadge(item.status)}</TableCell>
                          <TableCell>{formatDate(item.createdAt)}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm"
                              disabled={item.status !== 'available'}
                            >
                              <Edit className="h-3.5 w-3.5 mr-1" />
                              Editar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {selectedItems.length > 0 && (
                  <div className="mt-4 p-3 bg-background rounded-md border border-border flex justify-between items-center">
                    <div>
                      <span className="font-medium">{selectedItems.length} item(s) selecionado(s)</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedItems([])}
                      >
                        Limpar seleção
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => setIsAssignItemsDialogOpen(true)}
                      >
                        Atribuir a assinante
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      
      {/* Dialog para Adicionar Novo Pacote */}
      <Dialog open={isAddPlanDialogOpen} onOpenChange={setIsAddPlanDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Novo Pacote de Assinatura</DialogTitle>
            <DialogDescription>
              Crie um novo pacote de assinatura para seus clientes.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="plan-name">Nome do pacote</Label>
                <Input
                  id="plan-name"
                  placeholder="Ex: Pacote Premium"
                  value={newPlan.name || ''}
                  onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="plan-price">Preço</Label>
                <Input
                  id="plan-price"
                  type="number"
                  placeholder="99.90"
                  value={newPlan.price || ''}
                  onChange={(e) => setNewPlan({ ...newPlan, price: parseFloat(e.target.value) })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="plan-description">Descrição</Label>
              <Textarea
                id="plan-description"
                placeholder="Descreva as características deste pacote"
                value={newPlan.description || ''}
                onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="plan-period">Período de cobrança</Label>
                <Select
                  value={newPlan.billingPeriod}
                  onValueChange={(value) => setNewPlan({ ...newPlan, billingPeriod: value as any })}
                >
                  <SelectTrigger id="plan-period">
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Mensal</SelectItem>
                    <SelectItem value="quarterly">Trimestral</SelectItem>
                    <SelectItem value="semiannual">Semestral</SelectItem>
                    <SelectItem value="annual">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="plan-status">Status inicial</Label>
                <Select
                  value={newPlan.status}
                  onValueChange={(value) => setNewPlan({ ...newPlan, status: value as any })}
                >
                  <SelectTrigger id="plan-status">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                    <SelectItem value="draft">Rascunho</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="auto-distribution"
                checked={newPlan.automaticDistribution}
                onCheckedChange={(checked) => setNewPlan({ ...newPlan, automaticDistribution: checked })}
              />
              <Label htmlFor="auto-distribution">
                Distribuição automática de itens
              </Label>
            </div>
            
            <Separator className="my-2" />
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label className="text-base">Itens do pacote</Label>
                <Button variant="outline" size="sm" type="button" onClick={() => handleAddItemToPlan()}>
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Adicionar item
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div>
                  <Label htmlFor="item-type">Tipo</Label>
                  <Select
                    value={newItem.type}
                    onValueChange={(value) => setNewItem({ ...newItem, type: value as any })}
                  >
                    <SelectTrigger id="item-type">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="profile">Perfil</SelectItem>
                      <SelectItem value="bm">BM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="item-category">Categoria</Label>
                  <Select
                    value={newItem.category}
                    onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                  >
                    <SelectTrigger id="item-category">
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="ultra">Ultra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="item-quantity">Quantidade</Label>
                  <Input
                    id="item-quantity"
                    type="number"
                    min="1"
                    value={newItem.quantity || 1}
                    onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              
              {(newPlan.items || []).length > 0 ? (
                <div className="border rounded-md divide-y">
                  {(newPlan.items || []).map((item, index) => (
                    <div key={item.id} className="flex justify-between items-center p-3">
                      <div className="flex items-center">
                        <span className="text-sm font-medium">
                          {item.quantity}x {item.type === 'profile' ? 'Perfil' : 'BM'} {item.category}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleRemoveItemFromPlan(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4 border border-dashed rounded-md text-muted-foreground">
                  Nenhum item adicionado ao pacote
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddPlanDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddPlan}>
              Criar Pacote
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para Detalhes da Assinatura */}
      <Dialog open={!!selectedSubscription} onOpenChange={(open) => !open && setSelectedSubscription(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedSubscription && (
            <>
              <DialogHeader>
                <DialogTitle>Detalhes da Assinatura</DialogTitle>
                <DialogDescription>
                  Assinatura de {selectedSubscription.userName}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-6 py-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Informações da Assinatura</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm text-muted-foreground">Status:</div>
                      <div>{getStatusBadge(selectedSubscription.status)}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm text-muted-foreground">Plano:</div>
                      <div>{selectedSubscription.planName}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm text-muted-foreground">Período:</div>
                      <div>
                        {formatDate(selectedSubscription.startDate)} até {formatDate(selectedSubscription.endDate)}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm text-muted-foreground">Último pagamento:</div>
                      <div>{formatDate(selectedSubscription.lastPayment)}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm text-muted-foreground">Total pago:</div>
                      <div>{formatCurrency(selectedSubscription.totalPaid)}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Informações do Cliente</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm text-muted-foreground">Nome:</div>
                      <div>{selectedSubscription.userName}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm text-muted-foreground">Email:</div>
                      <div>{selectedSubscription.userEmail}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm text-muted-foreground">ID do usuário:</div>
                      <div>{selectedSubscription.userId}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator className="my-2" />
              
              <div className="py-2">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-medium">Itens Atribuídos</h3>
                  <Button variant="outline" size="sm" onClick={() => {
                    setSelectedUserSub(selectedSubscription);
                    setIsAssignItemsDialogOpen(true);
                    setSelectedSubscription(null);
                  }}>
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Adicionar Itens
                  </Button>
                </div>
                
                {selectedSubscription.assignedItems.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Nome</TableHead>
                          <TableHead>Categoria</TableHead>
                          <TableHead>Data de Atribuição</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedSubscription.assignedItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.type === 'profile' ? 'Perfil' : 'BM'}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{item.category}</Badge>
                            </TableCell>
                            <TableCell>{formatDate(item.assignedAt)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center p-6 border border-dashed rounded-md text-muted-foreground">
                    Nenhum item atribuído a esta assinatura
                  </div>
                )}
              </div>
              
              <DialogFooter className="pt-4">
                <Button variant="outline" onClick={() => setSelectedSubscription(null)}>
                  Fechar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Dialog para Adicionar Item ao Estoque */}
      <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Item ao Estoque</DialogTitle>
            <DialogDescription>
              Adicione um novo perfil ou BM ao estoque de recorrência.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-item-type">Tipo de Item</Label>
              <Select defaultValue="profile">
                <SelectTrigger id="new-item-type">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="profile">Perfil</SelectItem>
                  <SelectItem value="bm">BM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-item-category">Categoria</Label>
              <Select defaultValue="premium">
                <SelectTrigger id="new-item-category">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="ultra">Ultra</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-item-name">Nome/Identificador</Label>
              <Input 
                id="new-item-name" 
                placeholder="Ex: Perfil Premium #1234"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsItemDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => handleAddRecurrenceItem('profile', 'premium', 'Novo Perfil Premium')}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog para Atribuir Itens à Assinatura */}
      <Dialog open={isAssignItemsDialogOpen} onOpenChange={setIsAssignItemsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Atribuir Itens à Assinatura</DialogTitle>
            <DialogDescription>
              Selecione os itens que deseja atribuir a um assinante.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="subscription-select">Assinatura do Cliente</Label>
              <Select 
                value={selectedUserSub?.id.toString() || ''}
                onValueChange={(value) => {
                  const sub = userSubscriptions.find(s => s.id === parseInt(value));
                  setSelectedUserSub(sub || null);
                }}
              >
                <SelectTrigger id="subscription-select">
                  <SelectValue placeholder="Selecione uma assinatura" />
                </SelectTrigger>
                <SelectContent>
                  {userSubscriptions.map((sub) => (
                    <SelectItem key={sub.id} value={sub.id.toString()}>
                      {sub.userName} - {sub.planName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedUserSub && (
              <div className="p-3 bg-muted/50 rounded-md">
                <div className="text-sm">
                  <span className="font-medium">Cliente:</span> {selectedUserSub.userName}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Plano:</span> {selectedUserSub.planName}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Status:</span> {getStatusBadge(selectedUserSub.status)}
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Itens Disponíveis</Label>
                <div className="text-sm text-muted-foreground">
                  {itemsToAssign.length} itens selecionados
                </div>
              </div>
              
              <div className="border rounded-md overflow-hidden max-h-[300px] overflow-y-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-background">
                    <TableRow>
                      <TableHead className="w-12">
                        <input 
                          type="checkbox" 
                          className="rounded-sm h-4 w-4"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setItemsToAssign(recurrenceItems.filter(i => i.status === 'available').map(i => i.id));
                            } else {
                              setItemsToAssign([]);
                            }
                          }}
                        />
                      </TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Categoria</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recurrenceItems
                      .filter((item) => item.status === 'available')
                      .map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <input 
                              type="checkbox" 
                              className="rounded-sm h-4 w-4"
                              checked={itemsToAssign.includes(item.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setItemsToAssign([...itemsToAssign, item.id]);
                                } else {
                                  setItemsToAssign(itemsToAssign.filter(id => id !== item.id));
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            {item.type === 'profile' ? 'Perfil' : 'BM'}
                          </TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.category}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
              
              {recurrenceItems.filter((item) => item.status === 'available').length === 0 && (
                <div className="text-center p-6 border border-dashed rounded-md text-muted-foreground">
                  Não há itens disponíveis no estoque
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAssignItemsDialogOpen(false);
              setItemsToAssign([]);
            }}>
              Cancelar
            </Button>
            <Button 
              onClick={handleAssignItems}
              disabled={!selectedUserSub || itemsToAssign.length === 0}
            >
              Atribuir Itens
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminAssinaturasPage;