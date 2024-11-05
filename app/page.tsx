import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Camera, MessageSquare, CheckCircle, AlertTriangle } from 'lucide-react'

export default function StartingScreen() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-5 overflow-y-auto">
      <h1 className="text-6xl font-serif text-[#1c3c1c] mb-8">Talens</h1>
      <div className="max-w-2xl w-full space-y-8">
        <p className="text-xl text-[#1c3c1c] mb-8">
          Welcome to your softskills interview. Please review the following instructions before beginning.
        </p>
        <Card className="bg-[#f5f5f5] p-6 border-none shadow-none">
          <h2 className="text-2xl font-semibold text-[#1c3c1c] mb-4">Interview Instructions</h2>
          <ul className="space-y-4 text-[#1c3c1c]">
            <li className="flex items-center">
              <MessageSquare className="mr-3 text-[#1c3c1c] flex-shrink-0" size={24} />
              <span className="text-lg">Read questions aloud before answering</span>
            </li>
            <li className="flex items-center">
              <CheckCircle className="mr-3 text-[#1c3c1c] flex-shrink-0" size={24} />
              <span className="text-lg">Speak your thoughts aloud</span>
            </li>
            <li className="flex items-center">
              <AlertTriangle className="mr-3 text-[#1c3c1c] flex-shrink-0" size={24} />
              <span className="text-lg">No external help or AI tools allowed</span>
            </li>
          </ul>
        </Card>

        <p className="text-lg text-[#1c3c1c] italic">
          We're interested in your authentic responses. Unauthorized assistance will result in disqualification.
        </p>

        <div className="flex justify-center mt-8 space-x-4">
          <Link href="/interview">
            <Button className="bg-[#9de76ed9] hover:bg-[#8fd362] text-[#1c3c1c] font-semibold py-2 px-6 rounded-full text-lg transition duration-300 ease-in-out">
              Start Interview
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
