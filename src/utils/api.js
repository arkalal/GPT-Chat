export async function sendChatMessage(messages, model, provider, onChunk) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages,
        model,
        provider,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to send message");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulatedResponse = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      accumulatedResponse += chunk;
      onChunk(chunk);
    }

    return accumulatedResponse;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

export function getStoredAPIKeys() {
  if (typeof window === "undefined") return null;

  return {
    openai: localStorage.getItem("openai_api_key"),
    anthropic: localStorage.getItem("anthropic_api_key"),
    google: localStorage.getItem("google_api_key"),
  };
}

export function setStoredAPIKey(provider, key) {
  if (typeof window === "undefined") return;

  const keyMap = {
    OPENAI: "openai_api_key",
    ANTHROPIC: "anthropic_api_key",
    GOOGLE: "google_api_key",
  };

  localStorage.setItem(keyMap[provider], key);
}
