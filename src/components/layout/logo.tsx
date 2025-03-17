import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link to="/" className={className}>
      <h1 className="text-2xl font-bold">
        <span className="text-foreground">Otaku</span>
        <span className="text-primary">Mirror</span>
      </h1>
    </Link>
  );
}
