import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface TimerProps {
  initialTime: number
  key: number // Add this line
}

export function Timer({ initialTime, key }: TimerProps) {
  const [time, setTime] = useState(initialTime)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    setTime(initialTime) // Reset the timer when initialTime changes
    setIsRunning(false)
  }, [initialTime])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1)
      }, 1000)
    } else if (time === 0) {
      setIsRunning(false)
    }
    return () => clearInterval(interval)
  }, [isRunning, time])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleStartStop = () => {
    setIsRunning(!isRunning)
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="font-mono text-xl" aria-live="polite" aria-label="Timer">
        {formatTime(time)}
      </div>
      <Button
        onClick={handleStartStop}
        aria-label={isRunning ? "Stop timer" : "Start timer"}
        className={isRunning ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
      >
        {isRunning ? "Stop" : "Start"}
      </Button>
    </div>
  )
}