// pages/api/categories/route.ts
import { getCategories } from "@/data/categories/get";

export async function GET() {
  const categories = await getCategories();
  return Response.json(categories);
}
