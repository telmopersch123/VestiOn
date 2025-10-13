"use client";
import { productTable, productVariantTable } from "@/db/schema";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import { useRef } from "react";
import ProductItem from "./product-item";

interface ProductListProps {
  height?: number;
  title: string;
  products: (typeof productTable.$inferSelect & {
    variants: (typeof productVariantTable.$inferSelect)[];
  })[];
}

const ProductList = ({ height, title, products }: ProductListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -200 : 200,
      behavior: "smooth",
    });
  };
  return (
    <div className="group relative space-y-6">
      <h3 className="px-5 text-lg font-bold">{title}</h3>

      <button
        hidden={height === 82}
        className="hover:text-primary absolute top-1/2 left-2 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-white/65 p-2 opacity-0 shadow-md transition-all duration-300 group-hover:opacity-100"
        onClick={() => scroll("left")}
      >
        <ArrowBigLeft />
      </button>
      <button
        hidden={height === 82}
        className="hover:text-primary absolute top-1/2 right-2 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-white/65 p-2 opacity-0 shadow-md transition-all duration-300 group-hover:opacity-100"
        onClick={() => scroll("right")}
      >
        <ArrowBigRight />
      </button>

      <div
        ref={scrollRef}
        className="flex h-[height] w-full gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden"
      >
        {" "}
        {products.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
