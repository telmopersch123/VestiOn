import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { productVariantTable, shippingAddressTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import CartSummary from "../components/cart-summary";
import { formatAddress } from "../helpers/addresses";
import {
  CartType,
  IdentificationPageProps,
  TempCartItem,
} from "../identification/page";
import { FinishOrderButton } from "./components/finish-order-button";

const ConfirmationPage = async ({ searchParams }: IdentificationPageProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user.id) {
    redirect("authentication");
  }

  const params = await searchParams;
  const productVariantId = params.productVariantId;
  const quantity = Number(params.quantity);
  let cartItems: TempCartItem[] = [];
  let cart: CartType | null | undefined = null;
  let shippingAddressNow:
    | typeof shippingAddressTable.$inferSelect
    | null
    | undefined = null;
  if (productVariantId) {
    const productVariant = await db.query.productVariantTable.findFirst({
      where: eq(productVariantTable.id, productVariantId),
      with: { product: true },
    });
    const userCart = await db.query.cartTable.findFirst({
      where: (cart, { eq }) => eq(cart.userId, session.user.id),
      with: {
        shippingAddress: true, // só traz o endereço
      },
    });
    if (!userCart) {
      redirect("/cart/identification");
    }
    if (!userCart.shippingAddress) {
      redirect("/cart/identification");
    }
    shippingAddressNow = userCart.shippingAddress;

    console.log(shippingAddressNow);

    if (!productVariant) redirect("/");
    cartItems.push({
      productVariant: {
        id: productVariant.id,
        name: productVariant.name,
        priceInCents: productVariant.priceInCents,
        imageUrl: productVariant.imageUrl,
      },
      quantity,
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

    if (!cart?.shippingAddress) {
      redirect("/cart/identification");
    }

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
    shippingAddressNow = cart.shippingAddress;
  }

  const cartTotalPriceInCents = cartItems.reduce(
    (total, item) => total + item.productVariant.priceInCents * item.quantity,
    0,
  );

  return (
    <div className="space-y-12">
      <Header />
      <div className="space-y-4 px-5">
        <Card>
          <CardHeader>
            <CardTitle>Identificação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Card>
              <CardContent>
                <p className="text-sm">
                  {" "}
                  {formatAddress(
                    shippingAddressNow ?? {
                      street: "",
                      number: "",
                      complement: null,
                      neighborhood: "",
                      city: "",
                      state: "",
                      zipCode: "",
                      phone: "",
                    },
                  )}
                </p>
              </CardContent>
            </Card>
            <FinishOrderButton
              quantity={quantity}
              productVariantId={productVariantId}
            />
          </CardContent>
        </Card>

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
        {" "}
        <Footer />
      </div>
    </div>
  );
};

export default ConfirmationPage;
