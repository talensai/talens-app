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

  const handleSaveToDatabase = async () => {
    try {
      const response = await fetch('/api/database/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: answers.map(answer => {
            const question = getQuestionById(answer.questionId);
            return {
              question: {
                id: question?.id,
                title: question?.title,
                questionText: question?.questionText,
                instructions: question?.instructions,
                timeLimit: question?.timeLimit,
                rubric: question?.rubric
              },
              transcription: answer.transcription,
              evaluation: evaluations[answer.questionId] || null
            }
          })
        })
      });

      if (!response.ok) throw new Error('Failed to save');
      
      alert('Interview data saved successfully!');
    } catch (error) {
      console.error('Error saving to database:', error);
      alert('Failed to save interview data');
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8 text-center">
        <h1 className="text-3xl font-bold mb-8">Congratulations!</h1>
        
        <Card className="bg-card p-8">
          <CardContent className="space-y-6">
            <h2 className="text-2xl font-semibold">Thank you for completing the interview!</h2>
            <p className="text-muted-foreground text-lg">
              Your responses have been recorded successfully. Click below to save your interview data 
              or return to the home page.
            </p>
          </CardContent>
        </Card>

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
        </div>
      </div>
    </div>
  )
}
