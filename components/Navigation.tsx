import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavigationProps {
  currentQuestion: number
  totalQuestions: number
  onPrevious: () => void
  onNext: () => void
}

export function Navigation({ currentQuestion, totalQuestions, onPrevious, onNext }: NavigationProps) {
  return (
    <footer className="flex justify-between mt-5">
      <Button onClick={onPrevious} disabled={currentQuestion === 1} aria-label="Previous question">
        <ChevronLeft className="mr-2 h-4 w-4" /> Previous
      </Button>
      <Button onClick={onNext} disabled={currentQuestion === totalQuestions} aria-label="Next question">
        Next <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </footer>
  )
}