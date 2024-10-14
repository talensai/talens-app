import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Camera, MessageSquare, CheckCircle, AlertTriangle } from 'lucide-react'

export default function StartingScreen() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-5 overflow-y-auto">
      <h1 className="text-6xl font-serif text-[#1c3c1c] mb-12">Talens</h1>
      <div className="max-w-2xl w-full space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-[#1c3c1c] mb-4">Welcome to our Softskills Interview</h2>
          <p className="text-lg text-[#1c3c1c] mb-4">
            We're going to ask you a series of questions designed to assess your soft skills. 
            These questions will help us understand your problem-solving abilities, communication skills, and thought processes.
          </p>
        </section>

        <Card className="bg-[#f5f5f5] p-6 border-none">
          <h2 className="text-2xl font-semibold text-[#1c3c1c] mb-4">Important Instructions</h2>
          <ul className="space-y-4 text-[#1c3c1c]">
            <li className="flex items-center">
              <Camera className="mr-3 text-[#1c3c1c] flex-shrink-0" size={24} />
              <span className="text-lg">Enable your camera before starting the interview.</span>
            </li>
            <li className="flex items-center">
              <MessageSquare className="mr-3 text-[#1c3c1c] flex-shrink-0" size={24} />
              <span className="text-lg">Read all questions out loud before answering.</span>
            </li>
            <li className="flex items-center">
              <CheckCircle className="mr-3 text-[#1c3c1c] flex-shrink-0" size={24} />
              <span className="text-lg">Speak your thoughts aloud as you formulate your answers.</span>
            </li>
            <li className="flex items-center">
              <AlertTriangle className="mr-3 text-[#1c3c1c] flex-shrink-0" size={24} />
              <span className="text-lg">Do not use ChatGPT, AI tools, or any external help during the interview.</span>
            </li>
          </ul>
        </Card>

        <section>
          <h2 className="text-2xl font-semibold text-[#1c3c1c] mb-4">Our Process</h2>
          <p className="text-lg text-[#1c3c1c] mb-4">
            We're interested in your authentic responses and thought processes. This interview is designed to give us insight into your unique skills and perspectives.
          </p>
          <p className="text-lg text-[#1c3c1c] italic">
            Remember, using unauthorized assistance will result in disqualification.
          </p>
        </section>

        <div className="flex justify-center mt-8">
          <Link href="/quiz">
            <Button className="bg-[#9de76ed9] hover:bg-[#8fd362] text-[#1c3c1c] font-semibold py-2 px-6 rounded-full text-lg transition duration-300 ease-in-out">
              Start Interview
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}