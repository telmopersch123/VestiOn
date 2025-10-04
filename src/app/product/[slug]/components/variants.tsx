import { productVariantTable } from "@/db/schema";
import Image from "next/image";
import Link from "next/link";

interface VariantsProps {
  selectedVariantSlug?: string;
  variants: (typeof productVariantTable.$inferSelect)[];
}

const VariantsContainer = ({
  variants,
  selectedVariantSlug,
}: VariantsProps) => {
  return (
    <div className="flex items-center gap-4">
      {variants.map((variant) => {
        return (
          <Link
            href={`/product/${variant.slug}`}
            key={variant.id}
            className={`${variant.slug === selectedVariantSlug ? "border-primary/60 rounded-xl border-2 border-solid" : ""}`}
          >
            <Image
              src={variant.imageUrl}
              alt={variant.name}
              width={68}
              height={68}
              className="rounded-xl"
            />
          </Link>
        );
      })}
    </div>
  );
};

export default VariantsContainer;
