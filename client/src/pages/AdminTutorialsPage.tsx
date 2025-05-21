import { useState } from "react";
import { useGlassmorphism } from "@/hooks/useGlassmorphism";
import Sidebar from "@/components/layout/Sidebar";
import { tutorialCategories, tutorials } from "@/mocks/data";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Avatar, 
  AvatarFallback 
} from "@/components/ui/avatar";
import { 
  Bell, 
  Menu, 
  Search, 
  Video,
  Edit,
  Trash2,
  Plus,
  Play,
  ExternalLink,
  Info,
  Check,
  CheckCheck,
  Youtube,
  FilePlus
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tutorial } from "@/types";

// Esquema de validação para o formulário de tutorial
const tutorialFormSchema = z.object({
  title: z.string().min(5, {
    message: "O título precisa ter pelo menos 5 caracteres",
  }),
  description: z.string().min(10, {
    message: "A descrição precisa ter pelo menos 10 caracteres",
  }),
  image: z.string().url({
    message: "URL da imagem inválida",
  }),
  link: z.string().url({
    message: "URL do vídeo inválida",
  }),
  duration: z.string().min(1, {
    message: "Duração é obrigatória",
  }),
  category: z.coerce.number(),
  featured: z.boolean().default(false),
  year: z.string().regex(/^\d{4}$/, {
    message: "Ano deve estar no formato AAAA",
  }),
});

type TutorialFormValues = z.infer<typeof tutorialFormSchema>;

