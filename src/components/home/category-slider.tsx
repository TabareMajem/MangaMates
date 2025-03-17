import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

interface CategorySliderProps {
  title: string;
  items: {
    id: string;
    title: string;
    description?: string;
    image: string;
    href: string;
  }[];
}

export function CategorySlider({ title, items }: CategorySliderProps) {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <Link 
            key={item.id}
            to={item.href}
            className="group block"
          >
            <Card className="overflow-hidden bg-white/20 backdrop-blur-sm border-none transition-all duration-300 hover:scale-105">
              <div className="aspect-video relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <ArrowUpRight className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                {item.description && (
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                )}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
