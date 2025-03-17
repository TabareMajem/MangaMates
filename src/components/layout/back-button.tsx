import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

export function BackButton() {
  return (
    <Link to="/">
      <Button variant="ghost" size="sm" className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
    </Link>
  );
}
