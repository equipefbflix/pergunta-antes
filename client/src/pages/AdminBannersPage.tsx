import { useState } from "react";
import { useGlassmorphism } from "@/hooks/useGlassmorphism";
import Sidebar from "@/components/layout/Sidebar";
import { banners } from "@/mocks/data";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { 
  Avatar, 
  AvatarFallback 
} from "@/components/ui/avatar";
import { 
  Bell, 
  Menu, 
  Image as ImageIcon,
  Edit,
  Trash2,
  Plus,
  Link,
  ExternalLink,
  Upload,
  FileImage,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Banner } from "@/types";

// Esquema de validação para o formulário de banner
const bannerFormSchema = z.object({
  title: z.string().min(3, {
    message: "O título precisa ter pelo menos 3 caracteres",
  }),
  description: z.string().min(10, {
    message: "A descrição precisa ter pelo menos 10 caracteres",
  }),
  // Na implementação real, isso seria substituído por um upload de arquivo
  image: z.string().url({
    message: "URL da imagem inválida",
  }),
  buttonText: z.string().min(1, {
    message: "Texto do botão é obrigatório",
  }),
  link: z.string().url({
    message: "URL de destino inválida",
  }),
});

type BannerFormValues = z.infer<typeof bannerFormSchema>;

export function AdminBannersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const glassStyles = useGlassmorphism();
  const { toast } = useToast();

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerFormSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      buttonText: "",
      link: "",
    },
  });

  // Funções para manipular banners
  const handleEditBanner = (banner: Banner) => {
    setSelectedBanner(banner);
    form.reset({
      title: banner.title,
      description: banner.description,
      image: banner.image,
      buttonText: banner.buttonText,
      link: banner.link,
    });
    setPreviewImage(banner.image);
    setIsEditing(true);
  };

  const handleCreateBanner = () => {
    form.reset({
      title: "",
      description: "",
      image: "",
      buttonText: "",
      link: "",
    });
    setPreviewImage(null);
    setIsCreating(true);
  };

  const handleDeleteBanner = (banner: Banner) => {
    setSelectedBanner(banner);
    setIsDeleting(true);
  };

  const onSubmit = (values: BannerFormValues) => {
    if (isEditing && selectedBanner) {
      // Em uma aplicação real, isso atualizaria o banner no backend
      toast({
        title: "Banner atualizado",
        description: `Banner "${values.title}" foi atualizado com sucesso.`,
      });
      setIsEditing(false);
    } else if (isCreating) {
      // Em uma aplicação real, isso criaria um novo banner no backend
      toast({
        title: "Banner criado",
        description: `Banner "${values.title}" foi criado com sucesso e já está disponível na plataforma.`,
      });
      setIsCreating(false);
    }
  };

  const confirmDelete = () => {
    if (selectedBanner) {
      // Em uma aplicação real, isso excluiria o banner no backend
      toast({
        title: "Banner excluído",
        description: `Banner "${selectedBanner.title}" foi excluído com sucesso.`,
      });
      setIsDeleting(false);
    }
  };

  // Simulação de upload de arquivo
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageUrl = form.getValues("image");
    if (imageUrl && imageUrl.startsWith("http")) {
      setPreviewImage(imageUrl);
    } else {
      // Em uma aplicação real, isso faria o upload do arquivo para o servidor
      toast({
        title: "Simulação de upload",
        description: "Em um ambiente real, o arquivo seria enviado para o servidor.",
      });
    }
  };

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
                <ImageIcon className="text-primary h-5 w-5 mr-2" />
                <h1 className="text-white font-medium">Banners</h1>
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
              <h1 className="text-2xl font-bold text-white">Banners</h1>
              <p className="text-sm text-gray-400">
                Gerencie os banners promocionais visíveis na área do cliente
              </p>
            </div>
            <Button 
              onClick={handleCreateBanner} 
              className="bg-primary hover:bg-red-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Novo
            </Button>
          </div>

          {/* Grid de Banners */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.map((banner) => (
              <Card 
                key={banner.id} 
                className={`${glassStyles.className} border-0 overflow-hidden`}
              >
                <div className="relative h-40 overflow-hidden">
                  <img 
                    src={banner.image} 
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                    <div>
                      <h3 className="text-white font-bold text-lg">{banner.title}</h3>
                      <p className="text-gray-300 text-sm line-clamp-2">{banner.description}</p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-sm text-gray-400">
                      <Link className="h-4 w-4 mr-1" />
                      <a 
                        href={banner.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors truncate max-w-[150px]"
                        title={banner.link}
                      >
                        {banner.link}
                      </a>
                    </div>
                    <Badge className="bg-primary/20 text-primary border-0">
                      {banner.buttonText}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-gray-700 text-white hover:bg-gray-800 flex-1 mr-2"
                      onClick={() => window.open(banner.link, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Abrir Link
                    </Button>
                    <div className="flex space-x-1">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="text-amber-500 hover:text-amber-400 hover:bg-gray-800"
                        onClick={() => handleEditBanner(banner)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="text-red-500 hover:text-red-400 hover:bg-gray-800"
                        onClick={() => handleDeleteBanner(banner)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
      
      {/* Modal de Edição/Criação de Banner */}
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
              {isEditing ? "Editar Banner" : "Adicionar Novo Banner"}
            </DialogTitle>
            <DialogDescription className="text-gray-400 mt-1">
              {isEditing 
                ? "Atualize as informações do banner promocional" 
                : "Configure um novo banner para a área do cliente"
              }
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Título</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ex: Oferta Especial" 
                            {...field} 
                            className="bg-gray-900 border-gray-700 text-white"
                          />
                        </FormControl>
                        <FormDescription className="text-gray-400">
                          Título principal do banner
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Descrição</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descreva a promoção ou anúncio" 
                            {...field} 
                            className="bg-gray-900 border-gray-700 text-white resize-none h-24"
                          />
                        </FormControl>
                        <FormDescription className="text-gray-400">
                          Texto explicativo que aparecerá no banner
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="buttonText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Texto do Botão</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: Saiba mais" 
                          {...field} 
                          className="bg-gray-900 border-gray-700 text-white"
                        />
                      </FormControl>
                      <FormDescription className="text-gray-400">
                        Texto que aparecerá no botão de call-to-action
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Link de Destino</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="https://..." 
                            {...field} 
                            className="bg-gray-900 border-gray-700 text-white pl-10"
                          />
                          <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        </div>
                      </FormControl>
                      <FormDescription className="text-gray-400">
                        URL para onde o usuário será direcionado ao clicar no banner
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Imagem do Banner</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            <div className="flex flex-col space-y-2">
                              <div className="relative">
                                <Input 
                                  placeholder="URL da imagem ou selecione um arquivo" 
                                  {...field} 
                                  className="bg-gray-900 border-gray-700 text-white pl-10"
                                  onChange={(e) => {
                                    field.onChange(e);
                                    if (e.target.value.startsWith("http")) {
                                      setPreviewImage(e.target.value);
                                    }
                                  }}
                                />
                                <FileImage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                              </div>
                              
                              <div className="flex items-center gap-4">
                                <span className="text-gray-400">ou</span>
                                <label className="flex items-center px-4 py-2 bg-gray-800 border border-gray-700 rounded-md cursor-pointer hover:bg-gray-700 transition-colors">
                                  <Upload className="h-4 w-4 mr-2 text-gray-400" />
                                  <span className="text-sm text-white">Enviar arquivo</span>
                                  <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleImageChange}
                                  />
                                </label>
                              </div>
                            </div>
                            
                            {/* Preview da imagem */}
                            {previewImage || field.value ? (
                              <div className="relative h-40 rounded-md overflow-hidden border border-gray-700">
                                <img 
                                  src={previewImage || field.value} 
                                  alt="Preview" 
                                  className="w-full h-full object-cover"
                                  onError={() => {
                                    setPreviewImage(null);
                                    toast({
                                      title: "Erro ao carregar imagem",
                                      description: "Verifique se a URL está correta.",
                                      variant: "destructive",
                                    });
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="h-40 rounded-md border border-dashed border-gray-700 flex items-center justify-center">
                                <div className="text-center text-gray-400">
                                  <FileImage className="h-10 w-10 mx-auto mb-2 opacity-50" />
                                  <p>Prévia da imagem</p>
                                  <p className="text-xs">Tamanho recomendado: 1920x600px</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription className="text-gray-400 flex items-center mt-2">
                          <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                          Use imagens que se adaptem bem em diferentes tamanhos de tela
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
                  {isEditing ? "Salvar alterações" : "Criar banner"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Modal de Exclusão */}
      <Dialog 
        open={isDeleting} 
        onOpenChange={(open) => {
          if (!open) setIsDeleting(false);
        }}
      >
        <DialogContent className={`${glassStyles.className} max-w-md mx-auto p-0 border-0 text-white`}>
          <DialogHeader className="p-6 border-b border-gray-800">
            <DialogTitle className="text-xl font-bold text-white">
              Confirmar Exclusão
            </DialogTitle>
            <DialogDescription className="text-gray-400 mt-1">
              Essa ação não poderá ser desfeita.
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-6">
            <div className="mb-4">
              <p className="text-white mb-4">
                Tem certeza que deseja excluir o banner <strong>"{selectedBanner?.title}"</strong>?
              </p>
              
              {/* Miniatura do banner a ser excluído */}
              {selectedBanner && (
                <div className="relative h-24 rounded-md overflow-hidden border border-gray-700 mb-4">
                  <img 
                    src={selectedBanner.image} 
                    alt={selectedBanner.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button 
                variant="outline" 
                className="border-gray-700 text-white hover:bg-gray-800"
                onClick={() => setIsDeleting(false)}
              >
                Cancelar
              </Button>
              <Button 
                variant="destructive"
                onClick={confirmDelete}
              >
                Excluir Banner
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminBannersPage;