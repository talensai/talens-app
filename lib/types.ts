export type StartingStep = "auth" | "instructions";
export type QuestionState = "ready" | "recording" | "submitting";

export interface QuizQuestion {
  id: number;
  title: string;
  questionText: string;
  instructions: string[];
  timeLimit: number;
}
