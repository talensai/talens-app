import { Card } from "@/components/ui/card"

interface QuestionDisplayProps {
  questionNumber: number
  questionTitle: string
  questionText: string
  instructions: string
}

export function QuestionDisplay({ questionTitle, questionText, instructions }: QuestionDisplayProps) {
  return (
    <div className="w-full">
      <div className="bg-[#f5f5f5] rounded-3xl p-8 space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-[#1c3c1c]">
            {questionTitle}
          </h2>
          <p className="text-lg text-[#1c3c1c] leading-relaxed">
            {questionText}
          </p>
        </div>

        {instructions && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-px w-4 bg-[#1c3c1c]/30" />
              <h3 className="text-[#1c3c1c]/70 text-sm font-medium uppercase tracking-wide">
                Instructions
              </h3>
              <div className="h-px flex-1 bg-[#1c3c1c]/30" />
            </div>
            <p className="text-[#1c3c1c]/80 leading-relaxed pl-1">
              {instructions}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}