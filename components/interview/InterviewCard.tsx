import { useState, useCallback } from "react";
import { QuestionDisplay } from "@/components/interview/QuestionDisplay";
import { Button } from "@/components/ui/button";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { QuestionReady } from "@/components/interview/QuestionReady";
import { Card } from "@/components/ui/card";
import { QuestionState, QuizQuestion } from "@/lib/types";
import QuestionsHeader from "@/components/interview/QuestionHeader";

type InterviewCardProps = {
  questions: QuizQuestion[];
};

export default function InterviewCard({ questions }: InterviewCardProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionState, setQuestionState] = useState<QuestionState>("ready");

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      console.log("Moving to next question");
      setCurrentQuestionIndex((prev) => prev + 1);
      setQuestionState("ready");
    } else {
      console.log("Interview complete, redirecting to summary");
      window.location.href = "/summary";
    }
  }, [currentQuestionIndex, questions.length]);

  const { startRecording, stopRecording, isLoading } = useAudioRecorder(
    questions[currentQuestionIndex]?.id,
    currentQuestionIndex,
    handleNextQuestion
  );

  const handleReady = async () => {
    console.log("Question ready, starting recording");
    await startRecording();
    setQuestionState("recording");
  };

  const handleSubmit = () => {
    console.log("Submitting answer");
    stopRecording();
  };

  if (questions.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center">
        Loading...
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Card className="max-w-xl w-full p-1.5 ">
      <QuestionsHeader
        questionIndex={currentQuestionIndex}
        questionsLength={questions.length}
        questionTimeLimit={currentQuestion.timeLimit}
        questionId={currentQuestion.id}
        isRecording={questionState === "recording"}
      />
      {questionState === "ready" ? (
        <QuestionReady onReady={handleReady} />
      ) : (
        <>
          <QuestionDisplay question={currentQuestion} />

          <Button
            onClick={handleSubmit}
            className="w-full "
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-[#1c3c1c] border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              "Submit Answer"
            )}
          </Button>
        </>
      )}
    </Card>
  );
}
