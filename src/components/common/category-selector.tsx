import { Button } from "@/components/ui/button";
import { categoryTable } from "@/db/schema";
import Link from "next/link";

interface CategorySelectorProps {
  categories: (typeof categoryTable.$inferSelect)[];
}

const CategorySelector = ({ categories }: CategorySelectorProps) => {
  return (
    <div className="rounded-2xl bg-[#F4EFFF] p-3 sm:p-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
        {categories.map((category) => (
          <Link key={category.id} href={`/category/${category.slug}`}>
            <Button
              variant="default"
              className="hover:bg-primary/25 w-full cursor-pointer rounded-lg bg-white py-2 text-[0.65rem] font-medium text-black/70 transition duration-200 sm:py-3 sm:text-xs"
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
