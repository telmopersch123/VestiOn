import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import { db } from "@/db";
import { productVariantTable, shippingAddressTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import CartSummary from "../components/cart-summary";
import Addresses from "./components/addresses";

export type CartType = {
  items: TempCartItem[];
  shippingAddress: typeof shippingAddressTable.$inferSelect | null | undefined;
};

export type TempCartItem = {
  productVariant: {
    id: string;
    name: string;
    priceInCents: number;
    imageUrl: string;
  };
  quantity: number;
};

// Define the props type explicitly
export type PagePropsSearchParams = {
  searchParams?:
    | Promise<{ [key: string]: string | string[] | undefined }>
    | undefined;
};

export default async function IdentificationPage({
  searchParams,
}: PagePropsSearchParams) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user.id) {
    redirect("authentication");
  }

  const params = (await searchParams) ?? {};

  const productVariantId = Array.isArray(params.productVariantId)
    ? params.productVariantId[0]
    : params.productVariantId;
  const quantity = params.quantity ? Number(params.quantity) : undefined;

  let cartItems: TempCartItem[] = [];
  let cart: CartType | null | undefined = null;
  if (productVariantId) {
    const productVariant = await db.query.productVariantTable.findFirst({
      where: eq(productVariantTable.id, productVariantId),
      with: { product: true },
    });

    if (!productVariant) redirect("/");
    cartItems.push({
      productVariant: {
        id: productVariant.id,
        name: productVariant.name,
        priceInCents: productVariant.priceInCents,
        imageUrl: productVariant.imageUrl,
      },
      quantity: quantity ?? 1,
    });
  } else {
    cart = await db.query.cartTable.findFirst({
      where: (cart, { eq }) => eq(cart.userId, session.user.id),
      with: {
        shippingAddress: true,
        items: {
          with: {
            productVariant: {
              with: {
                product: true,
              },
            },
          },
        },
      },
    });
    if (!cart || cart.items.length === 0) {
      redirect("/");
    }
    cartItems = cart.items.map((item) => ({
      productVariant: {
        id: item.productVariant.id,
        name: item.productVariant.name,
        priceInCents: item.productVariant.priceInCents,
        imageUrl: item.productVariant.imageUrl,
      },
      quantity: item.quantity,
    }));
  }
  const shippingAddresses = await db.query.shippingAddressTable.findMany({
    where: eq(shippingAddressTable.userId, session.user.id),
  });
  const cartTotalPriceInCents = cartItems.reduce(
    (total, item) => total + item.productVariant.priceInCents * item.quantity,
    0,
  );
  return (
    <div className="space-y-12">
      <Header />
      <div className="space-y-4 px-5">
        <Addresses
          quantity={quantity}
          productVariantId={productVariantId}
          shippingAddresses={shippingAddresses}
        />
        <CartSummary
          subTotalInCents={cartTotalPriceInCents}
          totalInCents={cartTotalPriceInCents}
          products={cartItems.map((item) => ({
            id: item.productVariant.id,
            productName: item.productVariant.name,
            variantName: item.productVariant.name,
            quantity: item.quantity,
            priceInCents: item.productVariant.priceInCents,
            imageUrl: item.productVariant.imageUrl,
          }))}
        />
      </div>
      <div className="mt-12">
        <Footer />
      </div>
    </div>
  );
}
