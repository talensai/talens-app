"use client"

import { useAnswers } from "@/contexts/AnswersContext"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { QuestionDisplay } from "@/components/QuestionDisplay"
import { useState, useEffect } from "react"
import { useEvaluation } from "@/hooks/useEvaluation"

interface QuizQuestion {
  id: number
  title: string
  questionText: string
  instructions: string
  timeLimit: number
}

interface Answer {
  questionId: number
  audioUrl: string
  transcription: string
}

export default function SummaryPage() {
  const { answers } = useAnswers()
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [evaluations, setEvaluations] = useState<{ [key: number]: any }>({})
  const [loadingStates, setLoadingStates] = useState<{ [key: number]: boolean }>({})
  const { evaluateResponse } = useEvaluation()

  useEffect(() => {
    fetch('/quizData.json')
      .then(response => response.json())
      .then(data => setQuestions(data.questions))
      .catch(error => console.error('Error fetching quiz data:', error))
  }, [])

  const getQuestionById = (id: number) => {
    return questions.find(question => question.id === id)
  }

  const handleEvaluate = async (questionId: number) => {
    const question = getQuestionById(questionId)
    const answer = answers.find(a => a.questionId === questionId)
    
    if (question && answer) {
      // Set loading state for this question
      setLoadingStates(prev => ({ ...prev, [questionId]: true }))
      
      try {
        const result = await evaluateResponse(question.questionText, answer.transcription)
        if (result) {
          // Set evaluation result for this question
          setEvaluations(prev => ({ ...prev, [questionId]: result }))
        } else {
          console.error('No evaluation result returned.')
        }
      } catch (error) {
        console.error('Evaluation error for question', questionId, error)
      } finally {
        // Reset loading state for this question
        setLoadingStates(prev => ({ ...prev, [questionId]: false }))
      }
    }
  }

  console.log('SummaryPage rendered with answers:', answers);
  console.log('SummaryPage loaded questions:', questions);

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <h1 className="text-3xl font-bold mb-5">Interview Summary</h1>
      {answers.length === 0 ? (
        <p>No answers recorded yet.</p>
      ) : (
        answers.map((answer, index) => {
          const question = getQuestionById(answer.questionId)
          
          if (!question) {
            return (
              <div key={`${answer.questionId}-${index}`} className="bg-white p-5 rounded-lg shadow-md mb-5">
                <p>Question not found for ID: {answer.questionId}</p>
                <div className="mt-5">
                  <h3 className="font-semibold mb-2">Your Answer:</h3>
                  <audio src={answer.audioUrl} controls className="mb-3" />
                  <h3 className="font-semibold mb-2">Transcription:</h3>
                  <p>{answer.transcription}</p>
                </div>
              </div>
            )
          }

          const isLoading = loadingStates[answer.questionId] || false
          const evaluation = evaluations[answer.questionId]

          return (
            <div key={`${answer.questionId}-${index}`} className="bg-white p-5 rounded-lg shadow-md mb-5">
              <QuestionDisplay
                questionNumber={question.id}
                questionTitle={question.title}
                questionText={question.questionText}
              />
              <div className="mt-5">
                <h3 className="font-semibold mb-2">Your Answer:</h3>
                <audio src={answer.audioUrl} controls className="mb-3" />
                <h3 className="font-semibold mb-2">Transcription:</h3>
                <p>{answer.transcription}</p>
              </div>
              <Button 
                onClick={() => handleEvaluate(answer.questionId)} 
                disabled={isLoading}
                className="mt-4"
              >
                {isLoading ? 'Evaluating...' : 'Evaluate Answer'}
              </Button>
              {evaluation && (
                <div className="mt-4">
                  <h3 className="font-semibold">Evaluation:</h3>
                  <p><strong>Overall Assessment:</strong> {evaluation.overall_assessment}</p>
                  <p><strong>Score:</strong> {evaluation.score}/10</p>
                  <p><strong>Strengths:</strong> {evaluation.strengths.join(', ')}</p>
                  <p><strong>Areas for Improvement:</strong> {evaluation.areas_for_improvement.join(', ')}</p>
                  <p><strong>Soft Skills Demonstrated:</strong> {evaluation.soft_skills_demonstrated.join(', ')}</p>
                </div>
              )}
            </div>
          )
        })
      )}
      <Link href="/">
        <Button>Back to Home</Button>
      </Link>
    </div>
  )
}
