"use client"

import { useAnswers } from "@/contexts/AnswersContext"
import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function SummaryPage() {
  const { answers } = useAnswers()
  console.log('SummaryPage rendered with answers:', answers);

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <h1 className="text-3xl font-bold mb-5">Interview Summary</h1>
      {answers.length === 0 ? (
        <p>No answers recorded yet.</p>
      ) : (
        answers.map((answer, index) => (
          <div key={answer.questionId} className="bg-white p-5 rounded-lg shadow-md mb-5">
            <h2 className="text-xl font-semibold mb-3">Question {answer.questionId}</h2>
            <audio src={answer.audioUrl} controls className="mb-3" />
            <h3 className="font-semibold mb-2">Transcription:</h3>
            <p>{answer.transcription}</p>
          </div>
        ))
      )}
      <Link href="/">
        <Button>Back to Home</Button>
      </Link>
    </div>
  )
}
