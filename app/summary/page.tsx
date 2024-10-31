"use client"

import { useAnswers } from "@/contexts/AnswersContext"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { useEvaluation } from "@/hooks/useEvaluation"
import TestConnection from '@/app/test-connection'

interface RubricPoint {
  score: number;
  description: string;
}

interface RubricCriterion {
  name: string;
  points: RubricPoint[];
}

interface QuizQuestion {
  id: number
  title: string
  questionText: string
  instructions: string
  timeLimit: number
  rubric: {
    criteria: RubricCriterion[];
  };
}

interface Answer {
  questionId: number
  audioUrl: string
  transcription: string
}

interface EvaluationResult {
  overall_assessment: string
  score: number
  strengths: string[]
  areas_for_improvement: string[]
  soft_skills_demonstrated: string[]
  criteria_scores: {
    criterion_name: string
    score: number
    justification: string
  }[]
  key_observations: string[]
  improvement_suggestions: string[]
  total_score: number
}

export default function SummaryPage() {
  const { answers } = useAnswers()
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [evaluations, setEvaluations] = useState<{ [key: number]: EvaluationResult }>({})
  const [loadingStates, setLoadingStates] = useState<{ [key: number]: boolean }>({})
  const { evaluateResponse } = useEvaluation()

  useEffect(() => {
    fetch('/quizData.json')
      .then(response => response.json())
      .then(data => {
        // Sort questions by ID to ensure consistent order
        const sortedQuestions = [...data.questions].sort((a, b) => a.id - b.id)
        setQuestions(sortedQuestions)
      })
      .catch(error => console.error('Error fetching quiz data:', error))
  }, [])

  const getQuestionById = (id: number) => {
    return questions.find(question => question.id === id)
  }

  const handleEvaluate = async (questionId: number) => {
    const question = getQuestionById(questionId)
    const answer = answers.find(a => a.questionId === questionId)
    
    if (question && answer) {
      setLoadingStates(prev => ({ ...prev, [questionId]: true }))
      
      try {
        const result = await evaluateResponse(question, answer.transcription)
        if (result) {
          setEvaluations(prev => ({ ...prev, [questionId]: result }))
        }
      } catch (error) {
        console.error('Evaluation error for question', questionId, error)
      } finally {
        setLoadingStates(prev => ({ ...prev, [questionId]: false }))
      }
    }
  }

  // Sort answers to match question order
  const sortedAnswers = [...answers].sort((a, b) => a.questionId - b.questionId)

  const handleSaveToDatabase = async () => {
    try {
      const response = await fetch('/api/database/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: answers.map(answer => ({
            question_id: answer.questionId,
            audio_url: answer.audioUrl,
            transcription: answer.transcription,
            evaluation: evaluations[answer.questionId] || null
          }))
        })
      })

      if (!response.ok) throw new Error('Failed to save')
      
      alert('Interview data saved successfully!')
    } catch (error) {
      console.error('Error saving to database:', error)
      alert('Failed to save interview data')
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold mb-8">Interview Summary</h1>
        
        {questions.map((question, index) => {
          const answer = sortedAnswers.find(a => a.questionId === question.id)
          const evaluation = evaluations[question.id]
          const isLoading = loadingStates[question.id]

          return (
            <Card key={question.id} className="bg-card">
              <CardHeader>
                <CardTitle>Question {index + 1}: {question.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Question Display */}
                <div className="bg-muted/50 p-4 rounded-md">
                  <h3 className="font-semibold mb-2">Question:</h3>
                  <p className="text-muted-foreground">{question.questionText}</p>
                  {question.instructions && (
                    <div className="mt-2">
                      <h4 className="font-medium">Instructions:</h4>
                      <p className="text-muted-foreground">{question.instructions}</p>
                    </div>
                  )}
                </div>

                {/* Audio Recording */}
                {answer?.audioUrl && (
                  <div className="bg-muted p-4 rounded-md">
                    <h3 className="font-semibold mb-2">Your Recording:</h3>
                    <audio controls className="w-full">
                      <source src={answer.audioUrl} type="audio/webm" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}

                {/* Response Transcription */}
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-semibold mb-2">Your Response:</h3>
                  <p className="text-muted-foreground">
                    {answer?.transcription || 'No response recorded'}
                  </p>
                </div>

                {!evaluation && !isLoading && (
                  <Button onClick={() => handleEvaluate(question.id)}>
                    Evaluate Response
                  </Button>
                )}

                {isLoading && (
                  <div className="text-center p-4">
                    <p>Evaluating response...</p>
                  </div>
                )}

                {evaluation && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2">Overall Assessment</h3>
                      <p className="text-muted-foreground">{evaluation.overall_assessment}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Criteria Scores</h3>
                      <div className="space-y-4">
                        {evaluation.criteria_scores.map((criterion, index) => (
                          <div key={index} className="bg-muted p-4 rounded-md">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium">{criterion.criterion_name}</h4>
                              <span className="bg-primary text-primary-foreground px-2 py-1 rounded">
                                Score: {criterion.score}/5
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {criterion.justification}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Key Observations</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {evaluation.key_observations.map((observation, index) => (
                          <li key={index} className="text-muted-foreground">
                            {observation}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Suggestions for Improvement</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {evaluation.improvement_suggestions.map((suggestion, index) => (
                          <li key={index} className="text-muted-foreground">
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-primary/10 p-4 rounded-md">
                      <h3 className="font-semibold mb-2">Total Score</h3>
                      <p className="text-2xl font-bold">
                        {evaluation.total_score.toFixed(1)}/5.0
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}

        <div className="flex justify-center gap-4 mt-8">
          <Link href="/">
            <Button variant="outline" size="lg">
              Return to Home
            </Button>
          </Link>
          <Button 
            size="lg" 
            onClick={handleSaveToDatabase}
            className="bg-green-600 hover:bg-green-700"
          >
            Save to Database
          </Button>
          {/* <TestConnection /> */}
        </div>
      </div>
    </div>
  )
}
