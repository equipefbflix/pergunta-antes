import { useState, useEffect, useRef } from "react";
import { useGlassmorphism } from "@/hooks/useGlassmorphism";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Save, Upload, Image as ImageIcon } from "lucide-react";
import ThemeToggle from "@/components/layout/ThemeToggle";
import Sidebar from "@/components/layout/Sidebar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function AdminAvisosPage() {
  const glassStyles = useGlassmorphism();
  const { toast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [notificationContent, setNotificationContent] = useState<string>(
    `O Facebook está passando por atualização de permissões. Algumas contas podem apresentar instabilidades temporárias. Recomendamos comprar perfis premium mais antigos para evitar problemas durante este período de transição.`
  );
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Simular carregamento dos avisos do servidor e data da última atualização
    const fetchData = () => {
      // Em uma implementação real, isso seria uma chamada API
      const mockLastUpdated = new Date(2025, 3, 28, 15, 35, 0); // 28/04/2025 15:35:00
      setLastUpdated(mockLastUpdated);
    };

    fetchData();
  }, []);

  const handleSaveNotification = async () => {
    setIsSaving(true);
    
    // Simular salvamento no servidor
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Atualizar a data da última atualização
    setLastUpdated(new Date());
    
    setIsSaving(false);
    
    toast({
      title: "Aviso atualizado",
      description: `O aviso foi ${isActive ? 'ativado' : 'desativado'} com sucesso.`,
    });
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Não disponível";
    
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Criar URL para preview da imagem
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      
      toast({
        title: "Imagem carregada",
        description: "A imagem foi adicionada ao aviso.",
      });
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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
            <h1 className="text-2xl font-bold text-foreground">Avisos</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              Última atualização: {formatDate(lastUpdated)}
            </div>
            <ThemeToggle />
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className={`${glassStyles.className} mb-6 rounded-lg p-6`}>
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-foreground">Gerenciar Aviso Pop-up</h2>
              <Button 
                variant="default" 
                className="flex items-center space-x-2"
                onClick={handleSaveNotification}
                disabled={isSaving}
              >
                <Save className="h-4 w-4" />
                <span>{isSaving ? "Salvando..." : "Salvar alterações"}</span>
              </Button>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="notification-status" 
                  checked={isActive} 
                  onCheckedChange={setIsActive}
                />
                <Label htmlFor="notification-status" className="font-medium">
                  {isActive ? "Aviso ativo" : "Aviso desativado"}
                </Label>
              </div>
              <div className="text-sm text-muted-foreground">
                {isActive 
                  ? "O aviso será exibido para todos os usuários logados" 
                  : "O aviso não será exibido até que seja ativado novamente"}
              </div>
            </div>
            
            <div className="mb-2 text-sm text-muted-foreground">
              <p>Edite o conteúdo do aviso que será exibido como pop-up para os usuários.</p>
            </div>
            
            <Textarea 
              className="min-h-[150px] text-sm mb-4"
              value={notificationContent}
              onChange={(e) => setNotificationContent(e.target.value)}
              placeholder="Digite o texto do aviso aqui..."
            />
            
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <Label className="font-medium">Imagem do aviso (opcional)</Label>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={triggerFileInput}
                    className="flex items-center mr-2"
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    <span>Carregar imagem</span>
                  </Button>
                </div>
              </div>
              
              {previewImage && (
                <div className="relative mt-2 rounded-md overflow-hidden border border-border">
                  <img 
                    src={previewImage} 
                    alt="Preview da imagem do aviso" 
                    className="max-h-[200px] w-auto mx-auto"
                  />
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="absolute top-2 right-2"
                    onClick={handleRemoveImage}
                  >
                    Remover
                  </Button>
                </div>
              )}
              
              {!previewImage && (
                <div 
                  className="border-2 border-dashed border-border rounded-md p-8 text-center cursor-pointer"
                  onClick={triggerFileInput}
                >
                  <ImageIcon className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Clique para adicionar uma imagem ao aviso
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Recomendado: 800 x 400 pixels (PNG, JPG)
                  </p>
                </div>
              )}
            </div>
            
            <div className="mt-4 p-4 bg-background rounded-md border border-border">
              <h3 className="text-sm font-medium mb-2">Pré-visualização do aviso</h3>
              <div className="p-4 rounded-md bg-primary/10 border border-primary/20">
                {previewImage && (
                  <div className="mb-2">
                    <img 
                      src={previewImage} 
                      alt="Imagem do aviso" 
                      className="max-h-[150px] w-auto rounded-md mx-auto"
                    />
                  </div>
                )}
                <p className="text-sm whitespace-pre-line">{notificationContent}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminAvisosPage;