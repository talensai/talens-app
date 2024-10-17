"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"

export default function OpenAITest() {
  const [petInfo, setPetInfo] = useState('')
  const [petName, setPetName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pet_info: petInfo }),
      })
      const data = await res.json()
      setPetName(data.response.pet_name)
    } catch (error) {
      console.error('Error:', error)
      setPetName('An error occurred while processing your request.')
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <h1 className="text-3xl font-bold mb-5">Pet Name Generator</h1>
      <form onSubmit={handleSubmit} className="mb-5">
        <textarea
          value={petInfo}
          onChange={(e) => setPetInfo(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-3"
          rows={4}
          placeholder="Enter pet information (e.g., type, color, personality)"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Pet Name'}
        </Button>
      </form>
      {petName && (
        <div className="bg-white p-5 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Generated Pet Name:</h2>
          <p className="text-2xl font-bold text-blue-600">{petName}</p>
        </div>
      )}
    </div>
  )
}
