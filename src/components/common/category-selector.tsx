import { Button } from "@/components/ui/button";
import { categoryTable } from "@/db/schema";
import Link from "next/link";

interface CategorySelectorProps {
  categories: (typeof categoryTable.$inferSelect)[];
}

const CategorySelector = ({ categories }: CategorySelectorProps) => {
  return (
    <div className="rounded-3xl bg-[#F4EFFF] p-4">
      <div className="grid grid-cols-2 gap-3">
        {categories.map((category) => (
          <Link key={category.id} href={`/category/${category.slug}`}>
            <Button
              variant="default"
              className="w-full cursor-pointer rounded-full bg-white text-xs font-semibold text-black/70 hover:bg-pink-200"
            >
              {category.name}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
