import CartSummary from "@/app/cart/components/cart-summary";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface OrdersProps {
  orders: Array<{
    id: string;
    totalPriceInCents: number;
    status: "pending" | "paid" | "canceled";
    createdAt: Date;
    items: Array<{
      id: string;
      imageUrl: string;
      productName: string;
      variantName: string;
      quantity: number;
      priceInCents: number;
    }>;
  }>;
}
const Orders = ({ orders }: OrdersProps) => {
  return (
    <>
      <div className="space-y-5">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent>
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    <div className="flex items-center justify-between">
                      {order.status === "paid" && <Badge>Pago</Badge>}
                      {order.status === "pending" && (
                        <Badge variant="outline">Pagamento Pendente</Badge>
                      )}
                      {order.status === "canceled" && (
                        <Badge variant="destructive">Pagamento Cancelado</Badge>
                      )}
                      <p>
                        Pedido feito em{" "}
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <CartSummary
                      subTotalInCents={order.totalPriceInCents}
                      totalInCents={order.totalPriceInCents}
                      products={order.items.map((item) => ({
                        id: item.id,
                        productName: item.productName,
                        variantName: item.variantName,
                        quantity: item.quantity,
                        priceInCents: item.priceInCents,
                        imageUrl: item.imageUrl,
                      }))}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default Orders;
