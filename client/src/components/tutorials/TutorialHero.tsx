import { useGlassmorphism } from "@/hooks/useGlassmorphism";
import { Tutorial } from "@/types";
import { Button } from "@/components/ui/button";
import { Play, Info } from "lucide-react";

interface TutorialHeroProps {
  tutorial: Tutorial;
  onWatchVideo: (id: number) => void;
}

export function TutorialHero({ tutorial, onWatchVideo }: TutorialHeroProps) {
  return (
    <div className="relative w-full h-[70vh] min-h-[500px] mb-8 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={tutorial.image}
          alt={tutorial.title}
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      </div>
      
      {/* Content */}
      <div className="absolute left-0 bottom-0 w-full max-w-2xl p-8 pb-16">
        <div className="mb-4">
          <h1 className="text-white text-5xl font-bold mb-2 netflix-style-text">
            {tutorial.title}
          </h1>
          <div className="flex items-center text-gray-300 space-x-2 mb-4">
            <span className="text-white font-semibold">{tutorial.year}</span>
            <span className="text-gray-500">•</span>
            <span>{tutorial.duration}</span>
            <span className="text-gray-500">•</span>
            <span className="bg-primary/90 px-1 py-0.5 text-xs text-white">FBFLIX</span>
          </div>
        </div>
        
        <p className="text-white text-lg mb-6 line-clamp-3">
          {tutorial.description}
        </p>
        
        <div className="flex space-x-4">
          <Button 
            onClick={() => onWatchVideo(tutorial.id)}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-2 text-lg flex items-center gap-2"
          >
            <Play className="h-5 w-5" />
            Assistir agora
          </Button>
          
          <Button 
            variant="secondary"
            className="bg-white/20 hover:bg-white/30 text-white flex items-center gap-2"
          >
            <Info className="h-5 w-5" />
            Mais informações
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TutorialHero;