"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend } from "react-icons/fi";
import { BsRobot } from "react-icons/bs";
import { FaSpinner } from "react-icons/fa";
import styles from "./ChatInterface.module.scss";

const suggestions = [
  "Generate a sticky header",
  "How can I structure LLM output?",
  "Write code to implement a min heap",
];

const models = [
  { id: "gpt-4", name: "GPT-4", icon: "🤖" },
  { id: "claude-3", name: "Claude 3", icon: "🧠" },
  { id: "gemini-pro", name: "Gemini Pro", icon: "💫" },
  { id: "deepseek", name: "Deepseek", icon: "🔍" },
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
    setMessages((prev) => [...prev, { role: "user", content: input }]);

    // Simulate AI response - Replace with actual API call
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "This is a simulated response. Replace with actual API integration.",
        },
      ]);
      setIsLoading(false);
    }, 2000);

    setInput("");
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
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
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
            {messages.map((message, index) => (
              <motion.div
                key={index}
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
