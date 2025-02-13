"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend } from "react-icons/fi";
import { BsRobot } from "react-icons/bs";
import { FaSpinner } from "react-icons/fa";
import styles from "./ChatInterface.module.scss";

// Add OpenAI configuration
const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

const suggestions = [
  "Generate a sticky header",
  "How can I structure LLM output?",
  "Write code to implement a min heap",
];

const models = [
  { id: "gpt-4", name: "GPT-4", icon: "🤖", provider: "OPENAI" },
  { id: "claude-3-opus", name: "Claude 3", icon: "🧠", provider: "ANTHROPIC" },
  { id: "gemini-pro", name: "Gemini Pro", icon: "💫", provider: "GOOGLE" },
  { id: "deepseek-coder", name: "Deepseek", icon: "🔍", provider: "DEEPSEEK" },
];

const ChatInterface = () => {
  const [input, setInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    setIsExpanded(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsExpanded(true);
    setIsLoading(true);
    const userMessage = {
      role: "user",
      content: input,
      id: `user-${Date.now()}`,
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: input }],
          model: selectedModel.id,
          provider: selectedModel.provider,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      let assistantMessage = {
        role: "assistant",
        content: "",
        id: `assistant-${Date.now()}`,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Convert the chunk to text
        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split("\n").filter((line) => line.trim() !== "");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content || "";
              assistantMessage.content += content;

              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMessage.id
                    ? { ...msg, content: assistantMessage.content }
                    : msg
                )
              );
            } catch (e) {
              console.error("Error parsing chunk:", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I apologize, but I encountered an error. Please try again.",
          id: `assistant-${Date.now()}`,
        },
      ]);
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  const handleModelSelect = (model) => {
    setSelectedModel(model);
    setShowModelDropdown(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {!isExpanded ? (
          <div className={styles.header}>
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={styles.header__title}
            >
              What can I help you ship?
            </motion.h1>
            <div className={styles.header__suggestions}>
              {suggestions.map((suggestion) => (
                <motion.button
                  key={suggestion} // Use suggestion text as key since they're unique
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: suggestions.indexOf(suggestion) * 0.1 }}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={styles.suggestion}
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={styles["model-selector"]}
          >
            <button
              className={styles["model-selector__button"]}
              onClick={() => setShowModelDropdown(!showModelDropdown)}
            >
              <span className={styles["model-selector__icon"]}>
                {selectedModel.icon}
              </span>
              <span className={styles["model-selector__name"]}>
                {selectedModel.name}
              </span>
            </button>

            <AnimatePresence>
              {showModelDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={styles["model-selector__dropdown"]}
                >
                  {models.map((model) => (
                    <button
                      key={model.id}
                      className={styles["model-selector__option"]}
                      onClick={() => handleModelSelect(model)}
                    >
                      <span className={styles["model-selector__icon"]}>
                        {model.icon}
                      </span>
                      <span>{model.name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        <div
          className={styles.chat}
          style={{ height: isExpanded ? "calc(100vh - 180px)" : 0 }}
        >
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id} // Use the unique message ID as key
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${styles.chat__message} ${
                  message.role === "user"
                    ? styles["chat__message--user"]
                    : styles["chat__message--assistant"]
                }`}
              >
                {message.role === "assistant" && (
                  <div className={styles.chat__avatar}>
                    <BsRobot />
                  </div>
                )}
                <div
                  className={`${styles.chat__content} ${
                    message.role === "user"
                      ? styles["chat__content--user"]
                      : styles["chat__content--assistant"]
                  }`}
                >
                  {message.content}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={styles.chat__typing}
              >
                <div className={styles.chat__avatar}>
                  <BsRobot />
                </div>
                <div className={styles.chat__dots}>
                  <motion.span
                    animate={{
                      opacity: [0.4, 1, 0.4],
                      y: [0, -4, 0],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    •
                  </motion.span>
                  <motion.span
                    animate={{
                      opacity: [0.4, 1, 0.4],
                      y: [0, -4, 0],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.2,
                    }}
                  >
                    •
                  </motion.span>
                  <motion.span
                    animate={{
                      opacity: [0.4, 1, 0.4],
                      y: [0, -4, 0],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.4,
                    }}
                  >
                    •
                  </motion.span>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </AnimatePresence>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          className={styles["input-form"]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className={styles["input-form__container"]}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask v0 a question..."
              className={styles["input-form__field"]}
            />
            <button
              type="submit"
              className={styles["input-form__button"]}
              disabled={!input.trim() || isLoading}
            >
              {isLoading ? <FaSpinner className={styles.spin} /> : <FiSend />}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default ChatInterface;
