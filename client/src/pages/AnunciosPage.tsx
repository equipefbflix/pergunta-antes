import { useState } from "react";
import Header from "@/components/layout/Header";
import { useGlassmorphism } from "@/hooks/useGlassmorphism";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Home, 
  CreditCard, 
  AlertCircle, 
  Package, 
  Newspaper, 
  Upload, 
  Plus, 
  Flame,
  Info
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// Tipos para o módulo de anúncios
interface AdPosition {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: React.ReactNode;
  preview: string;
}

interface Advertisement {
  id: number;
  name: string;
  position: string;
  imageUrl: string;
  link: string;
  description?: string;
  status: 'active' | 'expired';
  createdAt: string;
}

export function AnunciosPage() {
  const glassStyles = useGlassmorphism();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPosition, setSelectedPosition] = useState<AdPosition | null>(null);
  const [adModalOpen, setAdModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  // Form states
  const [adName, setAdName] = useState("");
  const [adLink, setAdLink] = useState("");
  const [adDescription, setAdDescription] = useState("");
  
  // Histórico de anúncios (mockado)
  const [adHistory, setAdHistory] = useState<Advertisement[]>([
    {
      id: 1,
      name: "Promoção de Verão",
      position: "Banner principal",
      imageUrl: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=300",
      link: "https://exemplo.com/promo",
      description: "Oferta especial de verão com 30% OFF.",
      status: 'active',
      createdAt: "2023-10-15"
    }
  ]);
  
  // Posições de anúncios disponíveis
  const adPositions: AdPosition[] = [
    {
      id: "banner_home",
      name: "Banner principal",
      description: "Exibido no topo da página inicial com máxima visibilidade",
      price: 300,
      icon: <Home className="h-6 w-6" />,
      preview: "https://images.unsplash.com/photo-1583339793403-3d9b001b6008?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=150"
    },
    {
      id: "checkout",
      name: "Página de checkout",
      description: "Exibido antes do botão de finalizar compra",
      price: 250,
      icon: <CreditCard className="h-6 w-6" />,
      preview: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=150"
    },
    {
      id: "popup",
      name: "Pop-up",
      description: "Exibido quando o usuário entra na plataforma",
      price: 200,
      icon: <AlertCircle className="h-6 w-6" />,
      preview: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=150"
    },
    {
      id: "products",
      name: "Entre produtos",
      description: "Exibido na listagem de produtos da página inicial",
      price: 150,
      icon: <Package className="h-6 w-6" />,
      preview: "https://images.unsplash.com/photo-1591033594798-33227a05780d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=150"
    },
    {
      id: "dedicated",
      name: "Página dedicada",
      description: "Exibido na página de anúncios especiais",
      price: 100,
      icon: <Newspaper className="h-6 w-6" />,
      preview: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=150"
    }
  ];
  
  const handleSelectPosition = (position: AdPosition) => {
    setSelectedPosition(position);
    setAdModalOpen(true);
  };
  
  const handleCloseAdModal = () => {
    setAdModalOpen(false);
    setTimeout(() => {
      setSelectedPosition(null);
      setAdName("");
      setAdLink("");
      setAdDescription("");
      setPreviewImage(null);
    }, 300);
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmitAd = () => {
    // Verificação do saldo
    if (!user || user.balance < (selectedPosition?.price || 0)) {
      toast({
        title: "Saldo insuficiente",
        description: "Você não possui saldo suficiente para este anúncio.",
        variant: "destructive"
      });
      return;
    }
    
    // Validação do formulário
    if (!adName || !adLink || !previewImage) {
      toast({
        title: "Formulário incompleto",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    setConfirmModalOpen(true);
  };
  
  const handleConfirmAd = () => {
    // Simulação de criação de anúncio
    const newAd: Advertisement = {
      id: Date.now(),
      name: adName,
      position: selectedPosition?.name || "",
      imageUrl: previewImage || "https://via.placeholder.com/300x150",
      link: adLink,
      description: adDescription,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setAdHistory([newAd, ...adHistory]);
    
    // Simulação de desconto do saldo
    // Nota: em uma implementação real, isso seria feito no backend
    
    toast({
      title: "Anúncio criado com sucesso!",
      description: "Seu anúncio será exibido conforme a disponibilidade.",
    });
    
    setConfirmModalOpen(false);
    handleCloseAdModal();
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        {/* Barra de destaque */}
        <div className="mb-8 p-4 bg-gradient-to-r from-amber-600 to-red-600 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="h-6 w-6 text-white animate-pulse" />
              <p className="font-semibold text-white">Espaço limitado! Reserve seu anúncio agora.</p>
            </div>
            <Badge variant="secondary" className="bg-white text-amber-600 px-3 py-1 text-xs font-medium rounded-full">
              Premium
            </Badge>
          </div>
        </div>
        
        {/* Header da página */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold dark:text-white text-gray-900 mb-4">Anuncie em nosso site</h1>
          <p className="text-lg dark:text-gray-300 text-gray-600 max-w-3xl mx-auto">
            Promova seu negócio dentro da plataforma usando o saldo disponível. 
            Escolha onde quer aparecer para ganhar mais visibilidade.
          </p>
        </div>
        
        {/* Saldo do usuário */}
        <div className={`${glassStyles.className} rounded-xl p-4 mb-10 flex justify-between items-center`}>
          <div>
            <p className="text-sm text-gray-400">Seu saldo disponível</p>
            <p className="text-2xl font-bold text-white">R$ {user?.balance.toFixed(2)}</p>
          </div>
          <Button className="bg-primary hover:bg-red-700">
            Adicionar saldo
          </Button>
        </div>
        
        {/* Tipos de posicionamento */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold dark:text-white text-gray-900 mb-6 flex items-center">
            Escolha onde seu anúncio vai aparecer
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 ml-2 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">Preços baseados na visibilidade estimada</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {adPositions.map((position) => (
              <div 
                key={position.id}
                className={`${glassStyles.className} rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group`}
                onClick={() => handleSelectPosition(position)}
              >
                <div className="h-36 relative overflow-hidden">
                  <img 
                    src={position.preview}
                    alt={position.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 text-white font-semibold">{position.name}</div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {position.icon}
                    </div>
                    <span className="text-xl font-bold text-primary">R$ {position.price}</span>
                  </div>
                  
                  <p className="text-sm text-gray-400 mt-2 h-12 overflow-hidden">
                    {position.description}
                  </p>
                  
                  <Button 
                    className="w-full mt-4 bg-primary hover:bg-red-700"
                  >
                    Selecionar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Histórico de anúncios */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold dark:text-white text-gray-900 mb-6">Seus anúncios</h2>
          
          {adHistory.length === 0 ? (
            <div className={`${glassStyles.className} rounded-xl p-8 text-center`}>
              <p className="dark:text-gray-300 text-gray-600 mb-2">Você ainda não criou nenhum anúncio.</p>
              <p className="text-sm dark:text-gray-400 text-gray-500">
                Escolha um dos espaços acima para começar a anunciar.
              </p>
            </div>
          ) : (
            <div className={`${glassStyles.className} rounded-xl overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nome</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Posição</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Data</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adHistory.map((ad) => (
                      <tr key={ad.id} className="border-b border-gray-700 hover:bg-gray-800/20">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 mr-3">
                              <img className="h-10 w-10 rounded object-cover" src={ad.imageUrl} alt="" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white">{ad.name}</div>
                              <div className="text-xs text-gray-400 truncate max-w-xs">{ad.link}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-300">{ad.position}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={`${ad.status === 'active' ? 'bg-green-700' : 'bg-gray-700'} text-white`}>
                            {ad.status === 'active' ? 'Ativo' : 'Expirado'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {ad.createdAt}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button className="text-primary hover:text-red-700 transition-colors">
                            {ad.status === 'active' ? 'Editar' : 'Renovar'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Modal de criação de anúncio */}
      {selectedPosition && (
        <Dialog open={adModalOpen} onOpenChange={setAdModalOpen}>
          <DialogContent className={`${glassStyles.className} max-w-3xl p-0 border-0`}>
            <div className="p-6">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-white mb-1">
                  Criar anúncio para {selectedPosition.name}
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  Preencha as informações para criar seu anúncio. Custo: R$ {selectedPosition.price}
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="md:col-span-3 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Nome do anúncio *</label>
                    <Input
                      type="text"
                      placeholder="Ex: Promoção de Verão"
                      className="bg-gray-800 border-gray-700 text-white"
                      value={adName}
                      onChange={(e) => setAdName(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Link do anúncio *</label>
                    <Input
                      type="url"
                      placeholder="https://seusite.com/pagina"
                      className="bg-gray-800 border-gray-700 text-white"
                      value={adLink}
                      onChange={(e) => setAdLink(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Descrição curta (opcional)</label>
                    <Textarea
                      placeholder="Descreva brevemente seu anúncio..."
                      className="bg-gray-800 border-gray-700 text-white h-24"
                      value={adDescription}
                      onChange={(e) => setAdDescription(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Imagem do anúncio *</label>
                    <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center">
                      {previewImage ? (
                        <div className="relative">
                          <img 
                            src={previewImage}
                            alt="Preview"
                            className="mx-auto max-h-40 rounded"
                          />
                          <button
                            className="mt-2 text-xs text-gray-400 hover:text-white"
                            onClick={() => setPreviewImage(null)}
                          >
                            Remover imagem
                          </button>
                        </div>
                      ) : (
                        <div className="py-4">
                          <Upload className="mx-auto h-10 w-10 text-gray-500 mb-2" />
                          <p className="text-sm text-gray-400">
                            Clique para fazer upload ou arraste a imagem
                          </p>
                          <label className="mt-2 inline-flex items-center px-3 py-1.5 bg-primary hover:bg-red-700 rounded-md text-white text-sm font-medium cursor-pointer">
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              onChange={handleImageUpload}
                            />
                            <Plus className="h-4 w-4 mr-1" /> Selecionar arquivo
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <div className={`${glassStyles.className} rounded-xl p-4`}>
                    <h3 className="font-medium text-white mb-4 pb-2 border-b border-gray-700">Resumo do anúncio</h3>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Posição:</span>
                        <span className="text-white">{selectedPosition.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Custo:</span>
                        <span className="text-white">R$ {selectedPosition.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Saldo atual:</span>
                        <span className="text-white">R$ {user?.balance.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-medium border-t border-gray-700 pt-2 mt-2">
                        <span className="text-gray-300">Saldo restante:</span>
                        <span className={`${(user?.balance || 0) < selectedPosition.price ? 'text-red-500' : 'text-green-500'}`}>
                          R$ {((user?.balance || 0) - selectedPosition.price).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    
                    {(user?.balance || 0) < selectedPosition.price && (
                      <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 mb-4">
                        <p className="text-sm text-red-400 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          Saldo insuficiente para este anúncio
                        </p>
                      </div>
                    )}
                    
                    <Button
                      className="w-full bg-primary hover:bg-red-700"
                      disabled={(user?.balance || 0) < selectedPosition.price}
                      onClick={handleSubmitAd}
                    >
                      Inserir anúncio agora
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Modal de confirmação */}
      <Dialog open={confirmModalOpen} onOpenChange={setConfirmModalOpen}>
        <DialogContent className={`${glassStyles.className} max-w-md p-0 border-0`}>
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">
                Confirmar anúncio
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Deseja confirmar a inserção deste anúncio? O valor será descontado do seu saldo.
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-4 space-y-4">
              {previewImage && (
                <img 
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded"
                />
              )}
              
              <div className="space-y-1">
                <h4 className="font-semibold text-white">{adName || "Sem nome"}</h4>
                <p className="text-sm text-gray-400 break-all">{adLink || "Sem link"}</p>
                {adDescription && <p className="text-sm text-gray-400">{adDescription}</p>}
              </div>
              
              <div className={`${glassStyles.className} rounded-lg p-3 text-center`}>
                <p className="text-gray-400 text-sm">Valor a ser descontado</p>
                <p className="text-lg font-bold text-primary">R$ {selectedPosition?.price.toFixed(2)}</p>
              </div>
            </div>
            
            <DialogFooter className="mt-6 flex items-center gap-3">
              <Button 
                variant="secondary"
                className="flex-1"
                onClick={() => setConfirmModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                className="flex-1 bg-primary hover:bg-red-700"
                onClick={handleConfirmAd}
              >
                Confirmar
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AnunciosPage;