import { useState } from 'react';

interface CriteriaScore {
  criterion_name: string;
  score: number;
  justification: string;
}

interface EvaluationResult {
  overall_assessment: string;
  criteria_scores: CriteriaScore[];
  key_observations: string[];
  improvement_suggestions: string[];
  total_score: number;
}

export function useEvaluation() {
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const evaluateResponse = async (question: QuizQuestion, response: string) => {
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
      return data.evaluation;
    } catch (error) {
      console.error('Error:', error);
      setEvaluation(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { evaluation, isLoading, evaluateResponse };
}
