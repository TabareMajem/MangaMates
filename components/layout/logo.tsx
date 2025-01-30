import { Sparkles } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <Sparkles className="h-12 w-12 text-primary" />
      <h1 className="text-4xl font-bold gradient-text">Yokaizen 思記</h1>
    </div>
  );
}
