"use client";

import { useState, useEffect } from "react";
import InterviewCard from "@/components/InterviewCard";
import { QuizQuestion } from "@/lib/types";

export function InterviewInterfaceComponent() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  useEffect(() => {
    fetch("/quizData.json")
      .then((response) => response.json())
      .then((data) => setQuestions(data.questions))
      .catch((error) => console.error("Error fetching quiz data:", error));
  }, []);

  return (
    <div className="min-h-screen p-5 flex flex-col">
      <main className="flex-grow flex flex-col justify-center items-center space-y-5">
        <InterviewCard questions={questions} />
      </main>
    </div>
  );
}
