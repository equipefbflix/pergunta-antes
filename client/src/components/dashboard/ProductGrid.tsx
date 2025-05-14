import { Link } from "wouter";
import { useGlassmorphism } from "@/hooks/useGlassmorphism";
import { Product, ProductCategory } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductGridProps {
  products: Product[];
  category: ProductCategory;
}

export function ProductGrid({ products, category }: ProductGridProps) {
  const glassStyles = useGlassmorphism();
  
  // Filter products by category if not "all"
  const filteredProducts = category === "all" 
    ? products 
    : products.filter(product => product.category === category);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {filteredProducts.map((product) => (
        <div
          key={product.id}
          className={`${glassStyles.className} rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
        >
          <div className="h-40 overflow-hidden relative">
            <img 
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            
            {product.tags.length > 0 && (
              <div className="absolute bottom-3 left-3">
                {product.tags.map((tag, index) => (
                  <Badge 
                    key={index}
                    className={`px-2 py-1 text-xs rounded-full ${
                      tag === 'Mais Popular' ? 'bg-green-500 text-white' :
                      tag === 'Novo' ? 'bg-primary text-white' : 'bg-gray-500 text-white'
                    }`}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-5">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold dark:text-white text-gray-900">{product.title}</h3>
              <span className="text-primary font-bold">R$ {product.price.toFixed(2)}</span>
            </div>
            <p className="text-sm dark:text-gray-300 text-gray-600 mb-4">{product.description}</p>
            
            <Link href={`/checkout/${product.id}`}>
              <Button 
                className="w-full py-2 bg-primary hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Adquirir
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductGrid;
