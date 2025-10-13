import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCentsToBRL } from "@/helpers/money";

interface CartSummaryProps {
  subTotalInCents: number;
  totalInCents: number;
  products: Array<{
    id: string;
    productName: string;
    variantName: string;
    quantity: number;
    priceInCents: number;
    imageUrl: string;
  }>;
}

const CartSummary = ({
  subTotalInCents,
  totalInCents,
  products,
}: CartSummaryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo do Pedido</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <p className="text-sm">Subtotal</p>
          <p className="text-muted-foreground text-sm font-medium">
            {formatCentsToBRL(subTotalInCents)}
          </p>
        </div>
        <div className="flex justify-between">
          <p className="text-sm">Frete</p>
          <p className="text-primary text-sm font-medium">GRÁTIS</p>
        </div>
        <div className="flex justify-between">
          <p className="text-sm">Total</p>
          <p className="text-muted-foreground text-sm font-medium">
            {formatCentsToBRL(totalInCents)}
          </p>
        </div>
        <div className="py-3">
          <Separator />
        </div>
        {products.map((product) => (
          <div key={product.id} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src={product.imageUrl}
                alt={product.productName}
                width={100}
                height={100}
                className="rounded-xl"
              />
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold">{product.productName}</p>
                <p className="text-muted-foreground text-sm font-medium">
                  {product.variantName}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end justify-center gap-2">
              <p className="text-sm font-bold text-black/80">
                {formatCentsToBRL(product.priceInCents * product.quantity)}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CartSummary;
