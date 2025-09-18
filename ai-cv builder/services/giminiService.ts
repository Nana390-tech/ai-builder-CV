
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
// FIX: Corrected import path to be relative.
import { AIProofreadSuggestion } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// FIX: Removed top-level model constant to be more explicit in API calls, adhering to guidelines.

export const getAIideas = async (section: string, context: string): Promise<string[]> => {
  try {
    const prompt = `You are an AI assistant helping a college student (18-23 years old) with CEFR A2+ level English to write their CV. They are working on the "${section}" section. Their background is: "${context}". Your task is to provide 3 simple, short, and distinct examples of what they could write. **Crucially, all language you generate must be strictly at a CEFR A2+ level.** Use simple vocabulary and basic sentence structures. The examples should be professional but very easy to understand. Respond in JSON format with a key "ideas" which is an array of strings.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
        // FIX: Explicitly specify model name in the call.
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              ideas: {
                type: Type.ARRAY,
                items: {
                  type: Type.STRING
                }
              }
            }
          }
        }
    });

    // FIX: Correctly access the text content and parse the JSON string.
    const jsonStr = response.text;
    const result = JSON.parse(jsonStr);
    return result.ideas || [];
  } catch (error) {
    console.error("Error generating AI ideas:", error);
    return [];
  }
};


export const getAIVocabulary = async (category: string): Promise<{ word: string, definition: string }[]> => {
  try {
    const prompt = `I am a CEFR A2+ level English student writing my CV. Give me a list of 10 simple but powerful ${category} to use in my CV. For each word, provide a very simple, one-sentence definition. **The definition must be extremely simple and use only vocabulary suitable for a CEFR A2+ learner.** Respond in JSON format with an array of objects, each containing 'word' and 'definition'.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      // FIX: Explicitly specify model name in the call.
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              word: { type: Type.STRING },
              definition: { type: Type.STRING },
            }
          }
        }
      }
    });
    
    // FIX: Correctly access the text content and parse the JSON string.
    const jsonStr = response.text;
    return JSON.parse(jsonStr);

  } catch (error) {
    console.error("Error generating AI vocabulary:", error);
    return [];
  }
};

export const proofreadWithAI = async (text: string): Promise<AIProofreadSuggestion[]> => {
    try {
        const prompt = `You are an expert English proofreader specializing in helping CEFR A2+ level learners with their CVs. Proofread the following text. Correct any grammar, spelling, and punctuation errors. Suggest simpler, more professional phrasing where appropriate. Provide the corrections in a JSON format as an array of objects. Each object must have 'original' (the phrase with the mistake), 'corrected' (the corrected phrase), and 'explanation'. **The 'explanation' is very important: it must be extremely simple, using only CEFR A2 level vocabulary so the student can easily understand their mistake.** If there are no errors, return an empty array. Text to check: "${text}"`;

        const response: GenerateContentResponse = await ai.models.generateContent({
            // FIX: Explicitly specify model name in the call.
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      original: { type: Type.STRING },
                      corrected: { type: Type.STRING },
                      explanation: { type: Type.STRING },
                    }
                  }
                }
            }
        });

        // FIX: Correctly access the text content and parse the JSON string.
        const jsonStr = response.text;
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Error proofreading with AI:", error);
        return [];
    }
};