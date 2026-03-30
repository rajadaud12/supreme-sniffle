export interface OllamaRequest {
  model: string;
  prompt: string;
  stream: boolean;
  format?: string;
  options?: Record<string, any>;
}

export interface OllamaResponse {
  response: string;
}

export const OLLAMA_DEFAULT_MODEL = "deepseek-v3.1:671b-cloud";

export async function askOllama(fields: any[], userPrompt: string): Promise<Record<string, string>> {
  const systemPrompt = `
You are a professional form-filling agent.
Your goal is to map form fields to the most appropriate values based on the user's intent.

User Request: "${userPrompt}"

Form Structure (JSON):
${JSON.stringify(fields, null, 2)}

Instructions:
1. Analyze the field labels, names, types, and context.
2. Provide a value for each field that makes sense for the user's request.
3. Return ONLY a valid JSON object where keys are the field 'id' provided in the JSON above and values are the text to fill.
4. IMPORTANT: Use the exact 'id' string (e.g. "agent-1-abcde") as the key.
5. If a field is a checkbox or radio, provide "true"/"false" or the option value.
6. NO explanation. NO markdown. JUST the JSON object.
`;

  try {
    const apiUrl = import.meta.env.WXT_OLLAMA_URL || "http://127.0.0.1:11434/api/generate";
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_DEFAULT_MODEL,
        prompt: systemPrompt,
        stream: false,
        format: "json",
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.statusText}`);
    }

    const data: OllamaResponse = await response.json();
    
    // CLEANING: LLMs sometimes wrap JSON in markdown (```json ... ```) 
    // This regex extracts only the content inside the curly braces.
    const rawResponse = data.response.trim();
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    const cleanedJson = jsonMatch ? jsonMatch[0] : rawResponse;

    return JSON.parse(cleanedJson);
  } catch (error) {
    console.error("Failed to fetch from Ollama:", error);
    throw error;
  }
}
