"use client"

import { useAnswers } from "@/contexts/AnswersContext"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react"

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

export default function SummaryPage() {
  const { answers, clearAnswers } = useAnswers()
  const [questions, setQuestions] = useState<QuizQuestion[]>([])

  useEffect(() => {
    fetch('/quizData.json')
      .then(response => response.json())
      .then(data => {
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
              evaluation: null
            }
          })
        })
      });

      if (!response.ok) throw new Error('Failed to save');
      
      clearAnswers();
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
