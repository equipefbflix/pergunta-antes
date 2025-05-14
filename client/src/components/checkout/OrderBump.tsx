import { useState } from "react";
import { useGlassmorphism } from "@/hooks/useGlassmorphism";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface OrderBumpProps {
  title: string;
  description: string;
  price: number;
  onAddToCart: (added: boolean) => void;
}

export function OrderBump({ title, description, price, onAddToCart }: OrderBumpProps) {
  const glassStyles = useGlassmorphism();
  const [checked, setChecked] = useState(false);

  const handleCheck = (checked: boolean) => {
    setChecked(checked);
    onAddToCart(checked);
  };

  return (
    <div className={`${glassStyles.className} rounded-lg border border-primary p-4 mb-6`}>
      <div className="flex items-start">
        <div className="mt-1 mr-3">
          <Checkbox
            id="order-bump"
            checked={checked}
            onCheckedChange={handleCheck}
            className="h-5 w-5 text-primary rounded focus:ring-primary"
          />
        </div>
        <div>
          <Label
            htmlFor="order-bump"
            className="block font-medium text-white mb-1"
          >
            Adicionar {title}
          </Label>
          <p className="text-sm text-gray-300 mb-2">{description}</p>
          <span className="font-bold text-primary">+ R$ {price.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

export default OrderBump;
