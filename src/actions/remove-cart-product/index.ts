"use server";

import { db } from "@/db";
import { cartItemTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import z from "zod";
import { removeProductFromCartSchema } from "./schema";

export const removeProductFromCart = async (
  data: z.infer<typeof removeProductFromCartSchema>,
) => {
  removeProductFromCartSchema.parse(data);
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Usuário não autenticado");
  }

  // Verificar se o produto já está no carrinho
  const cartItem = await db.query.cartItemTable.findFirst({
    where: (cartItem, { eq }) => eq(cartItem.id, data.cartItemId),
    with: {
      cart: true,
    },
  });
  const cartDoesNotBelongToUser = cartItem?.cart?.userId !== session.user.id;
  if (cartDoesNotBelongToUser) {
    throw new Error("Unauthorized");
  }
  // Se o produto nao estiver no carrinho, retornar erro
  if (!cartItem) {
    throw new Error("Produto não encontrado no carrinho.");
  }
  // Remover o produto do carrinho
  await db
    .delete(cartItemTable)
    .where(eq(cartItemTable.id, cartItem.id))
    .execute();
};
