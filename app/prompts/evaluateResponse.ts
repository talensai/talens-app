const systemPrompt = "You are an AI assistant specialized in evaluating soft skills based on user responses to interview questions. Your task is to analyze the response and provide a detailed evaluation of the user's soft skills.";

const userPrompt = (inputs: { question: string; response: string }) => `Please evaluate the following response to the question: "${inputs.question}"

User's response: "${inputs.response}"

Provide a detailed evaluation of the soft skills demonstrated in this response, including strengths and areas for improvement. Consider factors such as communication clarity, problem-solving approach, creativity, adaptability, and any other relevant soft skills.`;

const promptData = (inputs: { question: string; response: string }) => ({
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
        "overall_assessment": { "type": "string" },
        "strengths": { "type": "array", "items": { "type": "string" } },
        "areas_for_improvement": { "type": "array", "items": { "type": "string" } },
        "soft_skills_demonstrated": { "type": "array", "items": { "type": "string" } },
        "score": { "type": "integer" }
      },
      "required": ["overall_assessment", "strengths", "areas_for_improvement", "soft_skills_demonstrated", "score"],
      "additionalProperties": false
    }
  }
});

export default promptData;

