import { useState } from "react";
import { useGlassmorphism } from "@/hooks/useGlassmorphism";
import Sidebar from "@/components/layout/Sidebar";
import { coupons, products } from "@/mocks/data";
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
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Avatar, 
  AvatarFallback 
} from "@/components/ui/avatar";
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  Cell, 
  Legend, 
  Pie, 
  PieChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";
import { 
  Bell, 
  Menu, 
  Search, 
  Tag,
  Edit,
  Plus,
  Tag as TagIcon,
  Calendar,
  Percent,
  Ticket,
  Filter,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { format, addDays, addHours, addMinutes, addSeconds } from "date-fns";
import { ptBR } from "date-fns/locale";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Coupon, CouponApplicationType, CouponDurationType, CouponStatus } from "@/types";

// Dados para os gráficos
const generateChartData = (coupons: Coupon[]) => {
  // Dados para o gráfico de utilização dos 5 cupons mais usados
  const topUsedCoupons = [...coupons]
    .sort((a, b) => b.timesUsed - a.timesUsed)
    .slice(0, 5)
    .map(coupon => ({
      name: coupon.code,
      uses: coupon.timesUsed,
      percentage: coupon.percentage
    }));
    
  // Dados para o gráfico de distribuição por tipo de aplicação
  const applicationTypes = coupons.reduce((acc: any, coupon) => {
    const type = coupon.applicationType;
    if (!acc[type]) {
      acc[type] = { name: type === 'all' ? 'Todos' : type === 'category' ? 'Categoria' : 'Específico', value: 0 };
    }
    acc[type].value++;
    return acc;
  }, {});
  
  // Dados para o gráfico de status dos cupons
  const statusData = coupons.reduce((acc: any, coupon) => {
    const status = coupon.status;
    if (!acc[status]) {
      acc[status] = { name: status === 'active' ? 'Ativo' : status === 'inactive' ? 'Inativo' : 'Expirado', value: 0 };
    }
    acc[status].value++;
    return acc;
  }, {});
  
  return {
    topUsedCoupons,
    applicationTypes: Object.values(applicationTypes),
    statusData: Object.values(statusData)
  };
};

// Cores para os gráficos
const COLORS = ['#FF5A5A', '#50A5FF', '#22C55E', '#A855F7', '#FBBF24'];

// Esquema de validação para o formulário de cupom
const couponFormSchema = z.object({
  code: z.string().min(3, {
    message: "O código precisa ter pelo menos 3 caracteres",
  }).max(10, {
    message: "O código não pode ter mais de 10 caracteres",
  }),
  percentage: z.coerce.number().min(1, {
    message: "A porcentagem deve ser no mínimo 1%",
  }).max(100, {
    message: "A porcentagem não pode ser maior que 100%",
  }),
  minimumAmount: z.coerce.number().min(0, {
    message: "O valor mínimo não pode ser negativo",
  }),
  applicationType: z.enum(['all', 'category', 'specific']),
  applicationTarget: z.array(z.string()).nullable(),
  maxUses: z.coerce.number().nullable(),
  status: z.enum(['active', 'inactive', 'expired']),
  durationType: z.enum(['days', 'hours', 'minutes', 'seconds', 'unlimited']),
  durationValue: z.coerce.number().nullable(),
});

type CouponFormValues = z.infer<typeof couponFormSchema>;

