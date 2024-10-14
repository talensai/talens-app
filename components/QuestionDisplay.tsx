interface QuestionDisplayProps {
    questionNumber: number
    questionTitle: string
    questionText: string
  }
  
  export function QuestionDisplay({ questionNumber, questionTitle, questionText }: QuestionDisplayProps) {
    return (
      <div className="bg-gray-200 p-10 rounded-lg shadow-md w-full max-w-3xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Question {questionNumber}: {questionTitle}</h1>
        <p className="text-xl text-gray-700">{questionText}</p>
      </div>
    )
  }