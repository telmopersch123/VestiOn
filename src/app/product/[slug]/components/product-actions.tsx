"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

import AddToCardButton from "./add-to-cart";
import VariantsContainer from "./variants";

interface ProductActionsProps {
  productVariant: {
    slug: string;
    id: string;
    name: string;
    createdAt: Date;
    productId: string;
    color: string;
    priceInCents: number;
    imageUrl: string;
    product: {
      slug: string;
      id: string;
      name: string;
      createdAt: Date;
      description: string;
      categoryId: string;
      variants: {
        slug: string;
        id: string;
        name: string;
        createdAt: Date;
        productId: string;
        color: string;
        priceInCents: number;
        imageUrl: string;
      }[];
    };
  };
}

const ProductActions = ({ productVariant }: ProductActionsProps) => {
  const router = useRouter();
  const session = authClient.useSession().data;
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const storedQuantity = localStorage.getItem("quantity");
    const storedCategory = localStorage.getItem("category");
    const currentCategory = String(productVariant.product.categoryId);

    if (storedCategory && storedCategory !== currentCategory) {
      localStorage.setItem("category", currentCategory);
      localStorage.removeItem("quantity");
      setQuantity(1);
    } else if (storedQuantity && storedCategory === currentCategory) {
      setQuantity(Number(storedQuantity));
    } else {
      localStorage.removeItem("quantity");
      setQuantity(1);
    }
  }, [productVariant.product.categoryId]);

  const handleMais = () => {
    setQuantity((prev) => {
      const next = prev + 1;
      localStorage.setItem("quantity", String(next));
      return next;
    });
  };

  const handleMenos = () => {
    setQuantity((prev) => {
      const next = prev > 1 ? prev - 1 : 1;
      localStorage.setItem("quantity", String(next));
      return next;
    });
  };

  const handleBuyNow = () => {
    if (!session?.user) {
      toast.error("Você precisa estar logado para comprar.");
      router.push("/authentication"); // redireciona para login
      return;
    }
    router.push(
      `/cart/identification?productVariantId=${productVariant.id}&quantity=${quantity}`,
    );
  };

  return (
    <>
      <div className="flex flex-col space-y-4">
        <div className="mt-20 flex flex-col space-y-4 px-5">
          <div>
            <div className="space-x-4">
              <h3 className="font-medium">Quantidade</h3>
              <div className="flex w-[100px] flex-row items-center justify-between rounded-lg border">
                <Button
                  className="cursor-pointer"
                  size="icon"
                  variant="outline"
                  onClick={handleMenos}
                >
                  <MinusIcon />
                </Button>
                <p>{quantity}</p>
                <Button
                  className="cursor-pointer"
                  size="icon"
                  variant="outline"
                  onClick={handleMais}
                >
                  <PlusIcon />
                </Button>
              </div>
            </div>
          </div>
          {/* Variantes */}
          <VariantsContainer
            variants={productVariant.product.variants}
            selectedVariantSlug={productVariant.slug}
          />
        </div>
        <div className="flex flex-col space-y-4 px-5">
          <AddToCardButton
            productVariantId={productVariant.id}
            quantity={quantity}
          />
          <Button
            onClick={handleBuyNow}
            size="lg"
            className="cursor-pointer rounded-full"
          >
            Comprar agora
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProductActions;
