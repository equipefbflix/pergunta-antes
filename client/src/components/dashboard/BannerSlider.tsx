import { useState } from "react";
import { Button } from "@/components/ui/button";
import { banners } from "@/mocks/data";
import { Banner } from "@/types";

export function BannerSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="mb-8 relative overflow-hidden rounded-xl">
      <div className="relative w-full h-60 md:h-80">
        {banners.map((banner, index) => (
          <div 
            key={banner.id} 
            className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out ${index === activeIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <img 
              src={banner.image} 
              alt={banner.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 md:p-8">
              <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">{banner.title}</h2>
              <p className="text-gray-200 mb-4 max-w-md">{banner.description}</p>
              <Button 
                variant="default" 
                className="bg-primary hover:bg-red-700 text-white py-2"
              >
                {banner.buttonText}
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners.map((banner, index) => (
          <button 
            key={banner.id}
            className={`w-2 h-2 rounded-full transition-colors ${index === activeIndex ? 'bg-primary' : 'bg-gray-400'}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default BannerSlider;
