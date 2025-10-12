import { getCategories } from "@/data/categories/get";
import {
  getCategoriesWithProducts,
  getProductsWithVariants,
} from "@/data/products/get-product";
import Image from "next/image";
import CategorySelector from "../components/common/category-selector";
import Footer from "../components/common/footer";
import Header from "../components/common/header";
import ProductList from "../components/common/product-list";

export default async function Home() {
  const [products, categories, categoriesWithProducts] = await Promise.all([
    getProductsWithVariants(),
    getCategories(),
    getCategoriesWithProducts(),
  ]);
  return (
    <>
      <Header />
      <div className="space-y-6">
        <div className="px-5">
          <Image
            src="/banner-01.png"
            alt="Leve uma vida com estilo"
            height={0}
            width={0}
            sizes="100vw"
            className="h-auto w-full"
          />
        </div>

        <ProductList products={products} title="Mais vendidos" />

        <div className="px-5">
          <CategorySelector categories={categories} />
        </div>

        <div className="px-5">
          <Image
            src="/banner-02.png"
            alt="Leve uma vida com estilo"
            height={0}
            width={0}
            sizes="100vw"
            className="h-auto w-full"
          />
        </div>
        <ProductList products={categoriesWithProducts} title="Novos Produtos" />
      </div>
      <Footer />
    </>
  );
}
