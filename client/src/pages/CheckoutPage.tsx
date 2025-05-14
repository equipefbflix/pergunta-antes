import { useState, useEffect } from "react";
import { useParams } from "wouter";
import Header from "@/components/layout/Header";
import ThemeToggle from "@/components/layout/ThemeToggle";
import OrderBump from "@/components/checkout/OrderBump";
import Summary from "@/components/checkout/Summary";
import { useGlassmorphism } from "@/hooks/useGlassmorphism";
import { products, orderBump } from "@/mocks/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CheckoutPage() {
  const { productId } = useParams<{ productId: string }>();
  const glassStyles = useGlassmorphism();
  
  const [product, setProduct] = useState(products[0]);
  const [hasOrderBump, setHasOrderBump] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  // Find the product by ID
  useEffect(() => {
    if (productId) {
      const foundProduct = products.find(p => p.id === parseInt(productId));
      if (foundProduct) {
        setProduct(foundProduct);
      }
    }
  }, [productId]);

  const handleOrderBumpChange = (added: boolean) => {
    setHasOrderBump(added);
  };

  const handleCouponApply = () => {
    // Mock coupon logic
    if (couponCode.toLowerCase() === "fbflix10") {
      setDiscount(product.price * 0.1);
    } else if (couponCode.toLowerCase() === "promo20") {
      setDiscount(product.price * 0.2);
    } else {
      setDiscount(0);
    }
  };

  const additionalItems = [
    ...(hasOrderBump ? [{ name: orderBump.title, price: orderBump.price }] : []),
    ...(discount > 0 ? [{ name: "Desconto", price: -discount }] : []),
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header isCheckout={true} />
      
      <main className="container mx-auto px-4 py-6">
        {/* Checkout Banner */}
        <div className={`${glassStyles.className} rounded-xl p-4 mb-6 flex items-center`}>
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-medium">Garantia de 7 dias</h3>
            <p className="text-sm text-gray-300">Satisfação garantida ou seu dinheiro de volta</p>
          </div>
        </div>

        {/* Checkout Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Details */}
          <div className="lg:col-span-2">
            <div className={`${glassStyles.className} rounded-xl overflow-hidden mb-6`}>
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-6">Detalhes do Pedido</h2>
                
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="w-full md:w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <h3 className="text-lg font-semibold text-white">{product.title}</h3>
                      <span className="text-white font-bold">R$ {product.price.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">{product.description}</p>
                    <div className="flex items-center">
                      <span className="inline-block px-2 py-1 bg-green-900 text-green-300 text-xs rounded-md">
                        {product.period}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-700 my-6"></div>
                
                {/* Cupom Field */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Cupom de desconto
                  </label>
                  <div className="flex">
                    <Input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-4 py-3 bg-gray-800 bg-opacity-50 rounded-l-lg placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      placeholder="Digite seu cupom"
                    />
                    <Button
                      onClick={handleCouponApply}
                      className="px-4 py-3 bg-primary hover:bg-red-700 text-white font-medium rounded-r-lg transition-colors"
                    >
                      Aplicar
                    </Button>
                  </div>
                </div>
                
                {/* Order Bump */}
                <OrderBump
                  title={orderBump.title}
                  description={orderBump.description}
                  price={orderBump.price}
                  onAddToCart={handleOrderBumpChange}
                />
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <Summary product={product} additionalItems={additionalItems} />
        </div>
      </main>
      
      <ThemeToggle />
    </div>
  );
}

export default CheckoutPage;
