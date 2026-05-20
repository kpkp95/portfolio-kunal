/**
 * components/chat/types.ts
 * Shared TypeScript types for the chatbot UI components.
 */

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  isStreaming?: boolean;
  timestamp: Date;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  isOpen: boolean;
  error: string | null;
}

export const SUGGESTED_PROMPTS = [
  "Tell me about Kunal",
  "Show AI projects",
  "What cloud experience does he have?",
  "What technologies does he use?",
  "Explain the RAG chatbot project",
] as const;
