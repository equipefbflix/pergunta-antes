import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { useGlassmorphism } from "@/hooks/useGlassmorphism";
import { tutorialCategories, tutorials } from "@/mocks/data";
import { Search, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import TutorialCarousel from "@/components/tutorials/TutorialCarousel";
import TutorialHero from "@/components/tutorials/TutorialHero";

// Estilo Netflix para o texto do título
import "./netflix-title.css";

export function TutorialsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeVideoId, setActiveVideoId] = useState<number | null>(null);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const glassStyles = useGlassmorphism();

  // Encontra um tutorial aleatório em destaque
  const featuredTutorial = tutorials.find(t => t.featured) || tutorials[0];

  // Agrupar tutoriais por categoria
  const tutorialsByCategory = tutorialCategories.map(category => ({
    ...category,
    items: tutorials.filter(tutorial => tutorial.category === category.id)
  }));

  // Filtrar tutoriais com base na pesquisa
  const filteredTutorials = tutorials.filter(tutorial =>
    tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tutorial.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleWatchVideo = (id: number) => {
    setActiveVideoId(id);
    setVideoDialogOpen(true);
  };

  // Detectar scroll para mudar o cabeçalho
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const activeVideo = tutorials.find(t => t.id === activeVideoId);
  
  // Flag para determinar se estamos mostrando resultados de pesquisa
  const isSearching = searchQuery.trim() !== "";

  return (
    <div className="min-h-screen flex flex-col bg-black overflow-x-hidden">
      {/* Header modificado estilo Netflix */}
      <header className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-black py-2' : 'bg-gradient-to-b from-black to-transparent py-4'}`}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-gray-400 hover:text-white transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <h1 className="text-primary font-bold text-3xl">FBFLIX</h1>
            
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-white font-medium hover:text-gray-300 transition-colors">
                Início
              </a>
              <a href="#" className="text-white font-medium hover:text-gray-300 transition-colors">
                Tutoriais
              </a>
              <a href="#" className="text-white font-medium hover:text-gray-300 transition-colors">
                Minhas listas
              </a>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Botão de pesquisa com transição */}
            <div className="relative">
              {showSearchBar ? (
                <div className="flex items-center bg-black border border-gray-700 rounded-md overflow-hidden transition-all">
                  <Input
                    type="text"
                    placeholder="Títulos, pessoas, gêneros..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-0 bg-transparent text-white w-48 focus:ring-0"
                    autoFocus
                    onBlur={() => {
                      if (!searchQuery) setShowSearchBar(false);
                    }}
                  />
                  <Search className="h-5 w-5 text-gray-400 mr-2" />
                </div>
              ) : (
                <button onClick={() => setShowSearchBar(true)} className="text-white">
                  <Search className="h-5 w-5" />
                </button>
              )}
            </div>
            
            <div className="w-8 h-8 rounded-sm overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
                alt="Perfil"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>
      
      <main className="pt-0 flex-1">
        {/* Se estiver pesquisando, mostrar resultados; caso contrário, mostrar layout normal */}
        {isSearching ? (
          <div className="container mx-auto px-4 py-28">
            <h2 className="text-white text-2xl font-bold mb-8">Resultados da pesquisa para "{searchQuery}"</h2>
            
            {filteredTutorials.length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                <p className="text-xl mb-2">Nenhum resultado encontrado</p>
                <p>Tente buscar por outro termo ou explore os tutoriais abaixo.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredTutorials.map((tutorial) => (
                  <div
                    key={tutorial.id}
                    className="relative group cursor-pointer"
                    onClick={() => handleWatchVideo(tutorial.id)}
                  >
                    <div className="relative h-36 overflow-hidden rounded-md mb-2 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-red-900/20">
                      <img 
                        src={tutorial.image}
                        alt={tutorial.title}
                        className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-75"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="default"
                          size="icon"
                          className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700"
                        >
                          <Play className="h-6 w-6 text-white" />
                        </Button>
                      </div>
                    </div>
                    <h3 className="text-white text-sm font-medium">{tutorial.title}</h3>
                    <p className="text-gray-400 text-xs">{tutorial.duration}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Hero Banner para tutorial em destaque */}
            <TutorialHero tutorial={featuredTutorial} onWatchVideo={handleWatchVideo} />
            
            {/* Carrosséis de categorias */}
            <div className="container mx-auto px-4 pb-12">
              {tutorialsByCategory.map((category) => (
                <TutorialCarousel
                  key={category.id}
                  title={category.name}
                  tutorials={category.items}
                  onWatchVideo={handleWatchVideo}
                />
              ))}
            </div>
          </>
        )}
      </main>
      
      {/* Footer */}
      <footer className="py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-primary font-bold text-xl">FBFLIX 2025</h2>
            <ThemeToggle />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-gray-400 font-medium mb-4">Empresa</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-500 hover:text-white text-sm">Sobre nós</a></li>
                <li><a href="#" className="text-gray-500 hover:text-white text-sm">Carreiras</a></li>
                <li><a href="#" className="text-gray-500 hover:text-white text-sm">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-gray-400 font-medium mb-4">Suporte</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-500 hover:text-white text-sm">Central de Ajuda</a></li>
                <li><a href="#" className="text-gray-500 hover:text-white text-sm">Contato</a></li>
                <li><a href="#" className="text-gray-500 hover:text-white text-sm">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-gray-400 font-medium mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-500 hover:text-white text-sm">Termos de Uso</a></li>
                <li><a href="#" className="text-gray-500 hover:text-white text-sm">Privacidade</a></li>
                <li><a href="#" className="text-gray-500 hover:text-white text-sm">Cookies</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-gray-400 font-medium mb-4">Social</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-500 hover:text-white text-sm">Instagram</a></li>
                <li><a href="#" className="text-gray-500 hover:text-white text-sm">Twitter</a></li>
                <li><a href="#" className="text-gray-500 hover:text-white text-sm">Facebook</a></li>
              </ul>
            </div>
          </div>
          <p className="text-gray-600 text-xs mt-8 text-center">© 2025 FBFLIX. Todos os direitos reservados.</p>
        </div>
      </footer>
      
      {/* Video Player Dialog */}
      <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
        <DialogContent className="max-w-4xl mx-auto p-0 border-0 bg-black">
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white mb-2">
                {activeVideo?.title}
              </DialogTitle>
            </DialogHeader>
            
            <div className="mt-4">
              <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-md">
                {/* This would be a real video player in a production app */}
                <div className="absolute inset-0 bg-black flex items-center justify-center">
                  <div className="text-center">
                    <img 
                      src={activeVideo?.image} 
                      alt={activeVideo?.title} 
                      className="w-full h-full object-cover opacity-70" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <Play className="h-16 w-16 text-primary mb-4" />
                      <p className="text-white text-lg font-medium">Vídeo simulado para demonstração</p>
                      <div className="flex items-center mt-2">
                        <span className="text-white font-semibold">{activeVideo?.year}</span>
                        <span className="text-gray-500 mx-2">•</span>
                        <span className="text-gray-300">{activeVideo?.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <p className="text-gray-300 text-lg">{activeVideo?.description}</p>
                
                <div className="mt-8 flex space-x-4">
                  <Button className="bg-white text-black hover:bg-gray-200 font-bold flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    Reproduzir
                  </Button>
                  <Button variant="secondary" className="bg-gray-600 hover:bg-gray-700 text-white">
                    Adicionar à Minha Lista
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

export default TutorialsPage;
