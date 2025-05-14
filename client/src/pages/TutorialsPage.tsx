import { useState } from "react";
import Header from "@/components/layout/Header";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { useGlassmorphism } from "@/hooks/useGlassmorphism";
import { tutorials } from "@/mocks/data";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";

export function TutorialsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeVideoId, setActiveVideoId] = useState<number | null>(null);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const glassStyles = useGlassmorphism();

  // Filter tutorials based on search query
  const filteredTutorials = tutorials.filter(tutorial =>
    tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tutorial.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleWatchVideo = (id: number) => {
    setActiveVideoId(id);
    setVideoDialogOpen(true);
  };

  const activeVideo = tutorials.find(t => t.id === activeVideoId);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold dark:text-white text-gray-800">Tutoriais</h1>
          <p className="text-sm dark:text-gray-300 text-gray-600 mt-1">
            Aprenda a utilizar nossos produtos e maximize seus resultados
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Input
              type="text"
              placeholder="Buscar tutoriais..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-10 bg-gray-800 bg-opacity-50 rounded-lg placeholder-gray-400 text-white"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Tutorials Grid */}
        {filteredTutorials.length === 0 ? (
          <div className={`${glassStyles.className} rounded-xl p-8 text-center`}>
            <p className="dark:text-gray-300 text-gray-600 mb-2">Nenhum tutorial encontrado.</p>
            <p className="text-sm dark:text-gray-400 text-gray-500">
              Tente uma busca diferente ou veja nossos tutoriais em destaque.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutorials.map((tutorial) => (
              <div
                key={tutorial.id}
                className={`${glassStyles.className} rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300`}
              >
                <div className="h-40 relative overflow-hidden">
                  <img 
                    src={tutorial.image}
                    alt={tutorial.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      className="w-14 h-14 rounded-full bg-primary bg-opacity-80 flex items-center justify-center"
                      onClick={() => handleWatchVideo(tutorial.id)}
                    >
                      <Play className="text-white h-6 w-6" />
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold dark:text-white text-gray-900 mb-2">{tutorial.title}</h3>
                  <p className="text-sm dark:text-gray-300 text-gray-600 mb-4">{tutorial.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">{tutorial.duration} min</span>
                    <Button
                      variant="link"
                      className="text-primary hover:text-red-700 text-sm font-medium p-0"
                      onClick={() => handleWatchVideo(tutorial.id)}
                    >
                      Assistir
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Featured Categories Section (only show if there are tutorials) */}
        {tutorials.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold dark:text-white text-gray-800 mb-6">Categorias em Destaque</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className={`${glassStyles.className} rounded-xl p-4 text-center hover:shadow-md transition-all duration-300`}>
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary bg-opacity-20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="font-medium text-white mb-1">Primeiros Passos</h3>
                <p className="text-xs text-gray-400">4 tutoriais</p>
              </div>
              
              <div className={`${glassStyles.className} rounded-xl p-4 text-center hover:shadow-md transition-all duration-300`}>
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-900 bg-opacity-20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="font-medium text-white mb-1">Segurança</h3>
                <p className="text-xs text-gray-400">3 tutoriais</p>
              </div>
              
              <div className={`${glassStyles.className} rounded-xl p-4 text-center hover:shadow-md transition-all duration-300`}>
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-900 bg-opacity-20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-medium text-white mb-1">Monetização</h3>
                <p className="text-xs text-gray-400">5 tutoriais</p>
              </div>
              
              <div className={`${glassStyles.className} rounded-xl p-4 text-center hover:shadow-md transition-all duration-300`}>
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-purple-900 bg-opacity-20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="font-medium text-white mb-1">Dicas Avançadas</h3>
                <p className="text-xs text-gray-400">6 tutoriais</p>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Video Player Dialog */}
      <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
        <DialogContent className={`${glassStyles.className} max-w-3xl mx-auto p-0 border-0`}>
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white mb-2">
                {activeVideo?.title}
              </DialogTitle>
            </DialogHeader>
            
            <div className="mt-4">
              <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg">
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
                      <p className="text-gray-300 text-sm mt-2">Duração: {activeVideo?.duration}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-gray-300">{activeVideo?.description}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <ThemeToggle />
    </div>
  );
}

export default TutorialsPage;
