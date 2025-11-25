import { useState, useRef, useEffect } from "react";
import { useGlassmorphism } from "@/hooks/useGlassmorphism";
import ThemeToggle from "@/components/layout/ThemeToggle";
import Sidebar from "@/components/layout/Sidebar";
import { 
  Search, 
  Plus, 
  Trash2, 
  Edit, 
  Copy, 
  Tag, 
  Package, 
  Boxes, 
  ShoppingBag, 
  Upload, 
  FileText, 
  Link as LinkIcon, 
  CheckCircle2, 
  Filter, 
  Menu, 
  LayoutGrid
} from "lucide-react";
import { products, categories, productContents } from "@/mocks/data";
import { Product, Category, ProductContent, ProductStatus, ProductType, ProductTag, ProductCategory } from "@/types";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { toast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export function ProductManagementPage() {
  const glassStyles = useGlassmorphism();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("products");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "all">("all");
  const [productsList, setProductsList] = useState<Product[]>(products);
  const [categoriesList, setCategoriesList] = useState<Category[]>(categories);
  const [productContentsList, setProductContentsList] = useState<ProductContent[]>(productContents);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  
  // Referência para input de arquivo
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Modal de edição/criação
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [uploadType, setUploadType] = useState<'file' | 'link'>('file');
  const [uploadContent, setUploadContent] = useState<string>('');
  const [uploadFiles, setUploadFiles] = useState<FileList | null>(null);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  // Filtragem de produtos
  const filteredProducts = productsList.filter(product => {
    // Aplicar filtro de busca
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Aplicar filtro de categoria
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    
    // Aplicar filtro de status
    const matchesStatus = statusFilter === "all" || product.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Filtragem de produtos específica para a visualização principal (mostra apenas ativos)
  const publicProducts = productsList.filter(product => product.status === 'active');
  
  // Filtragem de produtos específica para o estoque interno
  const internalStockProducts = productsList.filter(product => product.status === 'internal_stock');

  // Cálculo de quantidade disponível de um produto
  const getAvailableStock = (productId: number) => {
    const contents = productContentsList.filter(
      content => content.productId === productId && content.isAvailable
    );
    return contents.length;
  };

  // Atualizar estoque disponível quando o conteúdo de produtos mudar
  useEffect(() => {
    const updatedProducts = productsList.map(product => {
      const availableStock = getAvailableStock(product.id);
      return { ...product, stock: availableStock };
    });
    setProductsList(updatedProducts);
  }, [productContentsList]);

  // Funções para manipulação de produtos
  const handleEditProduct = (product: Product) => {
    setEditingProduct({...product});
    setEditingProductId(product.id);
    setIsEditModalOpen(true);
  };

  const handleAddProduct = () => {
    setEditingProduct({
      title: '',
      description: '',
      price: 0,
      image: 'https://via.placeholder.com/150',
      category: 'proxy',
      productType: 'proxy',
      tags: [],
      period: '30 dias',
      status: 'internal_stock', // Novos produtos começam no estoque interno
      dateCreated: new Date().toISOString(),
      dateModified: new Date().toISOString(),
    });
    setEditingProductId(null);
    setIsEditModalOpen(true);
  };

  const handleDeleteProduct = (id: number) => {
    const updatedProducts = productsList.filter(product => product.id !== id);
    setProductsList(updatedProducts);
    
    // Remover conteúdos associados ao produto
    const updatedContents = productContentsList.filter(content => content.productId !== id);
    setProductContentsList(updatedContents);
    
    toast({
      title: "Produto excluído",
      description: "O produto foi removido com sucesso.",
    });
  };

  const handleDuplicateProduct = (product: Product) => {
    const newProduct = {
      ...product,
      id: Math.max(...productsList.map(p => p.id)) + 1,
      title: `${product.title} (Cópia)`,
      dateCreated: new Date().toISOString(),
      dateModified: new Date().toISOString(),
    };
    
    setProductsList([...productsList, newProduct]);
    
    // Duplicar conteúdos associados ao produto
    const productContents = productContentsList.filter(content => content.productId === product.id);
    const newContents = productContents.map(content => ({
      ...content,
      id: Math.max(...productContentsList.map(c => c.id)) + 1,
      productId: newProduct.id,
    }));
    
    setProductContentsList([...productContentsList, ...newContents]);
    
    toast({
      title: "Produto duplicado",
      description: "Uma cópia do produto foi criada com sucesso.",
    });
  };

  const handleSaveProduct = () => {
    if (!editingProduct || !editingProduct.title || !editingProduct.category) {
      toast({
        title: "Dados incompletos",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    
    if (editingProductId) {
      // Atualizando produto existente
      const updatedProducts = productsList.map(product => 
        product.id === editingProductId ? 
          {...editingProduct, id: editingProductId, dateModified: new Date().toISOString()} as Product : 
          product
      );
      setProductsList(updatedProducts);
      
      toast({
        title: "Produto atualizado",
        description: "As alterações foram salvas com sucesso.",
      });
    } else {
      // Criando novo produto
      const newId = Math.max(...productsList.map(p => p.id)) + 1;
      const newProduct = {
        ...editingProduct,
        id: newId,
        stock: 0,
        dateCreated: new Date().toISOString(),
        dateModified: new Date().toISOString(),
      } as Product;
      
      setProductsList([...productsList, newProduct]);
      
      toast({
        title: "Produto criado",
        description: "O novo produto foi adicionado com sucesso.",
      });
    }
    
    setIsEditModalOpen(false);
    setEditingProduct(null);
    setEditingProductId(null);
  };

  // Funções para manipulação de categorias
  const handleAddCategory = () => {
    setEditingCategory({
      name: '',
      description: '',
      productCount: 0,
    });
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory({...category});
    setIsCategoryModalOpen(true);
  };

  const handleDeleteCategory = (id: number) => {
    // Verificar se há produtos usando essa categoria
    const productsUsingCategory = productsList.filter(
      product => categories.find(c => c.id === id)?.name.toLowerCase() === product.category
    );
    
    if (productsUsingCategory.length > 0) {
      toast({
        title: "Não é possível excluir",
        description: "Existem produtos associados a esta categoria.",
        variant: "destructive",
      });
      return;
    }
    
    const updatedCategories = categoriesList.filter(category => category.id !== id);
    setCategoriesList(updatedCategories);
    
    toast({
      title: "Categoria excluída",
      description: "A categoria foi removida com sucesso.",
    });
  };

  const handleSaveCategory = () => {
    if (!editingCategory || !editingCategory.name) {
      toast({
        title: "Dados incompletos",
        description: "O nome da categoria é obrigatório.",
        variant: "destructive",
      });
      return;
    }
    
    if (editingCategory.id) {
      // Atualizando categoria existente
      const updatedCategories = categoriesList.map(category => 
        category.id === editingCategory.id ? {...editingCategory as Category} : category
      );
      setCategoriesList(updatedCategories);
      
      toast({
        title: "Categoria atualizada",
        description: "As alterações foram salvas com sucesso.",
      });
    } else {
      // Criando nova categoria
      const newId = Math.max(...categoriesList.map(c => c.id)) + 1;
      const newCategory = {
        ...editingCategory,
        id: newId,
        productCount: 0,
      } as Category;
      
      setCategoriesList([...categoriesList, newCategory]);
      
      toast({
        title: "Categoria criada",
        description: "A nova categoria foi adicionada com sucesso.",
      });
    }
    
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  };

  // Funções para upload de arquivos/conteúdo
  const handleAddContent = () => {
    if (!selectedProduct) {
      toast({
        title: "Nenhum produto selecionado",
        description: "Selecione um produto para adicionar conteúdo.",
        variant: "destructive",
      });
      return;
    }
    
    setUploadType('file');
    setUploadContent('');
    setUploadFiles(null);
    setIsUploadModalOpen(true);
  };

  const handleSaveContent = () => {
    if (!selectedProduct) return;
    
    if (uploadType === 'file' && uploadFiles) {
      // Processar arquivos
      const newContents: ProductContent[] = [];
      const maxId = Math.max(...productContentsList.map(c => c.id));
      
      Array.from(uploadFiles).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            const content = {
              id: maxId + index + 1,
              productId: selectedProduct.id,
              type: 'file' as const,
              content: e.target.result.toString(),
              fileName: file.name,
              fileType: file.type,
              isAvailable: true,
            };
            
            newContents.push(content);
            
            if (index === uploadFiles.length - 1) {
              setProductContentsList([...productContentsList, ...newContents]);
              
              toast({
                title: "Conteúdo adicionado",
                description: `${uploadFiles.length} arquivo(s) foram adicionados com sucesso.`,
              });
              
              setIsUploadModalOpen(false);
            }
          }
        };
        reader.readAsText(file);
      });
    } else if (uploadType === 'link' && uploadContent) {
      // Processar link
      const newContent: ProductContent = {
        id: Math.max(...productContentsList.map(c => c.id)) + 1,
        productId: selectedProduct.id,
        type: 'link',
        content: uploadContent,
        isAvailable: true,
      };
      
      setProductContentsList([...productContentsList, newContent]);
      
      toast({
        title: "Conteúdo adicionado",
        description: "O link foi adicionado com sucesso.",
      });
      
      setIsUploadModalOpen(false);
    } else {
      toast({
        title: "Dados incompletos",
        description: "Adicione um arquivo ou link válido.",
        variant: "destructive",
      });
    }
  };

  const handleMoveToStore = (product: Product) => {
    // Verificar se há conteúdo disponível
    const availableStock = getAvailableStock(product.id);
    
    if (availableStock === 0) {
      toast({
        title: "Sem estoque",
        description: "Adicione conteúdo ao produto antes de enviá-lo para a loja.",
        variant: "destructive",
      });
      return;
    }
    
    // Mover produto para a loja (status ativo)
    const updatedProducts = productsList.map(p => 
      p.id === product.id ? {...p, status: 'active' as ProductStatus} : p
    );
    
    setProductsList(updatedProducts);
    
    toast({
      title: "Produto disponibilizado",
      description: "O produto agora está disponível para venda na loja.",
    });
  };

  // Formatação de valores
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Renderização dos cards de produtos
  const renderProductCard = (product: Product) => {
    const availableStock = getAvailableStock(product.id);
    
    return (
      <Card key={product.id} className={`${glassStyles.className} overflow-hidden hover:border-primary/50 transition-all duration-300`}>
        <div className="relative h-40 overflow-hidden">
          <img 
            src={product.image} 
            alt={product.title} 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-2 left-3 right-3 flex justify-between items-center">
            <Badge className="bg-primary/90">{product.category}</Badge>
            {product.status === 'active' ? (
              <Badge className="bg-green-600/90">Ativo</Badge>
            ) : (
              <Badge className="bg-amber-600/90">Estoque interno</Badge>
            )}
          </div>
        </div>
        
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold line-clamp-1">{product.title}</CardTitle>
          <CardDescription className="line-clamp-2 text-gray-400">{product.description}</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-2 pb-2 pt-0">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Preço:</span>
            <span className="font-medium text-white">{formatCurrency(product.price)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Estoque:</span>
            <span className={`font-medium ${availableStock > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {availableStock} unidades
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Periodo:</span>
            <span className="font-medium text-gray-300">{product.period}</span>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-2 pb-3 pt-1">
          <div className="flex gap-2 w-full">
            <Button
              variant="default"
              size="sm"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={() => handleEditProduct(product)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Editar
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {product.status === 'internal_stock' && (
                  <DropdownMenuItem onClick={() => handleMoveToStore(product)}>
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Enviar para Loja
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => handleDuplicateProduct(product)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicar
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-500"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={() => {
              setSelectedProduct(product);
              setActiveTab('contents');
            }}
          >
            <Package className="h-4 w-4 mr-1" />
            Gerenciar Conteúdo
          </Button>
        </CardFooter>
      </Card>
    );
  };

  // Renderização da interface
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
                <Package className="text-primary h-5 w-5 mr-2" />
                <h1 className="text-white font-medium">Gerenciamento de Produtos</h1>
              </div>
            </div>
          </div>
        </header>
        
        <main className="px-6 py-8">
          <Tabs defaultValue="products" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex flex-wrap items-center justify-between mb-6">
              <TabsList className="mb-4 md:mb-0 bg-gray-900/50 border border-gray-800">
                <TabsTrigger value="products" className="data-[state=active]:bg-primary/20">
                  <Package className="h-4 w-4 mr-2" />
                  Produtos
                </TabsTrigger>
                <TabsTrigger value="categories" className="data-[state=active]:bg-primary/20">
                  <Tag className="h-4 w-4 mr-2" />
                  Categorias
                </TabsTrigger>
                <TabsTrigger value="internal" className="data-[state=active]:bg-primary/20">
                  <Boxes className="h-4 w-4 mr-2" />
                  Estoque Interno
                </TabsTrigger>
                {selectedProduct && (
                  <TabsTrigger value="contents" className="data-[state=active]:bg-primary/20">
                    <FileText className="h-4 w-4 mr-2" />
                    Conteúdo de {selectedProduct.title.substring(0, 15)}...
                  </TabsTrigger>
                )}
              </TabsList>
              
              <div className="flex flex-wrap gap-3 ml-auto">
                {(activeTab === 'products' || activeTab === 'internal') && (
                  <div className="flex items-center">
                    <Button 
                      variant="outline" 
                      size="icon"
                      className={`rounded-r-none ${viewMode === 'list' ? 'bg-gray-800' : ''}`}
                      onClick={() => setViewMode('list')}
                    >
                      <Menu className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className={`rounded-l-none ${viewMode === 'grid' ? 'bg-gray-800' : ''}`}
                      onClick={() => setViewMode('grid')}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                {activeTab === 'products' && (
                  <Button variant="default" onClick={handleAddProduct}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Produto
                  </Button>
                )}
                
                {activeTab === 'categories' && (
                  <Button variant="default" onClick={handleAddCategory}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Categoria
                  </Button>
                )}
                
                {activeTab === 'contents' && selectedProduct && (
                  <Button variant="default" onClick={handleAddContent}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Conteúdo
                  </Button>
                )}
              </div>
            </div>
            
            {/* Barra de filtros e busca */}
            {(activeTab === 'products' || activeTab === 'internal') && (
              <div className={`${glassStyles.className} p-4 rounded-lg mb-6 flex flex-wrap gap-4 border border-gray-800`}>
                <div className="relative flex-grow max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar produtos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 bg-background/50 border-gray-700"
                  />
                </div>
                
                <div className="flex gap-3">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px] bg-background/50 border-gray-700">
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as categorias</SelectItem>
                      {categoriesList.map((category) => (
                        <SelectItem key={category.id} value={category.name.toLowerCase()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {activeTab === 'products' && (
                    <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ProductStatus | 'all')}>
                      <SelectTrigger className="w-[180px] bg-background/50 border-gray-700">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os status</SelectItem>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                        <SelectItem value="internal_stock">Estoque Interno</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            )}
            
            <TabsContent value="products" className="mt-0">
              {/* Listagem de produtos */}
              {filteredProducts.length === 0 ? (
                <div className={`${glassStyles.className} rounded-lg p-12 text-center border border-gray-800`}>
                  <Package className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">Nenhum produto encontrado</h3>
                  <p className="text-gray-400 mb-6">Adicione seu primeiro produto ou ajuste seus filtros de busca.</p>
                  <Button variant="default" onClick={handleAddProduct}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Produto
                  </Button>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredProducts.map(product => renderProductCard(product))}
                </div>
              ) : (
                <div className={`${glassStyles.className} rounded-lg overflow-hidden border border-gray-800`}>
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-gray-800/50 border-gray-800">
                        <TableHead className="w-12">ID</TableHead>
                        <TableHead>Produto</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead>Estoque</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => {
                        const availableStock = getAvailableStock(product.id);
                        
                        return (
                          <TableRow 
                            key={product.id}
                            className="hover:bg-gray-800/50 border-gray-800"
                          >
                            <TableCell className="font-medium">{product.id}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 rounded overflow-hidden bg-gray-700 flex-shrink-0">
                                  <img 
                                    src={product.image} 
                                    alt={product.title} 
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div>
                                  <div className="font-medium text-white">{product.title}</div>
                                  <div className="text-xs text-gray-400 line-clamp-1">
                                    {product.description}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{product.category}</Badge>
                            </TableCell>
                            <TableCell>{formatCurrency(product.price)}</TableCell>
                            <TableCell>
                              <span className={`font-medium ${availableStock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {availableStock}
                              </span>
                            </TableCell>
                            <TableCell>
                              {product.status === 'active' ? (
                                <Badge className="bg-green-600/50 hover:bg-green-600">Ativo</Badge>
                              ) : product.status === 'inactive' ? (
                                <Badge className="bg-gray-600/50 hover:bg-gray-600">Inativo</Badge>
                              ) : (
                                <Badge className="bg-amber-600/50 hover:bg-amber-600">Estoque Interno</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setSelectedProduct(product);
                                    setActiveTab('contents');
                                  }}
                                >
                                  <Package className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditProduct(product)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDuplicateProduct(product)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                {product.status === 'internal_stock' && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleMoveToStore(product)}
                                  >
                                    <ShoppingBag className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="text-red-500"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="categories" className="mt-0">
              {/* Listagem de categorias */}
              {categoriesList.length === 0 ? (
                <div className={`${glassStyles.className} rounded-lg p-12 text-center border border-gray-800`}>
                  <Tag className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">Nenhuma categoria encontrada</h3>
                  <p className="text-gray-400 mb-6">Adicione sua primeira categoria para organizar os produtos.</p>
                  <Button variant="default" onClick={handleAddCategory}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Categoria
                  </Button>
                </div>
              ) : (
                <div className={`${glassStyles.className} rounded-lg overflow-hidden border border-gray-800`}>
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-gray-800/50 border-gray-800">
                        <TableHead className="w-12">ID</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Produtos</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categoriesList.map((category) => (
                        <TableRow 
                          key={category.id}
                          className="hover:bg-gray-800/50 border-gray-800"
                        >
                          <TableCell className="font-medium">{category.id}</TableCell>
                          <TableCell className="font-medium text-white">{category.name}</TableCell>
                          <TableCell>{category.description || '-'}</TableCell>
                          <TableCell>{category.productCount}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditCategory(category)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteCategory(category.id)}
                                className="text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="internal" className="mt-0">
              {/* Listagem de produtos em estoque interno */}
              {internalStockProducts.length === 0 ? (
                <div className={`${glassStyles.className} rounded-lg p-12 text-center border border-gray-800`}>
                  <Boxes className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">Estoque interno vazio</h3>
                  <p className="text-gray-400 mb-6">Adicione produtos ao estoque interno para prepará-los para venda.</p>
                  <Button variant="default" onClick={handleAddProduct}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar ao Estoque
                  </Button>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {internalStockProducts.map(product => renderProductCard(product))}
                </div>
              ) : (
                <div className={`${glassStyles.className} rounded-lg overflow-hidden border border-gray-800`}>
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-gray-800/50 border-gray-800">
                        <TableHead className="w-12">ID</TableHead>
                        <TableHead>Produto</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead>Estoque</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {internalStockProducts.map((product) => {
                        const availableStock = getAvailableStock(product.id);
                        
                        return (
                          <TableRow 
                            key={product.id}
                            className="hover:bg-gray-800/50 border-gray-800"
                          >
                            <TableCell className="font-medium">{product.id}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 rounded overflow-hidden bg-gray-700 flex-shrink-0">
                                  <img 
                                    src={product.image} 
                                    alt={product.title} 
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div>
                                  <div className="font-medium text-white">{product.title}</div>
                                  <div className="text-xs text-gray-400 line-clamp-1">
                                    {product.description}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{product.category}</Badge>
                            </TableCell>
                            <TableCell>{formatCurrency(product.price)}</TableCell>
                            <TableCell>
                              <span className={`font-medium ${availableStock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {availableStock}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setSelectedProduct(product);
                                    setActiveTab('contents');
                                  }}
                                >
                                  <Package className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditProduct(product)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleMoveToStore(product)}
                                  disabled={availableStock === 0}
                                >
                                  <ShoppingBag className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="text-red-500"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="contents" className="mt-0">
              {/* Listagem de conteúdos do produto selecionado */}
              {!selectedProduct ? (
                <div className={`${glassStyles.className} rounded-lg p-12 text-center border border-gray-800`}>
                  <FileText className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">Nenhum produto selecionado</h3>
                  <p className="text-gray-400 mb-6">Selecione um produto para gerenciar seu conteúdo.</p>
                  <Button variant="outline" onClick={() => setActiveTab('products')}>
                    Voltar para Produtos
                  </Button>
                </div>
              ) : (
                <>
                  <div className={`${glassStyles.className} rounded-lg p-6 mb-6 border border-gray-800`}>
                    <div className="flex flex-wrap gap-6">
                      <div className="h-24 w-24 rounded overflow-hidden bg-gray-700 flex-shrink-0">
                        <img 
                          src={selectedProduct.image} 
                          alt={selectedProduct.title} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-white mb-2">{selectedProduct.title}</h2>
                        <p className="text-gray-400 mb-4">{selectedProduct.description}</p>
                        <div className="flex flex-wrap gap-x-6 gap-y-2">
                          <div>
                            <span className="text-gray-400 text-sm">Categoria:</span>
                            <span className="ml-2 text-white">{selectedProduct.category}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm">Preço:</span>
                            <span className="ml-2 text-white">{formatCurrency(selectedProduct.price)}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm">Status:</span>
                            <span className="ml-2">
                              {selectedProduct.status === 'active' ? (
                                <Badge className="bg-green-600/50">Ativo</Badge>
                              ) : selectedProduct.status === 'inactive' ? (
                                <Badge className="bg-gray-600/50">Inativo</Badge>
                              ) : (
                                <Badge className="bg-amber-600/50">Estoque Interno</Badge>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-between items-end">
                        <div className="text-right">
                          <div className="text-gray-400 text-sm">Estoque Disponível</div>
                          <div className="text-2xl font-bold text-white">
                            {getAvailableStock(selectedProduct.id)}
                          </div>
                        </div>
                        <Button variant="default" onClick={handleAddContent}>
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar Conteúdo
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Listagem de conteúdos */}
                  {productContentsList.filter(content => content.productId === selectedProduct.id).length === 0 ? (
                    <div className={`${glassStyles.className} rounded-lg p-12 text-center border border-gray-800`}>
                      <FileText className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                      <h3 className="text-xl font-medium text-white mb-2">Nenhum conteúdo disponível</h3>
                      <p className="text-gray-400 mb-6">
                        Este produto não tem conteúdo. Adicione arquivos ou links para disponibilizá-lo para venda.
                      </p>
                      <Button variant="default" onClick={handleAddContent}>
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Conteúdo
                      </Button>
                    </div>
                  ) : (
                    <div className={`${glassStyles.className} rounded-lg overflow-hidden border border-gray-800`}>
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-gray-800/50 border-gray-800">
                            <TableHead className="w-12">ID</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Conteúdo</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {productContentsList
                            .filter(content => content.productId === selectedProduct.id)
                            .map((content) => (
                              <TableRow 
                                key={content.id}
                                className="hover:bg-gray-800/50 border-gray-800"
                              >
                                <TableCell className="font-medium">{content.id}</TableCell>
                                <TableCell>
                                  {content.type === 'file' ? (
                                    <Badge className="bg-blue-600/50">
                                      <FileText className="h-3 w-3 mr-1" />
                                      Arquivo
                                    </Badge>
                                  ) : (
                                    <Badge className="bg-purple-600/50">
                                      <LinkIcon className="h-3 w-3 mr-1" />
                                      Link
                                    </Badge>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {content.type === 'file' ? (
                                    <div className="flex items-center">
                                      <FileText className="h-4 w-4 mr-2 text-gray-400" />
                                      <span className="text-gray-300">{content.fileName}</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center">
                                      <LinkIcon className="h-4 w-4 mr-2 text-gray-400" />
                                      <span className="text-gray-300 truncate max-w-md">
                                        {content.content}
                                      </span>
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {content.isAvailable ? (
                                    <Badge className="bg-green-600/50">Disponível</Badge>
                                  ) : (
                                    <Badge className="bg-gray-600/50">Vendido</Badge>
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      // Excluir conteúdo
                                      const updatedContents = productContentsList.filter(c => c.id !== content.id);
                                      setProductContentsList(updatedContents);
                                      
                                      toast({
                                        title: "Conteúdo removido",
                                        description: "O conteúdo foi removido com sucesso.",
                                      });
                                    }}
                                    className="text-red-500"
                                    disabled={!content.isAvailable}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
      
      <ThemeToggle />
      
      {/* Modal de edição/criação de produto */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[550px] bg-gray-900 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle>{editingProductId ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para {editingProductId ? 'atualizar o' : 'criar um novo'} produto.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Título
              </Label>
              <Input
                id="title"
                value={editingProduct?.title || ''}
                onChange={(e) => setEditingProduct({...editingProduct, title: e.target.value})}
                className="col-span-3 bg-gray-800 border-gray-700"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Descrição
              </Label>
              <Textarea
                id="description"
                value={editingProduct?.description || ''}
                onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                className="col-span-3 bg-gray-800 border-gray-700"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Categoria
              </Label>
              <Select 
                value={editingProduct?.category || 'proxy'}
                onValueChange={(value) => setEditingProduct({...editingProduct, category: value as ProductCategory})}
              >
                <SelectTrigger id="category" className="col-span-3 bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categoriesList.map((category) => (
                    <SelectItem key={category.id} value={category.name.toLowerCase()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="productType" className="text-right">
                Tipo
              </Label>
              <Select 
                value={editingProduct?.productType || 'proxy'}
                onValueChange={(value) => setEditingProduct({...editingProduct, productType: value as ProductType})}
              >
                <SelectTrigger id="productType" className="col-span-3 bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="proxy">Proxy</SelectItem>
                  <SelectItem value="perfil">Perfil</SelectItem>
                  <SelectItem value="bm">Business Manager</SelectItem>
                  <SelectItem value="pagina">Página</SelectItem>
                  <SelectItem value="contingencia">Contingência</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Preço (R$)
              </Label>
              <Input
                id="price"
                type="number"
                value={editingProduct?.price || 0}
                onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                className="col-span-3 bg-gray-800 border-gray-700"
                min={0}
                step={0.01}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="period" className="text-right">
                Período
              </Label>
              <Input
                id="period"
                value={editingProduct?.period || ''}
                onChange={(e) => setEditingProduct({...editingProduct, period: e.target.value})}
                className="col-span-3 bg-gray-800 border-gray-700"
                placeholder="Ex: 30 dias, Acesso único"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Imagem (URL)
              </Label>
              <Input
                id="image"
                value={editingProduct?.image || ''}
                onChange={(e) => setEditingProduct({...editingProduct, image: e.target.value})}
                className="col-span-3 bg-gray-800 border-gray-700"
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tag" className="text-right">
                Tag
              </Label>
              <Select 
                value={editingProduct?.tags?.[0] || 'none'}
                onValueChange={(value) => setEditingProduct({
                  ...editingProduct, 
                  tags: value === 'none' ? [] : [value]
                })}
              >
                <SelectTrigger id="tag" className="col-span-3 bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Selecione uma tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhuma</SelectItem>
                  <SelectItem value="popular">Popular</SelectItem>
                  <SelectItem value="promocao">Promoção</SelectItem>
                  <SelectItem value="alta_demanda">Alta Demanda</SelectItem>
                  <SelectItem value="novo">Novo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {editingProductId && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select 
                  value={editingProduct?.status || 'internal_stock'}
                  onValueChange={(value) => setEditingProduct({
                    ...editingProduct, 
                    status: value as ProductStatus
                  })}
                >
                  <SelectTrigger id="status" className="col-span-3 bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                    <SelectItem value="internal_stock">Estoque Interno</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveProduct}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal de edição/criação de categoria */}
      <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-gray-900 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle>{editingCategory?.id ? 'Editar Categoria' : 'Nova Categoria'}</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para {editingCategory?.id ? 'atualizar a' : 'criar uma nova'} categoria.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoryName" className="text-right">
                Nome
              </Label>
              <Input
                id="categoryName"
                value={editingCategory?.name || ''}
                onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                className="col-span-3 bg-gray-800 border-gray-700"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoryDescription" className="text-right">
                Descrição
              </Label>
              <Textarea
                id="categoryDescription"
                value={editingCategory?.description || ''}
                onChange={(e) => setEditingCategory({...editingCategory, description: e.target.value})}
                className="col-span-3 bg-gray-800 border-gray-700"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCategoryModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveCategory}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal de upload de conteúdo */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-gray-900 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle>Adicionar Conteúdo</DialogTitle>
            <DialogDescription>
              Adicione arquivos ou links ao produto {selectedProduct?.title}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant={uploadType === 'file' ? 'default' : 'outline'}
                className={uploadType === 'file' ? 'bg-primary' : 'bg-gray-800'}
                onClick={() => setUploadType('file')}
              >
                <FileText className="h-4 w-4 mr-2" />
                Arquivo
              </Button>
              <Button
                variant={uploadType === 'link' ? 'default' : 'outline'}
                className={uploadType === 'link' ? 'bg-primary' : 'bg-gray-800'}
                onClick={() => setUploadType('link')}
              >
                <LinkIcon className="h-4 w-4 mr-2" />
                Link
              </Button>
            </div>
            
            {uploadType === 'file' ? (
              <div>
                <Label htmlFor="file-upload" className="block mb-2">
                  Selecione o(s) arquivo(s)
                </Label>
                <div
                  className="border-dashed border-2 border-gray-600 rounded-lg p-10 text-center cursor-pointer hover:border-primary transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-10 w-10 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-300 mb-2">{uploadFiles ? `${uploadFiles.length} arquivo(s) selecionado(s)` : 'Clique para selecionar arquivos'}</p>
                  <p className="text-xs text-gray-500">Suporta arquivos TXT e PDF (para perfis e páginas)</p>
                  <input
                    type="file"
                    id="file-upload"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    accept=".txt,.pdf"
                    onChange={(e) => setUploadFiles(e.target.files)}
                  />
                </div>
              </div>
            ) : (
              <div>
                <Label htmlFor="content-link" className="block mb-2">
                  Informe o link
                </Label>
                <Textarea
                  id="content-link"
                  value={uploadContent}
                  onChange={(e) => setUploadContent(e.target.value)}
                  className="bg-gray-800 border-gray-700"
                  rows={3}
                  placeholder="https://exemplo.com"
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveContent}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Input file oculto */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        multiple
        accept=".txt,.pdf"
        onChange={(e) => setUploadFiles(e.target.files)}
      />
    </div>
  );
}

export default ProductManagementPage;