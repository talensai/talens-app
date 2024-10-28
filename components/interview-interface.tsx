"use client"

import { useState, useEffect } from "react"
import { Timer } from "@/components/Timer"
import { QuestionDisplay } from "@/components/QuestionDisplay"
import { Navigation } from "@/components/Navigation"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { AudioRecorder } from "@/components/AudioRecorder"

interface QuizQuestion {
  id: number
  title: string
  questionText: string
  instructions: string
  timeLimit: number
}

export function InterviewInterfaceComponent() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  useEffect(() => {
    fetch('/quizData.json')
      .then(response => response.json())
      .then(data => setQuestions(data.questions))
      .catch(error => console.error('Error fetching quiz data:', error))
  }, [])

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  if (questions.length === 0) {
    return <div>Loading...</div>
  }

  const currentQuestion = questions[currentQuestionIndex]

  const isLastQuestion = currentQuestionIndex === questions.length - 1

  return (
    <div className="min-h-screen bg-gray-100 p-5 flex flex-col">
      <header className="flex justify-between items-center mb-5">
        <div className="text-lg font-semibold" aria-label="Progress">
          {currentQuestionIndex + 1} / {questions.length}
        </div>
        <Timer 
          initialTime={currentQuestion.timeLimit} 
          timerKey={currentQuestion.id}
        />
      </header>
      <main className="flex-grow flex flex-col justify-center items-center space-y-5">
        <QuestionDisplay 
          questionNumber={currentQuestionIndex + 1}
          questionTitle={currentQuestion.title}
          questionText={currentQuestion.questionText}
        />
        {currentQuestion.instructions && currentQuestion.instructions.trim() !== '' && (
          <div className="bg-white p-5 rounded-lg shadow-md w-full max-w-3xl">
            <h2 className="text-lg font-semibold mb-2">Instructions:</h2>
            <p className="text-gray-700">{currentQuestion.instructions}</p>
          </div>
        )}
        <AudioRecorder questionId={currentQuestion.id} />
      </main>
      <Navigation 
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        onPrevious={handlePreviousQuestion}
        onNext={handleNextQuestion}
      />
      {isLastQuestion && (
        <div className="mt-5 flex justify-center space-x-4">
          <Link href="/">
            <Button className="text-lg py-2 px-4">Finish Quiz</Button>
          </Link>
          <Link href="/summary">
            <Button className="text-lg py-2 px-4">View Summary</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
