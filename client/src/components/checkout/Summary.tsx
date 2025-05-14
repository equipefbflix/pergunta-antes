import { useGlassmorphism } from "@/hooks/useGlassmorphism";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Product } from "@/types";
import { useLocation } from "wouter";

interface SummaryItem {
  name: string;
  price: number;
}

interface SummaryProps {
  product: Product;
  additionalItems: SummaryItem[];
}

export function Summary({ product, additionalItems }: SummaryProps) {
  const glassStyles = useGlassmorphism();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const total = additionalItems.reduce((sum, item) => sum + item.price, product.price);

  const handleCheckout = () => {
    setIsProcessing(true);
    
    // Simulate checkout process
    setTimeout(() => {
      toast({
        title: "Compra realizada com sucesso!",
        description: "Confira os detalhes em 'Meus Pedidos'.",
        variant: "success",
      });
      setIsProcessing(false);
      setLocation("/dashboard");
    }, 1500);
  };

  return (
    <div className={`${glassStyles.className} rounded-xl overflow-hidden sticky top-24`}>
      <div className="p-6">
        <h2 className="text-xl font-bold text-white mb-6">Resumo do Pedido</h2>
        
        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-300">{product.title}</span>
            <span className="text-white">R$ {product.price.toFixed(2)}</span>
          </div>
          
          {additionalItems.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span className="text-gray-300">{item.name}</span>
              <span className="text-white">R$ {item.price.toFixed(2)}</span>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-700 my-4"></div>
        
        <div className="flex justify-between mb-6">
          <span className="text-lg font-bold text-white">Total</span>
          <span className="text-lg font-bold text-white">R$ {total.toFixed(2)}</span>
        </div>
        
        <div className="space-y-4">
          <Button
            onClick={handleCheckout}
            disabled={isProcessing}
            className="w-full py-3 px-4 bg-primary hover:bg-red-700 text-white font-medium rounded-lg transition-colors focus:outline-none"
          >
            {isProcessing ? "Processando..." : "Finalizar Compra"}
          </Button>
          
          <p className="text-xs text-center text-gray-400">
            Ao finalizar sua compra, você concorda com nossos{" "}
            <a href="#" className="text-primary hover:underline">Termos de Uso</a> e{" "}
            <a href="#" className="text-primary hover:underline">Política de Privacidade</a>.
          </p>
          
          <div className="flex justify-center space-x-3">
            <svg className="text-gray-400 h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.539 7.5H14.9a.394.394 0 00-.4.393v.357h2.137a.81.81 0 01.806.809c0 .447-.362.811-.806.811H14.5v.393c0 .218.178.396.4.396h1.639c.445 0 .808.364.808.814a.81.81 0 01-.808.814H14.9a1.605 1.605 0 01-1.604-1.61v-.807h-.69a.81.81 0 01-.808-.816c0-.45.362-.816.809-.816h.689v-.354A1.605 1.605 0 0114.9 5.872h1.639c.445 0 .808.36.808.814a.812.812 0 01-.808.814zM11.611 5.872c.445 0 .808.36.808.814a.81.81 0 01-.808.814h-1.91c-.121 0-.204.097-.204.204v.332h2.114a.81.81 0 01.809.814.81.81 0 01-.809.814H9.497v.375h2.114a.81.81 0 01.809.814.81.81 0 01-.809.814H9.497v.375h2.114a.81.81 0 01.809.814.81.81 0 01-.809.814H9.497c.043.14.133.204.204.204h1.91c.445 0 .808.357.808.814a.81.81 0 01-.808.814h-1.91a1.609 1.609 0 01-1.605-1.61V7.483a1.607 1.607 0 011.605-1.61h1.91zm10.622 6.62a.81.81 0 01-.806.811h-1.922c-.9 0-1.536-.636-1.536-1.629V8.132c0-.225.175-.399.4-.399h.596c.445 0 .808.364.808.814a.81.81 0 01-.808.811h-.2v2.94c0 .122.096.207.203.207h2.062c.446 0 .807.364.807.814a.809.809 0 01-.807.811H6.704a.809.809 0 01-.807-.811.81.81 0 01.807-.814h2.062a.206.206 0 00.204-.207V6.914a.206.206 0 00-.204-.207H6.704a.81.81 0 01-.807-.814c0-.45.362-.814.807-.814h2.062c.9 0 1.533.64 1.533 1.632v3.036c0 .225.179.396.4.396h.596a.81.81 0 01.808.816.81.81 0 01-.808.814h-.596a1.606 1.606 0 01-1.604-1.611V7.697h-.2a.81.81 0 01-.807-.814c0-.45.361-.814.807-.814h.596c.222 0 .4.174.4.4v.728h.204V6.686c0-.9.636-1.629 1.533-1.629h6.24c.9 0 1.536.729 1.536 1.629v.728c.222 0 .4.174.4.4v3.046c0 .225-.178.399-.4.399h-.596a.81.81 0 01-.808-.814.81.81 0 01.808-.816h.2V7.283a.207.207 0 00-.203-.207h-.497v4.318a1.606 1.606 0 01-1.605 1.61h-.596a.81.81 0 01-.808-.814.81.81 0 01.808-.814h.596c.221 0 .4-.175.4-.396V7.076h-2.115v.656c0 .225-.178.399-.4.399h-.597a.81.81 0 01-.807-.814.81.81 0 01.807-.816h.201v-.635a.206.206 0 00-.204-.207h-.497V10.3c0 .224-.179.399-.4.399h-.596a.81.81 0 01-.808-.814.811.811 0 01.808-.816h.2V7.697h-.596a.81.81 0 01-.808-.814c0-.45.362-.814.808-.814h.596c.222 0 .4.174.4.4v.728h2.115v-.728c0-.226.178-.4.4-.4h.596c.222 0 .4.174.4.4v.728h2.114v-.728c0-.226.179-.4.4-.4h.596c.446 0 .808.36.808.814zm-4.644 1.625h-.596a1.606 1.606 0 01-1.604-1.61V10.3h-.004v.207c0 .892-.636 1.61-1.533 1.61h-6.24c-.9 0-1.533-.718-1.533-1.61v-.656h-.4c-.9 0-1.536-.636-1.536-1.629V5.187c0-.993.636-1.629 1.536-1.629h1.922c.446 0 .807.36.807.814a.809.809 0 01-.807.814H6.704a.206.206 0 00-.204.207V8.69h.2c.222 0 .4.171.4.393v.371h.497c.9 0 1.533.722 1.533 1.61v.743h.2c.222 0 .4.171.4.393v.371h4.372v-.371c0-.222.178-.393.4-.393h.2v-.742c0-.89.636-1.611 1.533-1.611h.497v-.371c0-.222.178-.393.4-.393h.2V5.393a.207.207 0 00-.204-.207h-2.062a.809.809 0 01-.807-.814c0-.454.362-.814.807-.814h2.062c.9 0 1.536.636 1.536 1.629v3.542c0 .993-.636 1.629-1.536 1.629h-.4v.656c0 .892-.636 1.61-1.533 1.61l-.007-.007z" />
            </svg>
            <svg className="text-gray-400 h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.577 5.22h-1.509a1.346 1.346 0 00-1.232.782l-3.035 7.145a.19.19 0 01-.352 0L13.273 8.14a1.689 1.689 0 00-1.534-1.012h-2.224a.281.281 0 00-.285.316l2.033 9.635c.094.396.44.676.845.676h.094a.926.926 0 00.823-.535l6.607-11.245a.253.253 0 00-.055-.755zM15.094 6.33l-.267.618H9.19a.284.284 0 01-.28-.351.421.421 0 01.365-.267h5.537c.174 0 .304.174.282.35zm-1.58.995l-.422.995H8.535c-.175 0-.305-.174-.284-.35a.421.421 0 01.366-.267h4.682c.175 0 .305.174.216.35v.022zm-2.15 3.625a.405.405 0 01-.365.267H5.332a.283.283 0 01-.279-.35.421.421 0 01.365-.267h5.665c.174 0 .304.174.282.35zm-.424.995a.422.422 0 01-.365.267H4.902a.284.284 0 01-.28-.35.421.421 0 01.366-.267h5.664c.175 0 .305.174.288.35zm-.424.995a.421.421 0 01-.365.267H4.48a.284.284 0 01-.28-.35.421.421 0 01.365-.267h5.64c.156 0 .287.174.31.35zm-.431.996a.421.421 0 01-.365.267H4.044a.272.272 0 01-.265-.35.405.405 0 01.365-.267h5.664c.174 0 .304.174.277.35zm-5.665-6.02a.283.283 0 01-.28-.352.421.421 0 01.365-.267h5.387c.175 0 .305.174.283.35a.406.406 0 01-.365.268H4.42z" />
            </svg>
            <svg className="text-gray-400 h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.587 11.272h-2.305a.272.272 0 00-.272.273v1.09c0 .151.121.272.272.272h2.305a.272.272 0 00.273-.273v-1.09a.272.272 0 00-.273-.272zm-6.039 0H8.243a.272.272 0 00-.272.273v1.09c0 .151.121.272.272.272h2.305a.272.272 0 00.273-.273v-1.09a.272.272 0 00-.273-.272zm3.015 0h-2.3a.272.272 0 00-.273.273v1.09c0 .151.122.272.273.272h2.305a.272.272 0 00.272-.273v-1.09a.272.272 0 00-.272-.272h-.005zm9.135-3.97a11.4 11.4 0 00-.357-1.004 2.198 2.198 0 00-1.947-1.258h-5.387a1.34 1.34 0 00-.55.121c-.422.195-.731.59-.767 1.07a4.5 4.5 0 01-3.21 4.008 5.35 5.35 0 01-1.329.177H7.532c-1.203 0-2.219.955-2.219 2.15 0 .151.016.303.044.454.267 1.452.6 3.212.6 3.212.149.696.624 1.275 1.305 1.534.314.113.644.172.975.177h10.205c1.32 0 2.412-1.028 2.412-2.334v-6.607c-.005-.922-.307-1.692-.767-2.15.025-.166.02-.377.01-.55zm-1.07 8.756c0 .742-.63 1.337-1.37 1.337H9.059a1.77 1.77 0 01-.704-.126c-.417-.16-.697-.53-.8-.948l-.6-3.223a1.202 1.202 0 01-.026-.217c0-.684.588-1.253 1.28-1.253h1.625c.6 0 1.193-.108 1.76-.32a5.471 5.471 0 003.89-4.887c.011-.182.15-.329.324-.329h5.387c.49 0 .91.392 1.056.97.65.258.121.52.177.788v.01c.011.05.022.1.033.15l.016.122c.016.17.022.34.022.51V16.057h-.01zm-3.798-9.86c-.068.006-.115.071-.11.14a.126.126 0 00.138.111l1.947-.172a.126.126 0 00.116-.134.126.126 0 00-.138-.111l-1.953.166z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Summary;