export function AdminTutorialsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  
  const glassStyles = useGlassmorphism();
  const { toast } = useToast();

  const form = useForm<TutorialFormValues>({
    resolver: zodResolver(tutorialFormSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      link: "",
      duration: "",
      category: 1,
      featured: false,
      year: new Date().getFullYear().toString(),
    },
  });

  // Filtrar tutoriais com base na pesquisa
  const filteredTutorials = tutorials.filter(tutorial =>
    tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tutorial.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Obter o nome da categoria
  const getCategoryName = (categoryId: number) => {
    const category = tutorialCategories.find(cat => cat.id === categoryId);
    return category ? category.name : "Desconhecido";
  };

  // Funções para manipular tutoriais
  const handleEditTutorial = (tutorial: Tutorial) => {
    setSelectedTutorial(tutorial);
    form.reset({
      title: tutorial.title,
      description: tutorial.description,
      image: tutorial.image,
      link: tutorial.link,
      duration: tutorial.duration,
      category: tutorial.category,
      featured: tutorial.featured || false,
      year: tutorial.year,
    });
    setIsEditing(true);
  };

  const handleCreateTutorial = () => {
    form.reset({
      title: "",
      description: "",
      image: "",
      link: "",
      duration: "",
      category: 1,
      featured: false,
      year: new Date().getFullYear().toString(),
    });
    setIsCreating(true);
  };

  const handleDeleteTutorial = (tutorial: Tutorial) => {
    setSelectedTutorial(tutorial);
    setIsDeleting(true);
  };

  const handlePreviewTutorial = (tutorial: Tutorial) => {
    setSelectedTutorial(tutorial);
    setPreviewDialogOpen(true);
  };

  const onSubmit = (values: TutorialFormValues) => {
    if (isEditing && selectedTutorial) {
      // Em uma aplicação real, isso atualizaria o tutorial no backend
      toast({
        title: "Tutorial atualizado",
        description: `Tutorial "${values.title}" foi atualizado com sucesso.`,
      });
      setIsEditing(false);
    } else if (isCreating) {
      // Em uma aplicação real, isso criaria um novo tutorial no backend
      toast({
        title: "Tutorial criado",
        description: `Tutorial "${values.title}" foi criado com sucesso e já está disponível para os usuários.`,
      });
      setIsCreating(false);
    }
  };

  const confirmDelete = () => {
    if (selectedTutorial) {
      // Em uma aplicação real, isso excluiria o tutorial no backend
      toast({
        title: "Tutorial excluído",
        description: `Tutorial "${selectedTutorial.title}" foi excluído com sucesso.`,
      });
      setIsDeleting(false);
    }
  };

  // Extrair ID do YouTube (para demonstração)
  const getYoutubeIdFromUrl = (url: string) => {
    // Tenta extrair o ID do YouTube de uma URL
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('youtube.com')) {
        const params = new URLSearchParams(urlObj.search);
        return params.get('v');
      } else if (urlObj.hostname.includes('youtu.be')) {
        return urlObj.pathname.slice(1);
      }
    } catch (e) {
      // Apenas retorna null se houver erro
    }
    return null;
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
                <Video className="text-primary h-5 w-5 mr-2" />
                <h1 className="text-white font-medium">Tutoriais</h1>
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
              <h1 className="text-2xl font-bold text-white">Tutoriais</h1>
              <p className="text-sm text-gray-400">
                Gerencie os vídeos tutoriais disponíveis na plataforma
              </p>
            </div>
            <Button 
              onClick={handleCreateTutorial} 
              className="bg-primary hover:bg-red-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Novo
            </Button>
          </div>

          {/* Ferramentas de busca */}
          <div className="relative flex-1 mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Buscar por título ou descrição..."
              className="pl-10 bg-gray-900 border-gray-700 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Tabela de Tutoriais */}
          <div className={`${glassStyles.className} rounded-xl overflow-hidden`}>
            {filteredTutorials.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">
                  Nenhum tutorial encontrado com os filtros atuais.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead className="text-white">Título</TableHead>
                      <TableHead className="text-white">Categoria</TableHead>
                      <TableHead className="text-white">Duração</TableHead>
                      <TableHead className="text-white">Destaque</TableHead>
                      <TableHead className="text-white text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTutorials.map((tutorial) => (
                      <TableRow key={tutorial.id}>
                        <TableCell>
                          <div 
                            className="w-16 h-9 rounded overflow-hidden cursor-pointer"
                            onClick={() => handlePreviewTutorial(tutorial)}
                          >
                            <div className="relative w-full h-full">
                              <img 
                                src={tutorial.image} 
                                alt={tutorial.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity">
                                <Play className="h-4 w-4 text-white" />
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-white">
                          <div className="max-w-xs">
                            <div className="font-medium truncate">{tutorial.title}</div>
                            <div className="text-xs text-gray-400 truncate">{tutorial.description}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {getCategoryName(tutorial.category)}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {tutorial.duration}
                        </TableCell>
                        <TableCell>
                          {tutorial.featured ? (
                            <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
                              Destaque
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                              Normal
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="text-amber-500 hover:text-amber-400 hover:bg-gray-800"
                              onClick={() => handleEditTutorial(tutorial)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="text-red-500 hover:text-red-400 hover:bg-gray-800"
                              onClick={() => handleDeleteTutorial(tutorial)}
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
          </div>
        </main>
      </div>
      
      {/* Modal de Edição/Criação de Tutorial */}
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
              {isEditing ? "Editar Tutorial" : "Adicionar Novo Tutorial"}
            </DialogTitle>
            <DialogDescription className="text-gray-400 mt-1">
              {isEditing 
                ? "Atualize as informações do tutorial" 
                : "Preencha os campos para criar um novo tutorial"
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
                        <FormLabel className="text-white">Título do Tutorial</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ex: Como configurar o proxy no Ads Power" 
                            {...field} 
                            className="bg-gray-900 border-gray-700 text-white"
                          />
                        </FormControl>
                        <FormDescription className="text-gray-400">
                          Um título claro e descritivo
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
                            placeholder="Descreva o conteúdo do tutorial" 
                            {...field} 
                            className="bg-gray-900 border-gray-700 text-white resize-none h-24"
                          />
                        </FormControl>
                        <FormDescription className="text-gray-400">
                          Uma descrição detalhada do que será ensinado no tutorial
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Categoria</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))} 
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-900 border-gray-700 text-white">
                          {tutorialCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-gray-400">
                        A categoria ajuda a organizar os tutoriais
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Duração</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ex: 5:30" 
                            {...field} 
                            className="bg-gray-900 border-gray-700 text-white"
                          />
                        </FormControl>
                        <FormDescription className="text-gray-400">
                          Formato: MM:SS
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Ano</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={new Date().getFullYear().toString()} 
                            {...field} 
                            className="bg-gray-900 border-gray-700 text-white"
                          />
                        </FormControl>
                        <FormDescription className="text-gray-400">
                          Ano de criação
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Link do Vídeo</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="URL do YouTube" 
                            {...field} 
                            className="bg-gray-900 border-gray-700 text-white pl-10"
                          />
                          <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500 h-5 w-5" />
                        </div>
                      </FormControl>
                      <FormDescription className="text-gray-400">
                        Link do vídeo no YouTube
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Imagem de Thumbnail</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="URL da imagem" 
                            {...field} 
                            className="bg-gray-900 border-gray-700 text-white pl-10"
                          />
                          <FilePlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        </div>
                      </FormControl>
                      <FormDescription className="text-gray-400">
                        Imagem de capa para o tutorial
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-700 p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-white">Destacar Tutorial</FormLabel>
                        <FormDescription className="text-gray-400">
                          Exibir em destaque na página principal de tutoriais
                        </FormDescription>
                      </div>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-6 w-10 rounded-full p-1 transition-all ${field.value ? 'bg-primary' : 'bg-gray-700'}`}
                            onClick={() => field.onChange(!field.value)}
                          >
                            <div
                              className={`h-4 w-4 rounded-full bg-white transition-all ${field.value ? 'translate-x-4' : 'translate-x-0'}`}
                            />
                          </div>
                          {field.value ? (
                            <CheckCheck className="h-4 w-4 text-primary" />
                          ) : null}
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
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
                  {isEditing ? "Salvar alterações" : "Criar tutorial"}
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
            <p className="text-white mb-4">
              Tem certeza que deseja excluir o tutorial <strong>"{selectedTutorial?.title}"</strong>?
            </p>
            
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
                Excluir
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Modal de Preview */}
      <Dialog 
        open={previewDialogOpen} 
        onOpenChange={setPreviewDialogOpen}
      >
        <DialogContent className="max-w-4xl mx-auto p-0 border-0 bg-black">
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white mb-2">
                {selectedTutorial?.title}
              </DialogTitle>
            </DialogHeader>
            
            <div className="mt-4">
              <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-md">
                {selectedTutorial && getYoutubeIdFromUrl(selectedTutorial.link) ? (
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${getYoutubeIdFromUrl(selectedTutorial.link)}`}
                    title={selectedTutorial.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="absolute inset-0 bg-black flex items-center justify-center">
                    <div className="text-center">
                      <img 
                        src={selectedTutorial?.image} 
                        alt={selectedTutorial?.title} 
                        className="w-full h-full object-cover opacity-70" 
                      />
                      <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <Play className="h-16 w-16 text-primary mb-4" />
                        <p className="text-white text-lg font-medium">Vídeo simulado para demonstração</p>
                        <div className="flex items-center mt-2">
                          <span className="text-white font-semibold">{selectedTutorial?.year}</span>
                          <span className="text-gray-500 mx-2">•</span>
                          <span className="text-gray-300">{selectedTutorial?.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <p className="text-gray-300 text-lg">{selectedTutorial?.description}</p>
                
                <div className="mt-8 flex space-x-4">
                  <Button 
                    className="bg-primary hover:bg-red-700 text-white font-bold"
                    onClick={() => {
                      setPreviewDialogOpen(false);
                      if (selectedTutorial) {
                        handleEditTutorial(selectedTutorial);
                      }
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Tutorial
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="border-gray-700 text-white hover:bg-gray-800"
                    onClick={() => {
                      // Em uma aplicação real, isso abriria o link original
                      window.open(selectedTutorial?.link, '_blank');
                    }}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Abrir Link Original
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminTutorialsPage;