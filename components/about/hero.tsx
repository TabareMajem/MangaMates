import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AboutHero() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center space-y-6 text-center">
        <h1 className="font-noto-sans text-4xl font-bold sm:text-5xl">About Yokaizen</h1>
        <p className="max-w-[42rem] text-lg text-muted-foreground">
          Yokaizen combines traditional journaling practices with modern AI technology to create a 
          unique space for self-reflection and personal growth.
        </p>
        <Link href="/journal">
          <Button size="lg" className="font-medium">
            Begin Your Journey
          </Button>
        </Link>
      </div>
    </section>
  );
}
