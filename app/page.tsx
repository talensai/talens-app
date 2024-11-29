"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAnswers } from "@/contexts/AnswersContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

// This would normally come from an environment variable or backend
const VALID_ACCESS_CODE = "TALENS2024"

export default function StartingScreen() {
  const [step, setStep] = useState<'auth' | 'instructions'>('auth')
  const [name, setName] = useState('')
  const [accessCode, setAccessCode] = useState('')
  const [error, setError] = useState('')
  const { initializeInterview, setUserName } = useAnswers()
  const router = useRouter()

  const handleSubmitAuth = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Please enter your name')
      return
    }

    if (accessCode !== VALID_ACCESS_CODE) {
      setError('Invalid access code')
      return
    }

    setUserName(name)
    setStep('instructions')
  }

  const handleStartInterview = () => {
    initializeInterview()
    router.push('/interview')
  }

  if (step === 'auth') {
    return (
      <div className="flex flex-col items-center p-5">
        
        
        <Card className="max-w-xl w-full p-1.5 space-y-10">
          <div className="flex flex-col  mx-6 mt-5">
          <h2 className="text-xl md:text-2xl tracking-tight font-semibold leading-tight ">
            Welcome to Your Interview
          </h2>
          <p className="text-xl md:text-2xl tracking-tight opacity-50 leading-tight">
            To get started, please enter your name <br className='hidden md:block'/> and access code to continue
          </p>
          </div>
          
          <form onSubmit={handleSubmitAuth} className="space-y-4">
            <div className="px-6 pb-10 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#1c3c1c] mb-1">
                Your Name
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="accessCode" className="block text-sm font-medium text-[#1c3c1c] mb-1">
                Access Code
              </label>
              <Input
                id="accessCode"
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                placeholder="Enter access code"
                className="w-full"
              />
            </div>


            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
            </div>

            <Button 
              type="submit"
              className="w-full"
              size="lg"
            >
              Continue
            </Button>
          </form>
        </Card>
      </div>
    )
  }

  return (
    <div className=" flex flex-col items-center p-5">
     
      
      <Card className="max-w-2xl w-full space-y-8 p-6">
        <div>
          <h2 className="text-2xl font-semibold text-[#1c3c1c] mb-4">
            Welcome, {name}!
          </h2>
          <p className="text-[#1c3c1c] mb-6">
            Please review the following instructions before beginning your interview.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-[#1c3c1c]">Interview Instructions</h3>
          <ul className="space-y-3 text-[#1c3c1c]">
            <li>• Read questions aloud before answering</li>
            <li>• Speak your thoughts aloud</li>
            <li>• No external help or AI tools allowed</li>
          </ul>
        </div>

        <Button 
          onClick={handleStartInterview}
          className="w-full bg-[#9de76ed9] hover:bg-[#8fd362] text-[#1c3c1c]"
        >
          Start Interview
        </Button>
      </Card>
    </div>
  )
}
