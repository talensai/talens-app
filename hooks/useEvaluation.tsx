import { useState } from 'react';

interface EvaluationResult {
  overall_assessment: string;
  score: number;
  strengths: string[];
  areas_for_improvement: string[];
  soft_skills_demonstrated: string[];
}

export function useEvaluation() {
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const evaluateResponse = async (question: string, response: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question, response }),
      });
      const data = await res.json();
      setEvaluation(data.evaluation);
      return data.evaluation; // Return the evaluation result
    } catch (error) {
      console.error('Error:', error);
      setEvaluation(null);
      return null; // Return null in case of error
    } finally {
      setIsLoading(false);
    }
  };

  return { evaluation, isLoading, evaluateResponse };
}
