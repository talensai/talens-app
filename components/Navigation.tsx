import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  currentQuestion: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  disabled?: boolean;
}

export function Navigation({
  currentQuestion,
  totalQuestions,
  onPrevious,
  onNext,
  disabled = false,
}: NavigationProps) {
  return (
    <footer className="flex justify-between mt-5">
      <Button
        onClick={onPrevious}
        disabled={currentQuestion === 1 || disabled}
        aria-label="Previous question"
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Previous
      </Button>
      <Button
        onClick={onNext}
        disabled={currentQuestion === totalQuestions || disabled}
        aria-label="Next question"
      >
        Next <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </footer>
  );
}
