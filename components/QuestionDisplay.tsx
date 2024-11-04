interface QuestionDisplayProps {
    questionNumber: number
    questionTitle: string
    questionText: string
    instructions: string
  }
  
  export function QuestionDisplay({ questionTitle, questionText, instructions }: QuestionDisplayProps) {
    return (
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-2xl font-semibold">
          {questionTitle}
        </h2>
        <p className="text-gray-700">
          {questionText}
        </p>
        {instructions && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <p className="font-medium text-gray-900 mb-2">Instructions:</p>
            <p className="text-gray-700">{instructions}</p>
          </div>
        )}
      </div>
    )
  }