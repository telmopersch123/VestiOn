"use server";

import { db } from "@/db";
import { cartTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { UpdateCartShippingAddressSchema } from "./schema";

export async function updateCartShippingAddress(
  data: UpdateCartShippingAddressSchema,
) {
  UpdateCartShippingAddressSchema.parse(data);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Usuário não autenticado");
  }

  const shippingAddress = await db.query.shippingAddressTable.findFirst({
    where: (shippingAddress, { eq }) =>
      eq(shippingAddress.userId, session.user.id) &&
      eq(shippingAddress.id, data.shippingAddressId),
  });
  if (!shippingAddress) {
    throw new Error("Endereço de entrega nao encontrado");
  }

  // Pegar o Carrinho do usuário
  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, session.user.id),
  });
  if (!cart) {
    throw new Error("Carrinho nao encontrado");
  }

  // Atualiza o carrinho do usuário logado
  await db
    .update(cartTable)
    .set({ shippingAddressId: data.shippingAddressId })
    .where(eq(cartTable.id, cart.id));

  return { success: true };
}
