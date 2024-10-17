const systemPrompt = "You are an AI assistant specialized in generating cute and creative pet names. Your task is to come up with an adorable name based on the type of pet and its characteristics.";

const userPrompt = (inputs: { pet_info: string }) => `Please generate a cute and creative pet name based on the following information: ${inputs.pet_info}. The name should be appropriate for the type of pet and reflect any specific characteristics mentioned. Provide only the name without any additional explanation.`;

const promptData = (inputs: { pet_info: string }) => ({
  systemPrompt,
  model: "gpt-4o-2024-08-06",
  userPrompt: userPrompt(inputs),
  temperature: 0.7,
  max_tokens: 50,
  responseSchema: {
    "name": "pet_name_response",
    "strict": true,
    "schema": {
      "type": "object",
      "properties": {
        "pet_name": { "type": "string" }
      },
      "required": ["pet_name"],
      "additionalProperties": false
    }
  }
});

export default promptData;