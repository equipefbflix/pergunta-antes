import { useEffect, useRef, useState } from "react";
import { useGlassmorphism } from "@/hooks/useGlassmorphism";
import { Tutorial } from "@/types";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface TutorialCarouselProps {
  title: string;
  tutorials: Tutorial[];
  onWatchVideo: (id: number) => void;
}

export function TutorialCarousel({ title, tutorials, onWatchVideo }: TutorialCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const { toast } = useToast();
  
  // Check if we need to show arrows
  useEffect(() => {
    const checkArrows = () => {
      if (!containerRef.current) return;
      
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    };
    
    checkArrows();
    
    // Add event listener
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', checkArrows);
      window.addEventListener('resize', checkArrows);
      
      // Cleanup
      return () => {
        container.removeEventListener('scroll', checkArrows);
        window.removeEventListener('resize', checkArrows);
      };
    }
  }, [tutorials, isHovering]);
  
  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    
    const { clientWidth } = containerRef.current;
    const scrollAmount = clientWidth * 0.8; // Scroll 80% of the visible width
    
    containerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };
  
  if (tutorials.length === 0) return null;
  
  return (
    <div className="mb-10 relative" 
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <h2 className="text-xl font-bold dark:text-white text-gray-800 mb-4 pl-2">{title}</h2>
      
      {/* Left Arrow */}
      {showLeftArrow && (
        <button 
          className="absolute left-0 top-1/2 z-10 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 p-2 rounded-full text-white"
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>
      )}
      
      {/* Carousel Container */}
      <div className="w-full overflow-x-auto no-scrollbar" ref={containerRef}>
        <div className="flex gap-4 pb-2" style={{ width: "max-content" }}>
          {tutorials.map((tutorial) => (
            <div
              key={tutorial.id}
              className="relative flex-shrink-0 w-64 group"
            >
              <div className="relative h-36 w-64 overflow-hidden rounded-md mb-2 transition-transform duration-300 group-hover:scale-105">
                <img 
                  src={tutorial.image}
                  alt={tutorial.title}
                  className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-75"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="default"
                    size="icon"
                    className="rounded-full bg-red-600 hover:bg-red-700 w-12 h-12"
                    onClick={() => onWatchVideo(tutorial.id)}
                  >
                    <Play className="h-6 w-6 text-white" />
                  </Button>
                </div>
              </div>
              <div className="px-2">
                <h3 className="font-medium text-white text-sm truncate">{tutorial.title}</h3>
                <div className="flex items-center mt-1 text-xs text-gray-400">
                  <span>{tutorial.year}</span>
                  <span className="mx-1">•</span>
                  <span>{tutorial.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Right Arrow */}
      {showRightArrow && (
        <button 
          className="absolute right-0 top-1/2 z-10 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 p-2 rounded-full text-white"
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      )}
    </div>
  );
}

export default TutorialCarousel;