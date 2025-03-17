import { CategoryCard } from "./category-card";

interface CategoryRowProps {
  categories: {
    id: string;
    title: string;
    image: string;
    href: string;
  }[];
  featured?: boolean;
}

export function CategoryRow({ categories, featured }: CategoryRowProps) {
  return (
    <div className="flex items-center justify-center -mx-8">
      {categories.map((category, index) => (
        <CategoryCard
          key={category.id}
          {...category}
          size={featured && index === 1 ? "large" : "medium"}
          position={index === 0 ? "left" : index === 2 ? "right" : "center"}
        />
      ))}
    </div>
  );
}
