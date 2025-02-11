import { Timer } from "@/components/interview/Timer";
import TimerUI from "@/components/interview/TimerUI";
import { QuestionState } from "@/lib/types";
import React from "react";

type QuestionsHeaderProps = {
  questionIndex: number;
  questionsLength: number;
  questionTimeLimit: number;
  questionState: QuestionState;
  questionId: number;
  handleSubmit: () => void;
};

//Todo: can move handleSubmit to context (avoid prop drilling)
function QuestionsHeader({
  questionIndex,
  questionsLength,
  questionTimeLimit,
  questionId,
  handleSubmit,
  questionState,
}: QuestionsHeaderProps) {
  const isRecording = questionState === "recording";

  // Render timer only when recording or ready
  const isTimerActive = isRecording || questionState === "ready";
  return (
    <>
      <div className="flex  w-full justify-between py-5 px-6 ">
        <div className="flex items-center gap-1 w-1/3">
          {isRecording && (
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
          <span className="text-xs font-medium tracking-wide uppercase ">
            {isRecording ? "Recording" : "Question"}
          </span>
        </div>

        <div className="tabular-nums text-sm text-center w-1/3">
          {questionIndex + 1} of {questionsLength}
        </div>
        <div className="flex justify-end w-1/3">
          {isTimerActive ? (
            <Timer
              initialTime={questionTimeLimit}
              timerKey={questionId}
              handleSubmit={handleSubmit}
            />
          ) : (
            <TimerUI time={0} />
          )}
        </div>
      </div>
      {/* Progress bar */}
      <div className="relative  bg-foreground/15 rounded-full h-1 mx-6">
        <div
          className="absolute bg-primary rounded-full h-1"
          style={{
            width: `${((questionIndex + 1) / questionsLength) * 100}%`,
          }}
        ></div>
      </div>
    </>
  );
}

export default QuestionsHeader;
