"use client";
import { InterviewInterfaceComponent } from "@/components/interview/InterviewInterface";
import { useAnswers } from "@/contexts/AnswersContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function InterviewPage() {
  const { interviewId } = useAnswers();
  const router = useRouter();

  useEffect(() => {
    if (!interviewId) {
      router.push("/");
    }
  }, [interviewId, router]);

  if (!interviewId) {
    return null;
  }
  return <InterviewInterfaceComponent />;
}
