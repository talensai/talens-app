import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mic, Speech, CheckSquare } from 'lucide-react'

interface QuestionReadyProps {
  onReady: () => void
  questionNumber: number
  totalQuestions: number
}

export function QuestionReady({ onReady, questionNumber, totalQuestions }: QuestionReadyProps) {
  return (
    <div className="max-w-2xl w-full space-y-8">
      <h2 className="text-2xl font-semibold text-[#1c3c1c] text-center mb-6">
        Question {questionNumber} of {totalQuestions}
      </h2>
      
      <div className="bg-[#f5f5f5] rounded-3xl p-8">
        <h3 className="text-xl font-semibold text-[#1c3c1c] mb-4">Before you begin:</h3>
        <ul className="space-y-4 text-[#1c3c1c] mb-6">
          <li className="flex items-center">
            <Mic className="mr-3 text-[#1c3c1c] flex-shrink-0" size={24} />
            <span className="text-lg">Recording will start automatically</span>
          </li>
          <li className="flex items-center">
            <Speech className="mr-3 text-[#1c3c1c] flex-shrink-0" size={24} />
            <span className="text-lg">Read the question out loud</span>
          </li>
          <li className="flex items-center">
            <CheckSquare className="mr-3 text-[#1c3c1c] flex-shrink-0" size={24} />
            <span className="text-lg">Click "Submit" when you're done</span>
          </li>
        </ul>
        
        <Button 
          onClick={onReady}
          className="w-full bg-[#9de76ed9] hover:bg-[#8fd362] text-[#1c3c1c] font-semibold rounded-2xl transition-colors"
          size="lg"
        >
          I'm Ready
        </Button>
      </div>
    </div>
  )
}
