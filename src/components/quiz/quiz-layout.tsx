import { BackButton } from "./back-button";

interface QuizLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function QuizLayout({ children, title }: QuizLayoutProps) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1a0f1f] to-[#150c2e] text-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <BackButton />
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            {title}
          </h1>
        </div>
        {children}
      </div>
    </main>
  );
}
