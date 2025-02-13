export const AI_PROVIDERS = {
  OPENAI: {
    models: [
      { id: "gpt-4", name: "GPT-4" },
      { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
    ],
  },
  ANTHROPIC: {
    models: [
      { id: "claude-3-opus", name: "Claude 3 Opus" },
      { id: "claude-3-sonnet", name: "Claude 3 Sonnet" },
    ],
  },
  GOOGLE: {
    models: [{ id: "gemini-pro", name: "Gemini Pro" }],
  },
};

export const DEFAULT_MODEL = {
  provider: "OPENAI",
  model: "gpt-4",
};
