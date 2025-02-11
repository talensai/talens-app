import TimerUI from "@/components/interview/TimerUI";
import { useState, useEffect, useRef } from "react";

interface TimerProps {
  initialTime: number;
  timerKey: number;
  handleSubmit: () => void;
}

export function Timer({ initialTime, timerKey, handleSubmit }: TimerProps) {
  const [time, setTime] = useState(initialTime);
  const handleSubmitRef = useRef(handleSubmit);

  useEffect(() => {
    handleSubmitRef.current = handleSubmit;
  }, [handleSubmit]);

  // Will run only once when the timer reaches 0
  useEffect(() => {
    if (time === 0) {
      handleSubmitRef.current();
    }
  }, [time]);

  // Will run once when the question changes
  useEffect(() => {
    setTime(initialTime); // Reset the timer when initialTime changes
    const interval = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          clearInterval(interval);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [initialTime, timerKey]); // Add timerKey to dependencies

  return <TimerUI time={time} />;
}
