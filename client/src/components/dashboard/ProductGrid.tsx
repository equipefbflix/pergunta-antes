import { useState } from "react";
import { Link } from "wouter";
import { useGlassmorphism } from "@/hooks/useGlassmorphism";
import { Product, ProductCategory } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Flame, Zap, ShoppingCart, Package, TrendingUp } from "lucide-react";

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
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mb-12">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} glassStyles={glassStyles} />
      ))}
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  glassStyles: {
    className: string;
    style: React.CSSProperties;
  };
}

function ProductCard({ product, glassStyles }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);

  const incrementQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, product.stock || 10));
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1));
  };

  return (
    <div
      className={`${glassStyles.className} rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 w-full max-w-xs mx-auto flex flex-col`}
      style={{
        ...glassStyles.style,
        backdropFilter: 'blur(20px)',
        borderColor: 'rgba(255, 255, 255, 0.1)'
      }}
    >
      {/* Imagem do produto */}
      <div className="h-48 w-full overflow-hidden relative">
        <img 
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        
        {/* Tags e alertas */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isLowStock && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-amber-600/80 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Zap size={12} /> Acabando rápido!
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="text-xs">Produto com estoque limitado</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {product.isPopular && (
            <Badge className="bg-green-600 hover:bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Mais popular
            </Badge>
          )}
        </div>
        
        {/* Nome do produto e preço */}
        <div className="absolute bottom-3 left-0 right-0 px-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white text-shadow">{product.title}</h3>
            <span className="text-primary font-bold text-lg bg-black/40 px-2 py-1 rounded-md">
              R$ {product.price.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
      
      {/* Conteúdo do card */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Informações do produto */}
        <p className="text-sm text-gray-300 mb-4 line-clamp-2">{product.description}</p>
        
        {/* Indicadores */}
        <div className="mb-4 space-y-2">
          {/* Temperatura do produto */}
          {product.temperature !== undefined && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2">
                    <Flame size={16} className="text-primary" />
                    <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-yellow-500 to-red-600 rounded-full"
                        style={{ width: `${product.temperature}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-300 text-xs">{product.temperature}°</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Temperatura do produto indica popularidade</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {/* Estoque disponível */}
          {product.stock !== undefined && (
            <div className="flex items-center gap-2">
              <Package size={16} className="text-gray-400" />
              <span className="text-gray-300 text-xs">{product.stock} disponíveis</span>
            </div>
          )}
          
          {/* Vendas recentes */}
          {product.soldToday !== undefined && (
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-green-500" />
              <span className="text-primary text-xs">{product.soldToday} vendidos hoje</span>
            </div>
          )}
        </div>
        
        {/* Quantidade */}
        <div className="mb-4">
          <div className="flex items-center justify-between p-1 bg-gray-800 rounded-lg">
            <button 
              className="w-8 h-8 flex items-center justify-center text-white bg-gray-700 rounded-md hover:bg-gray-600"
              onClick={decrementQuantity}
            >
              -
            </button>
            <span className="text-white text-sm font-medium">{quantity}</span>
            <button 
              className="w-8 h-8 flex items-center justify-center text-white bg-gray-700 rounded-md hover:bg-gray-600"
              onClick={incrementQuantity}
            >
              +
            </button>
          </div>
        </div>
        
        {/* Botões de ação */}
        <div className="mt-auto space-y-2">
          <button 
            className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart size={16} />
            Adicionar ao carrinho
          </button>
          
          <Link href={`/checkout/${product.id}`}>
            <Button 
              className="w-full py-2 bg-primary hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Comprar
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductGrid;
