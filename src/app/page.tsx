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
      <div className="space-y-6 md:space-y-16">
        <div className="pt-2 [background:linear-gradient(to_top,white_15%,#8367ef_97%,white_100%)] lg:pt-4 lg:[background:linear-gradient(to_top,white_15%,#8367ef_95%,white_100%)]">
          <div className="relative flex justify-center p-4 px-4 md:px-12 lg:px-24">
            <Image
              src="/banner-01.png"
              alt="Leve uma vida com estilo"
              height={1000}
              width={1000}
              className="h-auto w-full sm:w-[70%] md:w-[50%] lg:w-[40%] 2xl:w-[25%]"
            />
            <div className="pointer-events-none absolute bottom-0 left-0 z-10 h-15 w-full bg-gradient-to-t from-white via-white/95 to-white/0" />
          </div>
        </div>

        <ProductList products={products} title="Mais vendidos" />

        <div className="px-5">
          <CategorySelector categories={categories} />
        </div>

        <div className="pt-2 [background:linear-gradient(to_top,white_15%,#679cec_97%,white_100%)] lg:pt-4 lg:[background:linear-gradient(to_top,white_15%,#679cec_95%,white_100%)]">
          <div className="relative flex justify-center p-4 px-4 md:px-12 lg:px-24">
            <Image
              src="/banner-02.png"
              alt="Leve uma vida com estilo"
              height={1000}
              width={1000}
              className="h-auto w-full sm:w-[70%] md:w-[50%] lg:w-[40%] 2xl:w-[25%]"
            />
            <div className="pointer-events-none absolute bottom-0 left-0 z-10 h-15 w-full bg-gradient-to-t from-white via-white/95 to-white/0" />
          </div>
        </div>
        <ProductList
          height={72}
          title="Novos Produtos"
          products={categoriesWithProducts}
        />
      </div>
      <Footer />
    </>
  );
}
