import { db } from "@/db";
import { productTable } from "@/db/schema";
import { desc } from "drizzle-orm";

// interface Product {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   imageUrl: string;
//   category: string;
//   createdAt: Date;
// }

export const getCategoriesWithProducts = async () => {
  const categoriesWithProducts = await db.query.productTable.findMany({
    orderBy: [desc(productTable.createdAt)],
    with: { variants: true },
  });
  return categoriesWithProducts;
};

export const getProductsWithVariants = async () => {
  const products = await db.query.productTable.findMany({
    with: { variants: true },
  });
  return products;
};
