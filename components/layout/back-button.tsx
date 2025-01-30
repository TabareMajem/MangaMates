import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function BackButton() {
  return (
    <Link href="/">
      <Button variant="ghost" size="sm" className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
    </Link>
  );
}
