import { Link } from "react-router-dom";
import { ArrowUpRight, Crown } from "lucide-react";
import { motion } from "framer-motion";

interface CategoryCardProps {
  title: string;
  image: string;
  href: string;
  premium?: boolean;
}

export function CategoryCard({ title, image, href, premium }: CategoryCardProps) {
  return (
    <Link to={href} className="block w-72 group">
      <motion.div 
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative overflow-hidden rounded-3xl bg-black/20 backdrop-blur-sm"
      >
        <div className="aspect-square relative">
          <img
            src={image}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {premium && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-4 right-4 px-3 py-1 bg-primary/90 rounded-full flex items-center gap-2"
            >
              <Crown className="w-4 h-4" />
              <span className="text-xs font-medium">Premium</span>
            </motion.div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
            >
              <h3 className="text-xl font-bold text-white">{title}</h3>
              <ArrowUpRight className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
