import Image from "next/image";

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
    <Accordion className="flex flex-col gap-4" type="single" collapsible>
      {orders.map((order) => (
        <AccordionItem
          className="gap-4 rounded-lg border border-gray-200 shadow-sm transition-shadow duration-200 hover:shadow-md"
          key={order.id}
          value={order.id}
        >
          <AccordionTrigger className="w-full cursor-pointer pr-4 no-underline hover:no-underline">
            <Card className="flex w-full flex-col border-none shadow-none">
              <CardContent className="p-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    {order.status === "paid" && (
                      <Badge variant="default">Pago</Badge>
                    )}
                    {order.status === "pending" && (
                      <Badge variant="outline">Pendente</Badge>
                    )}
                    {order.status === "canceled" && (
                      <Badge variant="destructive">Cancelado</Badge>
                    )}
                    <span className="text-sm text-gray-600">
                      Pedido feito em{" "}
                      {new Date(order.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <span className="rounded-2xl border-2 p-2 text-sm font-semibold text-gray-800">
                    Total:{" "}
                    {(order.totalPriceInCents / 100).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>
          </AccordionTrigger>

          <AccordionContent className="mt-4 p-4">
            <div className="grid grid-cols-1 items-center gap-4 border-t pt-2 md:grid-cols-5">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="col-span-1 flex flex-col gap-4 md:col-span-5 md:flex-row md:items-center"
                >
                  {/* Imagem */}
                  <Image
                    src={item.imageUrl}
                    alt={item.productName}
                    className="h-16 w-16 rounded object-cover"
                  />
                  {/* Nome e variante */}
                  <div className="flex-1">
                    <div className="font-medium">{item.productName}</div>
                    <div className="text-sm text-gray-500">
                      {item.variantName}
                    </div>
                  </div>
                  {/* Quantidade */}
                  <div className="text-sm text-gray-600">
                    Qtd: {item.quantity}
                  </div>
                  {/* Preço */}
                  <div className="text-sm font-medium text-gray-800">
                    {(item.priceInCents / 100).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default Orders;
