import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import ProductList from "@/components/common/product-list";
import { db } from "@/db";
import { productTable, productVariantTable } from "@/db/schema";
import { formatCentsToBRL } from "@/helpers/money";
import { eq } from "drizzle-orm";
import Image from "next/image";
import { notFound } from "next/navigation";

import ProductActions from "./components/product-actions";

interface ProductsVariantsPage {
  params: Promise<{ slug: string }>;
}
const ProductsVariantsPage = async ({ params }: ProductsVariantsPage) => {
  const { slug } = await params;
  const productVariant = await db.query.productVariantTable.findFirst({
    where: eq(productVariantTable.slug, slug),
    with: {
      product: {
        with: {
          variants: true,
        },
      },
    },
  });
  if (!productVariant) return notFound();
  const likelyProducts = await db.query.productTable.findMany({
    where: eq(productTable.categoryId, productVariant.product.categoryId),
    with: { variants: true },
  });

  return (
    <>
      <Header />
      <main className="space-y-8 px-5 py-4 sm:py-6 lg:px-20 lg:py-8">
        {/* Container principal: imagem + info */}
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-4">
          {/* Imagem do produto */}
          <div className="m-auto">
            <Image
              src={productVariant.imageUrl}
              alt={productVariant.product.name}
              width={1000}
              height={1000}
              className="h-auto w-[650px] rounded-2xl object-cover"
            />
          </div>

          {/* Informações e ações */}
          <div className="flex flex-1 flex-col justify-between gap-6 lg:gap-0">
            {/* Nome e preço */}
            <div className="space-y-1 px-5">
              <h1 className="text-lg font-semibold text-gray-900 sm:text-xl lg:text-2xl">
                {productVariant.product.name}
              </h1>
              <h2 className="text-sm text-gray-500 sm:text-base">
                {productVariant.name}
              </h2>
              <p className="text-lg font-semibold text-gray-900 sm:text-xl lg:text-2xl">
                {formatCentsToBRL(productVariant.priceInCents)}
              </p>
            </div>

            {/* Ações */}
            <ProductActions productVariant={productVariant} />

            {/* Descrição */}
            {productVariant.product.description && (
              <p className="mt-2 text-sm text-gray-500 sm:text-base">
                {productVariant.product.description}
              </p>
            )}
          </div>
        </div>

        {/* Produtos relacionados */}
        <ProductList
          height={82}
          title="Talvez você goste"
          products={likelyProducts}
        />
      </main>
      <Footer />
    </>
  );
};

export default ProductsVariantsPage;
