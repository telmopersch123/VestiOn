import { Button } from "@/components/ui/button";
import { categoryTable } from "@/db/schema";

interface CategorySelectorProps {
  categories: (typeof categoryTable.$inferSelect)[];
}

const CategorySelector = ({ categories }: CategorySelectorProps) => {
  return (
    <div className="rounded-3xl bg-[#F4EFFF] p-4">
      <div className="grid grid-cols-2 gap-3">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant="default"
            className="w-full rounded-full bg-white text-xs font-semibold"
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
