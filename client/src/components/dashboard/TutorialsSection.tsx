import { Link } from "wouter";
import { useGlassmorphism } from "@/hooks/useGlassmorphism";
import { Tutorial } from "@/types";
import { Play } from "lucide-react";

interface TutorialsSectionProps {
  tutorials: Tutorial[];
  limit?: number;
  showViewAll?: boolean;
}

export function TutorialsSection({ 
  tutorials, 
  limit = 3, 
  showViewAll = true 
}: TutorialsSectionProps) {
  const glassStyles = useGlassmorphism();
  const displayTutorials = limit ? tutorials.slice(0, limit) : tutorials;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold dark:text-white text-gray-800">
          {limit ? "Tutoriais" : "Todos os Tutoriais"}
        </h2>
        {showViewAll && (
          <Link href="/tutoriais">
            <a className="text-primary text-sm hover:underline">Ver todos</a>
          </Link>
        )}
      </div>
      
      {displayTutorials.length === 0 ? (
        <div className={`${glassStyles.className} rounded-xl p-5 text-center`}>
          <p className="dark:text-gray-300 text-gray-600">
            Não há tutoriais disponíveis no momento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayTutorials.map((tutorial) => (
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
                  <div className="w-14 h-14 rounded-full bg-primary bg-opacity-80 flex items-center justify-center">
                    <Play className="text-white h-6 w-6" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold dark:text-white text-gray-900 mb-2">{tutorial.title}</h3>
                <p className="text-sm dark:text-gray-300 text-gray-600 mb-4">{tutorial.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">{tutorial.duration} min</span>
                  <Link href={tutorial.link}>
                    <a className="text-primary hover:text-red-700 text-sm font-medium">Assistir</a>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TutorialsSection;
