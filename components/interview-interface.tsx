"use client"

import { useState, useEffect } from "react"
import { Timer } from "@/components/Timer"
import { QuestionDisplay } from "@/components/QuestionDisplay"
import { Button } from "@/components/ui/button"
import { useAudioRecorder } from "@/hooks/useAudioRecorder"
import { useAnswers } from "@/contexts/AnswersContext"
import { QuestionReady } from "@/components/QuestionReady"

interface QuizQuestion {
  id: number
  title: string
  questionText: string
  instructions: string
  timeLimit: number
}

type QuestionState = 'ready' | 'recording'

export function InterviewInterfaceComponent() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [questionState, setQuestionState] = useState<QuestionState>('ready')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { startRecording, stopRecording, audioURL, transcription } = useAudioRecorder()
  const { addAnswer } = useAnswers()

  useEffect(() => {
    fetch('/quizData.json')
      .then(response => response.json())
      .then(data => setQuestions(data.questions))
      .catch(error => console.error('Error fetching quiz data:', error))
  }, [])

  // New useEffect to handle submission
  useEffect(() => {
    if (isSubmitting && audioURL && transcription) {
      // Save the answer
      addAnswer({
        questionId: questions[currentQuestionIndex].id,
        audioUrl: audioURL,
        transcription: transcription
      })

      // Move to next question or summary
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
        setQuestionState('ready')
      } else {
        window.location.href = '/summary'
      }
      
      setIsSubmitting(false)
      setIsLoading(false)
    }
  }, [isSubmitting, audioURL, transcription, currentQuestionIndex, questions, addAnswer])

  const handleReady = async () => {
    await startRecording()
    setQuestionState('recording')
  }

  const handleSubmit = () => {
    setIsLoading(true)
    setIsSubmitting(true)
    stopRecording()
  }

  if (questions.length === 0) return <div>Loading...</div>

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className="min-h-screen bg-white p-5 flex flex-col">
      <header className="flex justify-between items-center mb-5">
        <div className="text-lg font-medium text-[#1c3c1c]" aria-label="Progress">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        <Timer 
          initialTime={currentQuestion.timeLimit} 
          timerKey={currentQuestion.id}
        />
      </header>

      <main className="flex-grow flex flex-col justify-center items-center space-y-5">
        {questionState === 'ready' ? (
          <QuestionReady 
            onReady={handleReady}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
          />
        ) : (
          <div className="w-full max-w-3xl">
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-3 py-2 px-4">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-sm font-medium tracking-wide uppercase text-[#1c3c1c]">
                  Recording in Progress
                </span>
              </div>
            </div>

            <div className="space-y-8">
              <QuestionDisplay 
                questionNumber={currentQuestionIndex + 1}
                questionTitle={currentQuestion.title}
                questionText={currentQuestion.questionText}
                instructions={currentQuestion.instructions}
              />

              <Button 
                onClick={handleSubmit}
                className="w-full bg-[#9de76ed9] hover:bg-[#8fd362] text-[#1c3c1c] font-semibold rounded-2xl transition-colors"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#1c3c1c] border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  'Submit Answer'
                )}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
