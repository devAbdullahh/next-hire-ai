import Groq from "groq-sdk";
import { GROQ_MODELS } from "./constants";

let groqClient: Groq | null = null;

export function getGroqClient(): Groq {
  if (!groqClient) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not configured");
    }
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
}

export type GroqModel = (typeof GROQ_MODELS)[keyof typeof GROQ_MODELS];

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function chatCompletion(
  messages: ChatMessage[],
  options?: {
    model?: GroqModel;
    temperature?: number;
    maxTokens?: number;
    jsonMode?: boolean;
  }
): Promise<string> {
  const client = getGroqClient();
  const model = options?.model ?? GROQ_MODELS.primary;

  try {
    const response = await client.chat.completions.create({
      model,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 2048,
      ...(options?.jsonMode && { response_format: { type: "json_object" } }),
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("Empty response from Groq");
    }
    return content;
  } catch (error) {
    if (model === GROQ_MODELS.primary) {
      return chatCompletion(messages, {
        ...options,
        model: GROQ_MODELS.fast,
      });
    }
    throw error;
  }
}
