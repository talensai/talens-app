import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface QuestionReadyProps {
  onReady: () => void
  questionTitle: string
  questionInstructions: string
}

export function QuestionReady({ onReady, questionTitle, questionInstructions }: QuestionReadyProps) {
  return (
    <div className="flex flex-col items-center space-y-6 max-w-2xl mx-auto">
      <Card className="w-full p-6">
        <h2 className="text-2xl font-semibold mb-4">{questionTitle}</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Instructions:</h3>
            <p className="text-muted-foreground">{questionInstructions}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-md">
            <p className="text-sm text-yellow-800">
              Note: Once you click "I'm Ready", you'll need to complete this question before moving on.
            </p>
          </div>
        </div>
        <Button 
          onClick={onReady} 
          className="mt-6 w-full"
          size="lg"
        >
          I'm Ready
        </Button>
      </Card>
    </div>
  )
}
