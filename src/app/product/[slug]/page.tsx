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
import VariantsContainer from "./components/variants";

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
      <div className="flex flex-col space-y-6">
        <Image
          src={productVariant.imageUrl}
          alt={productVariant.product.name}
          sizes="100vw"
          width={0}
          height={0}
          className="h-auto w-full rounded-3xl object-cover"
        />
        <div className="px-5">
          <VariantsContainer
            variants={productVariant.product.variants}
            selectedVariantSlug={productVariant.slug}
          />
        </div>
        <div className="px-5">
          <h2 className="text-lg font-semibold">
            {productVariant.product.name}
          </h2>
          <h3 className="text-muted-foreground text-sm">
            {productVariant.name}
          </h3>
          <h3 className="text-lg font-semibold">
            {formatCentsToBRL(productVariant.priceInCents)}
          </h3>
        </div>
        <ProductActions productVariantId={productVariant.id} />
        <div className="px-5">
          <p className="text-muted-foreground text-sm">
            {productVariant.product.description}
          </p>
        </div>
        <ProductList title="Talvez você goste" products={likelyProducts} />
        <Footer />
      </div>
    </>
  );
};

export default ProductsVariantsPage;
