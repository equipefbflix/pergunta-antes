import { useState } from "react";
import { useGlassmorphism } from "@/hooks/useGlassmorphism";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface AddBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddBalanceModal({ isOpen, onClose }: AddBalanceModalProps) {
  const glassStyles = useGlassmorphism();
  const [amount, setAmount] = useState<number>(100);
  const [coupon, setCoupon] = useState<string>("");
  const [cashbackPercentage, setCashbackPercentage] = useState<number>(5);
  const { toast } = useToast();
  const { user } = useAuth();

  const cashbackAmount = amount * (cashbackPercentage / 100);
  const totalAmount = amount + cashbackAmount;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 10) {
      setAmount(value);
    }
  };

  const handleCouponChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCoupon(e.target.value);
    
    // Simulate different cashback percentages based on coupon
    if (e.target.value.toLowerCase() === "extra10") {
      setCashbackPercentage(10);
    } else if (e.target.value.toLowerCase() === "vip15") {
      setCashbackPercentage(15);
    } else {
      setCashbackPercentage(5); // Default cashback
    }
  };

  const handleAddBalance = () => {
    // In a real app, this would be an API call
    toast({
      title: "Saldo adicionado com sucesso!",
      description: `R$ ${totalAmount.toFixed(2)} foram adicionados à sua conta.`,
      variant: "success",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${glassStyles.className} max-w-md mx-auto p-0 border-0`}>
        <div className="p-6">
          <DialogHeader className="flex justify-between items-center mb-4">
            <DialogTitle className="text-xl font-bold text-white">Adicionar Saldo</DialogTitle>
            <Button variant="ghost" onClick={onClose} className="h-8 w-8 p-0">
              <X className="h-4 w-4 text-gray-400 hover:text-white" />
            </Button>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label className="block text-sm font-medium text-gray-300 mb-1">Valor</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">R$</span>
                <Input
                  type="number"
                  min={10}
                  value={amount}
                  onChange={handleAmountChange}
                  className="pl-10 px-4 py-3 bg-gray-800 bg-opacity-50 rounded-lg placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all" 
                  placeholder="0,00"
                />
              </div>
            </div>
            
            <div>
              <Label className="block text-sm font-medium text-gray-300 mb-1">Cupom de cashback (opcional)</Label>
              <Input
                type="text"
                value={coupon}
                onChange={handleCouponChange}
                className="px-4 py-3 bg-gray-800 bg-opacity-50 rounded-lg placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="Digite seu cupom"
              />
            </div>
            
            <div className={`${glassStyles.className} rounded-lg p-4 mt-4`}>
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Valor da recarga</span>
                <span className="text-white">R$ {amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Cashback ({cashbackPercentage}%)</span>
                <span className="text-green-400">+ R$ {cashbackAmount.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-700 my-2"></div>
              <div className="flex justify-between font-bold">
                <span className="text-white">Total a receber</span>
                <span className="text-white">R$ {totalAmount.toFixed(2)}</span>
              </div>
            </div>
            
            <Button
              onClick={handleAddBalance}
              className="w-full py-3 px-4 bg-primary hover:bg-red-700 text-white font-medium rounded-lg transition-colors focus:outline-none"
            >
              Adicionar Saldo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
