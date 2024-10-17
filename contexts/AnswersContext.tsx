"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Answer {
  questionId: number;
  audioUrl: string;
  transcription: string;
}

interface AnswersContextType {
  answers: Answer[];
  addAnswer: (answer: Answer) => void;
}

const AnswersContext = createContext<AnswersContextType | undefined>(undefined);

export function AnswersProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<Answer[]>([]);

  useEffect(() => {
    const storedAnswers = sessionStorage.getItem('interviewAnswers');
    if (storedAnswers) {
      const parsedAnswers = JSON.parse(storedAnswers);
      setAnswers(parsedAnswers);
      console.log('Loaded answers from sessionStorage:', parsedAnswers);
    } else {
      console.log('No answers found in sessionStorage');
    }
  }, []);

  const addAnswer = (answer: Answer) => {
    console.log('Adding answer to context:', answer);
    setAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers, answer];
      console.log('Updated answers in context:', newAnswers);
      sessionStorage.setItem('interviewAnswers', JSON.stringify(newAnswers));
      return newAnswers;
    });
  };

  console.log('Current answers in context:', answers);

  return (
    <AnswersContext.Provider value={{ answers, addAnswer }}>
      {children}
    </AnswersContext.Provider>
  );
}

export function useAnswers() {
  const context = useContext(AnswersContext);
  if (context === undefined) {
    throw new Error('useAnswers must be used within an AnswersProvider');
  }
  return context;
}
