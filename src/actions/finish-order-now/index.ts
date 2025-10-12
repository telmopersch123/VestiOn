"use server";
import { db } from "@/db";
import {
  orderItemTable,
  orderTable,
  productVariantTable,
  shippingAddressTable,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

interface FinishOrderNowParams {
  productVariantId: string | undefined;
  quantity: number | undefined;
}

const useFinishOrderNow = async ({
  productVariantId,
  quantity,
}: FinishOrderNowParams) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Usuário não autenticado");
  }
  if (!productVariantId || quantity === undefined)
    throw new Error("Produto nao encontrado");
  /// Pegar o endereço de entrega
  const shippingAddress = await db.query.shippingAddressTable.findFirst({
    where: eq(shippingAddressTable.userId, session.user.id),
  });

  if (!shippingAddress) {
    throw new Error("Endereço de entrega não encontrado");
  }
  /// Pegar o produto
  const productVariant = await db.query.productVariantTable.findFirst({
    where: eq(productVariantTable.id, productVariantId),
  });

  if (!productVariant) {
    throw new Error("Produto não encontrado");
  }

  const totalPriceInCents = productVariant.priceInCents * quantity;

  let orderId: string | undefined;

  await db.transaction(async (tx) => {
    // Cria o pedido
    const [order] = await tx
      .insert(orderTable)
      .values({
        userId: session.user.id,
        shippingAddressId: shippingAddress.id,
        recipientName: shippingAddress.recipientName,
        street: shippingAddress.street,
        number: shippingAddress.number,
        complement: shippingAddress.complement,
        city: shippingAddress.city,
        state: shippingAddress.state,
        neighborhood: shippingAddress.neighborhood,
        zipCode: shippingAddress.zipCode,
        country: shippingAddress.country,
        phone: shippingAddress.phone,
        email: shippingAddress.email,
        cpfOrCnpj: shippingAddress.cpfOrCnpj,
        totalPriceInCents,
      })
      .returning();
    if (!order) throw new Error("Erro ao criar pedido");

    orderId = order.id;

    // Adiciona o produto ao pedido
    await tx.insert(orderItemTable).values({
      orderId: order.id,
      productVariantId: productVariant.id,
      quantity,
      priceInCents: productVariant.priceInCents,
    });
  });
  return { orderId };
};

export default useFinishOrderNow;
