"use client"

import { useState, useEffect } from "react"
import { Timer } from "@/components/Timer"
import { QuestionDisplay } from "@/components/QuestionDisplay"
import { Button } from "@/components/ui/button"
import { useAudioRecorder } from "@/hooks/useAudioRecorder"
import { useAnswers } from "@/contexts/AnswersContext"
import { Mic } from "lucide-react"

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
  const { startRecording, stopRecording, isRecording, audioURL, transcription } = useAudioRecorder()
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
    <div className="min-h-screen bg-gray-100 p-5 flex flex-col">
      <header className="flex justify-between items-center mb-5">
        <div className="text-lg font-semibold" aria-label="Progress">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        {questionState === 'recording' && (
          <Timer 
            initialTime={currentQuestion.timeLimit} 
            timerKey={currentQuestion.id}
          />
        )}
      </header>

      <main className="flex-grow flex flex-col justify-center items-center space-y-5">
        {questionState === 'ready' ? (
          <div className="max-w-2xl w-full space-y-6">
            <h2 className="text-2xl font-semibold text-center">Are you ready?</h2>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="mb-4">Once you click "I'm Ready":</p>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>Recording will start automatically</li>
                <li>Read the question carefully</li>
                <li>Take your time to answer thoroughly</li>
                <li>Click "Submit" when you're done</li>
              </ul>
              <Button 
                onClick={handleReady}
                className="w-full"
                size="lg"
              >
                I'm Ready
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-3xl space-y-6">
            <QuestionDisplay 
              questionNumber={currentQuestionIndex + 1}
              questionTitle={currentQuestion.title}
              questionText={currentQuestion.questionText}
            />
            
            <div className="flex items-center justify-center space-x-2 text-red-500">
              <Mic className="animate-pulse" />
              <span>Recording in progress...</span>
            </div>

            <Button 
              onClick={handleSubmit}
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                'Submit Answer'
              )}
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
