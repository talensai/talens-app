const systemPrompt = `
## Role
You are an AI interviewer that asks questions to evaluate a user's softskills.

## Instructions
You will receive the question details including rubric criteria and a user's answer. Evaluate the response based on the provided rubric criteria.
`;

const userPrompt = (inputs: { question: QuizQuestion; response: string }) => `
## Interview Question
Title: ${inputs.question.title}
Question: ${inputs.question.questionText}
Instructions: ${inputs.question.instructions}

## Rubric Criteria
${inputs.question.rubric.criteria.map(criterion => `
${criterion.name}:
${criterion.points.map(point => `- Score ${point.score}: ${point.description}`).join('\n')}
`).join('\n')}

User's response: "${inputs.response}"

Provide a detailed evaluation of the soft skills demonstrated in this response, including strengths and areas for improvement. Consider the rubric criteria provided above.`;

const promptData = (inputs: { question: QuizQuestion; response: string }) => ({
  systemPrompt,
  model: "gpt-4o-2024-08-06",
  userPrompt: userPrompt(inputs),
  temperature: 0.7,
  max_tokens: 500,
  responseSchema: {
    "name": "soft_skills_evaluation",
    "strict": true,
    "schema": {
      "type": "object",
      "properties": {
        "overall_assessment": {
          "type": "string",
          "description": "A comprehensive evaluation of the response, highlighting key observations"
        },
        "criteria_scores": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "criterion_name": { "type": "string" },
              "score": { 
                "type": "integer"
              },
              "justification": { 
                "type": "string",
                "description": "Explanation of why this score was given based on the rubric criteria"
              }
            },
            "required": ["criterion_name", "score", "justification"],
            "additionalProperties": false
          }
        },
        "key_observations": {
          "type": "array",
          "items": { 
            "type": "string" 
          },
          "description": "Notable aspects of the response that influenced the scoring"
        },
        "improvement_suggestions": {
          "type": "array",
          "items": { 
            "type": "string" 
          },
          "description": "Specific recommendations for improvement based on the rubric criteria"
        },
        "total_score": {
          "type": "number",
          "description": "Average score across all criteria, rounded to one decimal place"
        }
      },
      "required": [
        "overall_assessment",
        "criteria_scores",
        "key_observations",
        "improvement_suggestions",
        "total_score"
      ],
      "additionalProperties": false
    }
  }
});

export default promptData;
