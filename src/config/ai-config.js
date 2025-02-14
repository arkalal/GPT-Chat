import {
  SiOpenai,
  SiGooglegemini,
  SiAnthropic,
  SiDeepnote,
} from "react-icons/si";

export const AI_PROVIDERS = {
  OPENAI: {
    icon: SiOpenai,
    models: [
      { id: "gpt-4-turbo-preview", name: "GPT-4 Turbo" },
      { id: "gpt-4-vision-preview", name: "GPT-4 Vision" },
      { id: "gpt-4", name: "GPT-4" },
      { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
      { id: "gpt-3.5-turbo-0125", name: "GPT-3.5 Turbo Latest" },
    ],
  },
  ANTHROPIC: {
    icon: SiAnthropic,
    models: [
      { id: "claude-3-opus", name: "Claude 3 Opus" },
      { id: "claude-3-sonnet", name: "Claude 3 Sonnet" },
      { id: "claude-3-haiku", name: "Claude 3 Haiku" },
    ],
  },
  GOOGLE: {
    icon: SiGooglegemini,
    models: [
      { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro" },
      { id: "gemini-1.0-pro", name: "Gemini Pro" },
      { id: "gemini-1.0-pro-vision", name: "Gemini Pro Vision" },
    ],
  },
  DEEPSEEK: {
    icon: SiDeepnote,
    models: [
      { id: "deepseek-coder-33b-instruct", name: "Deepseek Coder 33B" },
      { id: "deepseek-chat-67b", name: "Deepseek Chat 67B" },
      { id: "deepseek-math-7b", name: "Deepseek Math 7B" },
    ],
  },
};

export const DEFAULT_MODEL = {
  provider: "OPENAI",
  model: "gpt-4-turbo-preview",
};
