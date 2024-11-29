import { useState, useEffect } from "react"

interface TimerProps {
  initialTime: number
  timerKey?: number // renamed from key to timerKey
}

export function Timer({ initialTime, timerKey }: TimerProps) {
  const [time, setTime] = useState(initialTime)

  useEffect(() => {
    setTime(initialTime) // Reset the timer when initialTime changes
    const interval = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1
        } else {
          clearInterval(interval)
          return 0
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [initialTime, timerKey]) // Add timerKey to dependencies

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex items-center">
      <div className="tabular-nums text-sm" aria-live="polite" aria-label="Timer">
        {formatTime(time)}
      </div>
    </div>
  )
}
