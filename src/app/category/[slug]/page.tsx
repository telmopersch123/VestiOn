import { db } from "@/db";
import { categoryTable, productTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Header from "../../../components/common/header";
import ProductItem from "../../../components/common/product-item";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}
const CategoryPage = async ({ params }: CategoryPageProps) => {
  const { slug } = await params;
  const category = await db.query.categoryTable.findFirst({
    where: eq(categoryTable.slug, slug),
  });
  if (!category) return notFound();
  const products = await db.query.productTable.findMany({
    where: eq(productTable.categoryId, category.id),
    with: { variants: true },
  });

  return (
    <>
      <Header />

      <main className="space-y-6 px-5 py-4 sm:py-6 lg:px-20">
        {/* Título da categoria */}
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          {category.name}
        </h2>

        {/* Grid de produtos */}
        {products.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-shadow duration-300 hover:shadow-xl"
              >
                <ProductItem
                  product={product}
                  textContainerClassName="p-3 flex flex-col justify-between"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Nenhum produto encontrado.</p>
        )}
      </main>
    </>
  );
};

export default CategoryPage;