export function AdminCouponsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CouponStatus | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const glassStyles = useGlassmorphism();
  const { toast } = useToast();
  const chartData = generateChartData(coupons);
  
  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      code: "",
      percentage: 10,
      minimumAmount: 1,
      applicationType: "all",
      applicationTarget: null,
      maxUses: null,
      status: "active",
      durationType: "days",
      durationValue: 30,
    },
  });

  // Formatações de texto
  const getCouponStatus = (status: CouponStatus) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Ativo</Badge>;
      case 'inactive':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">Inativo</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Expirado</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">Desconhecido</Badge>;
    }
  };

  const getApplicationTypeText = (type: CouponApplicationType, targets?: string[] | null) => {
    switch (type) {
      case 'all':
        return "Todos os produtos";
      case 'category':
        if (!targets || targets.length === 0) return "Nenhuma categoria";
        return targets.map(category => {
          switch(category) {
            case 'proxy': return 'Proxy';
            case 'bm': return 'BM';
            case 'perfil': return 'Perfil';
            default: return category;
          }
        }).join(', ');
      case 'specific':
        if (!targets || targets.length === 0) return "Nenhum produto";
        return `${targets.length} produto(s) específico(s)`;
      default:
        return "Desconhecido";
    }
  };

  const getDurationText = (type: CouponDurationType, value: number | null) => {
    if (type === 'unlimited' || !value) return "Sem expiração";
    
    switch(type) {
      case 'days': return `${value} dia${value > 1 ? 's' : ''}`;
      case 'hours': return `${value} hora${value > 1 ? 's' : ''}`;
      case 'minutes': return `${value} minuto${value > 1 ? 's' : ''}`;
      case 'seconds': return `${value} segundo${value > 1 ? 's' : ''}`;
      default: return "Desconhecido";
    }
  };

  const getExpirationDate = (coupon: Coupon) => {
    if (coupon.expiresAt) {
      return format(new Date(coupon.expiresAt), "dd/MM/yyyy HH:mm", { locale: ptBR });
    }
    
    if (coupon.durationType === 'unlimited' || !coupon.durationValue) {
      return "Sem expiração";
    }
    
    const created = new Date(coupon.createdAt);
    let expiry;
    
    switch(coupon.durationType) {
      case 'days': 
        expiry = addDays(created, coupon.durationValue);
        break;
      case 'hours':
        expiry = addHours(created, coupon.durationValue);
        break;
      case 'minutes':
        expiry = addMinutes(created, coupon.durationValue);
        break;
      case 'seconds':
        expiry = addSeconds(created, coupon.durationValue);
        break;
      default:
        return "Desconhecido";
    }
    
    return format(expiry, "dd/MM/yyyy HH:mm", { locale: ptBR });
  };

  // Funções para manipular cupons
  const handleEditCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    form.reset({
      code: coupon.code,
      percentage: coupon.percentage,
      minimumAmount: coupon.minimumAmount,
      applicationType: coupon.applicationType,
      applicationTarget: coupon.applicationTarget,
      maxUses: coupon.maxUses,
      status: coupon.status,
      durationType: coupon.durationType,
      durationValue: coupon.durationValue,
    });
    setIsEditing(true);
  };

  const handleCreateCoupon = () => {
    form.reset({
      code: "",
      percentage: 10,
      minimumAmount: 1,
      applicationType: "all",
      applicationTarget: null,
      maxUses: null,
      status: "active",
      durationType: "days",
      durationValue: 30,
    });
    setIsCreating(true);
  };

  const onSubmit = (values: CouponFormValues) => {
    if (isEditing && selectedCoupon) {
      // Em uma aplicação real, isso atualizaria o cupom no backend
      toast({
        title: "Cupom atualizado",
        description: `Cupom ${values.code} foi atualizado com sucesso.`,
      });
      setIsEditing(false);
    } else if (isCreating) {
      // Em uma aplicação real, isso criaria um novo cupom no backend
      toast({
        title: "Cupom criado",
        description: `Cupom ${values.code} foi criado com sucesso.`,
      });
      setIsCreating(false);
    }
  };
  
  // Filtragem e paginação dos cupons
  const filteredCoupons = coupons.filter(coupon => {
    const matchesQuery = searchQuery === "" || 
      coupon.code.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || coupon.status === statusFilter;
    
    return matchesQuery && matchesStatus;
  });
  
  const paginatedCoupons = filteredCoupons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);

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
                <Tag className="text-primary h-5 w-5 mr-2" />
                <h1 className="text-white font-medium">Cupons de Desconto</h1>
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
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Cupons</h1>
              <p className="text-sm text-gray-400">
                Gerencie os cupons de desconto disponíveis na plataforma
              </p>
            </div>
            <Button 
              onClick={handleCreateCoupon} 
              className="bg-primary hover:bg-red-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Novo
            </Button>
          </div>

          {/* Dashboard de Análise */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Gráfico de Cupons Mais Usados */}
            <Card className={`${glassStyles.className} border-0`}>
              <CardHeader>
                <CardTitle className="text-md text-white">
                  <Ticket className="h-4 w-4 mr-2 inline-block" />
                  Cupons Mais Utilizados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData.topUsedCoupons}
                      layout="vertical"
                      margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis type="number" stroke="#9CA3AF" />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        stroke="#9CA3AF" 
                        tick={{ fill: "#E5E7EB" }}
                        width={60}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "#1F2937", 
                          borderColor: "#374151",
                          color: "#F9FAFB" 
                        }}
                        labelStyle={{ color: "#F9FAFB" }}
                      />
                      <Bar dataKey="uses" radius={[0, 4, 4, 0]}>
                        {chartData.topUsedCoupons.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Gráfico de Distribuição por Tipo de Aplicação */}
            <Card className={`${glassStyles.className} border-0`}>
              <CardHeader>
                <CardTitle className="text-md text-white">
                  <TagIcon className="h-4 w-4 mr-2 inline-block" />
                  Distribuição por Tipo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData.applicationTypes}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.applicationTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "#1F2937", 
                          borderColor: "#374151",
                          color: "#F9FAFB" 
                        }}
                        labelStyle={{ color: "#F9FAFB" }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Gráfico de Status dos Cupons */}
            <Card className={`${glassStyles.className} border-0`}>
              <CardHeader>
                <CardTitle className="text-md text-white">
                  <Percent className="h-4 w-4 mr-2 inline-block" />
                  Status dos Cupons
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData.statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.statusData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={index === 0 ? "#22C55E" : index === 1 ? "#FBBF24" : "#EF4444"} 
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "#1F2937", 
                          borderColor: "#374151",
                          color: "#F9FAFB" 
                        }}
                        labelStyle={{ color: "#F9FAFB" }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ferramentas e Filtros */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Buscar por código de cupom..."
                className="pl-10 bg-gray-900 border-gray-700 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Tabs 
              defaultValue="all" 
              className="w-full md:w-auto"
              onValueChange={(value) => setStatusFilter(value as CouponStatus | "all")}
            >
              <TabsList className="w-full md:w-auto bg-gray-900 border-gray-700">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="active">Ativos</TabsTrigger>
                <TabsTrigger value="inactive">Inativos</TabsTrigger>
                <TabsTrigger value="expired">Expirados</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Tabela de Cupons */}
          <div className={`${glassStyles.className} rounded-xl overflow-hidden`}>
            {paginatedCoupons.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">
                  Nenhum cupom encontrado com os filtros atuais.
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-white">Código</TableHead>
                        <TableHead className="text-white">Porcentagem</TableHead>
                        <TableHead className="text-white">Mínimo</TableHead>
                        <TableHead className="text-white">Produtos</TableHead>
                        <TableHead className="text-white">Usado</TableHead>
                        <TableHead className="text-white">Duração</TableHead>
                        <TableHead className="text-white">Status</TableHead>
                        <TableHead className="text-white text-center">Ativo</TableHead>
                        <TableHead className="text-white text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedCoupons.map((coupon) => (
                        <TableRow key={coupon.id}>
                          <TableCell className="font-medium text-white">
                            {coupon.code}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {coupon.percentage}%
                          </TableCell>
                          <TableCell className="text-gray-300">
                            R$ {coupon.minimumAmount.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {getApplicationTypeText(coupon.applicationType, coupon.applicationTarget)}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {coupon.timesUsed}x
                            {coupon.maxUses && (
                              <span className="text-xs text-gray-400 ml-1">
                                / {coupon.maxUses}
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {getDurationText(coupon.durationType, coupon.durationValue)}
                            <div className="text-xs text-gray-400">
                              {getExpirationDate(coupon)}
                            </div>
                          </TableCell>
                          <TableCell>
                            {getCouponStatus(coupon.status)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Switch 
                              checked={coupon.status === 'active'} 
                              onCheckedChange={(checked) => {
                                // Em uma aplicação real, isso atualizaria o status no backend
                                toast({
                                  title: checked ? "Cupom ativado" : "Cupom desativado",
                                  description: `O cupom ${coupon.code} foi ${checked ? 'ativado' : 'desativado'}.`,
                                });
                              }}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-gray-700 text-white hover:bg-gray-800"
                              onClick={() => handleEditCoupon(coupon)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Paginação */}
                <div className="py-4 px-6 border-t border-gray-800 flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    Exibindo {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, filteredCoupons.length)} de {filteredCoupons.length} cupons
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="border-gray-700 text-white hover:bg-gray-800"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="text-sm text-white">
                      Página {currentPage} de {totalPages}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="border-gray-700 text-white hover:bg-gray-800"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
      
      {/* Modal de Edição/Criação de Cupom */}
      <Dialog 
        open={isEditing || isCreating} 
        onOpenChange={(open) => {
          if (!open) {
            setIsEditing(false);
            setIsCreating(false);
          }
        }}
      >
        <DialogContent className={`${glassStyles.className} max-w-2xl mx-auto p-0 border-0 text-white`}>
          <DialogHeader className="p-6 border-b border-gray-800">
            <DialogTitle className="text-xl font-bold text-white">
              {isEditing ? `Editar Cupom: ${selectedCoupon?.code}` : "Criar Novo Cupom"}
            </DialogTitle>
            <DialogDescription className="text-gray-400 mt-1">
              {isEditing 
                ? "Atualize as informações do cupom de desconto" 
                : "Preencha os campos para criar um novo cupom de desconto"
              }
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Código do Cupom</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: DESCONTO10" 
                          {...field} 
                          className="bg-gray-900 border-gray-700 text-white"
                        />
                      </FormControl>
                      <FormDescription className="text-gray-400">
                        Código único que os usuários irão digitar
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="percentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Porcentagem de Desconto</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type="number" 
                            placeholder="10" 
                            {...field} 
                            className="bg-gray-900 border-gray-700 text-white pr-8"
                          />
                          <div className="absolute inset-y-0 right-3 flex items-center text-gray-400">
                            %
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription className="text-gray-400">
                        Percentual de desconto aplicado
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="minimumAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Valor Mínimo</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type="number" 
                            placeholder="1" 
                            {...field} 
                            className="bg-gray-900 border-gray-700 text-white pl-8"
                          />
                          <div className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                            R$
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription className="text-gray-400">
                        Valor mínimo para ativação do cupom
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="applicationType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Tipo de Aplicação</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-900 border-gray-700 text-white">
                          <SelectItem value="all">Todos os Produtos</SelectItem>
                          <SelectItem value="category">Categoria Específica</SelectItem>
                          <SelectItem value="specific">Produtos Específicos</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-gray-400">
                        Determina a que produtos o cupom se aplica
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Status</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-900 border-gray-700 text-white">
                          <SelectItem value="active">Ativo</SelectItem>
                          <SelectItem value="inactive">Inativo</SelectItem>
                          <SelectItem value="expired">Expirado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-gray-400">
                        Estado atual do cupom
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="maxUses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Limite de Usos</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Ilimitado" 
                          {...field} 
                          value={field.value === null ? "" : field.value}
                          onChange={(e) => {
                            const value = e.target.value === "" 
                              ? null 
                              : parseInt(e.target.value);
                            field.onChange(value);
                          }}
                          className="bg-gray-900 border-gray-700 text-white"
                        />
                      </FormControl>
                      <FormDescription className="text-gray-400">
                        Deixe em branco para usos ilimitados
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="durationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Duração</FormLabel>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                                <SelectValue placeholder="Tipo de duração" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-gray-900 border-gray-700 text-white">
                              <SelectItem value="unlimited">Ilimitado</SelectItem>
                              <SelectItem value="days">Dias</SelectItem>
                              <SelectItem value="hours">Horas</SelectItem>
                              <SelectItem value="minutes">Minutos</SelectItem>
                              <SelectItem value="seconds">Segundos</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          {field.value !== "unlimited" && (
                            <FormField
                              control={form.control}
                              name="durationValue"
                              render={({ field: durationField }) => (
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    placeholder="Valor" 
                                    {...durationField} 
                                    value={durationField.value === null ? "" : durationField.value}
                                    onChange={(e) => {
                                      const value = e.target.value === "" 
                                        ? null 
                                        : parseInt(e.target.value);
                                      durationField.onChange(value);
                                    }}
                                    className="bg-gray-900 border-gray-700 text-white"
                                  />
                                </FormControl>
                              )}
                            />
                          )}
                        </div>
                        <FormDescription className="text-gray-400">
                          Por quanto tempo o cupom ficará válido após sua criação
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <DialogFooter className="pt-6 border-t border-gray-800">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="border-gray-700 text-white hover:bg-gray-800"
                  onClick={() => {
                    setIsEditing(false);
                    setIsCreating(false);
                  }}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  className="bg-primary hover:bg-red-700"
                >
                  {isEditing ? "Salvar alterações" : "Criar cupom"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminCouponsPage;