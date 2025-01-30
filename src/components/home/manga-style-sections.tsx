"use client";

import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { animated, useSpring } from "@react-spring/web";
import { useAuth } from "@/lib/auth/context";
import { sections } from "@/config/navigation";

export function MangaStyleSections() {
  const { user } = useAuth();

  const [props] = useSpring(() => ({
    from: { y: 0, opacity: 1 },
    config: { tension: 300, friction: 20 }
  }));

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Manga-style background patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16 gradient-text">
          Your Manga Adventure Awaits
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sections.map((section) => (
            <Link key={section.id} to={section.href}>
              <animated.div
                style={{
                  ...props,
                  transform: props.y.to(y => `translateY(${y}px)`)
                }}
                onMouseEnter={() => props.y.start(-8)}
                onMouseLeave={() => props.y.start(0)}
              >
                <Card className="group relative overflow-hidden bg-black/20 backdrop-blur-sm border-none">
                  <div className="aspect-[3/4] relative">
                    <img 
                      src={section.image} 
                      alt={section.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {section.premium && !user?.isPremium && (
                      <div className="absolute top-4 right-4 px-3 py-1 bg-primary/90 rounded-full text-xs font-medium">
                        Premium
                      </div>
                    )}
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {section.title}
                      </h3>
                      <p className="text-white/80 text-sm">
                        {section.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </animated.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
