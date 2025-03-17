"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface QuizNavigationProps {
  onPrevious?: () => void;
  onNext?: () => void;
  canGoNext: boolean;
  isLastQuestion?: boolean;
}

export function QuizNavigation({ 
  onPrevious, 
  onNext, 
  canGoNext,
  isLastQuestion 
}: QuizNavigationProps) {
  return (
    <div className="flex justify-between mt-8">
      {onPrevious ? (
        <Button
          variant="outline"
          onClick={onPrevious}
          className="text-white border-white/20 hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
      ) : (
        <div></div>
      )}

      {onNext && (
        <Button
          onClick={onNext}
          disabled={!canGoNext}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isLastQuestion ? "Complete" : "Next"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      )}
    </div>
  );
}
