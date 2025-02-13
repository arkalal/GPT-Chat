"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiCopy } from "react-icons/fi";
import { BsRobot } from "react-icons/bs";
import { FaSpinner } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import styles from "./ChatInterface.module.scss";
import { MessageLoading } from "../../components/ui/MessageLoading";
import { ElegantBackground } from "../../components/ui/ElegantBackground";

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

const FormattedContent = ({ content }) => {
  const copyToClipboard = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const code = String(children).replace(/\n$/, "");

          if (!inline && match) {
            return (
              <div className={styles.codeBlock}>
                <div className={styles.codeHeader}>
                  <span className={styles.language}>{match[1]}</span>
                  <button
                    className={styles.copyButton}
                    onClick={() => copyToClipboard(code)}
                  >
                    <FiCopy />
                  </button>
                </div>
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {code}
                </SyntaxHighlighter>
              </div>
            );
          }
          return inline ? (
            <code className={styles.inlineCode} {...props}>
              {children}
            </code>
          ) : (
            <SyntaxHighlighter
              style={oneDark}
              language="text"
              PreTag="div"
              {...props}
            >
              {code}
            </SyntaxHighlighter>
          );
        },
        // Add custom styling for other markdown elements
        h1: ({ children }) => <h1 className={styles.markdownH1}>{children}</h1>,
        h2: ({ children }) => <h2 className={styles.markdownH2}>{children}</h2>,
        h3: ({ children }) => <h3 className={styles.markdownH3}>{children}</h3>,
        p: ({ children }) => <p className={styles.markdownP}>{children}</p>,
        ul: ({ children }) => <ul className={styles.markdownUl}>{children}</ul>,
        ol: ({ children }) => <ol className={styles.markdownOl}>{children}</ol>,
        li: ({ children }) => <li className={styles.markdownLi}>{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className={styles.markdownBlockquote}>
            {children}
          </blockquote>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

const ChatInterface = () => {
  const [input, setInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

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
    setIsTyping(true);

    // Generate unique IDs using UUID-like format
    const uniqueId = () =>
      `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const userMessage = {
      role: "user",
      content: input,
      id: `user-${uniqueId()}`,
    };

    const assistantMessage = {
      role: "assistant",
      content: "",
      id: `assistant-${uniqueId()}`,
    };

    // Update messages with user message first
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

      // Add assistant message only after response starts
      setMessages((prev) => [...prev, assistantMessage]);

      const reader = response.body.getReader();
      let accumulatedContent = "";
      let isFirstChunk = true;

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          setIsTyping(false);
          setIsLoading(false);
          break;
        }

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split("\n").filter((line) => line.trim() !== "");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);

            if (data === "[DONE]") {
              setIsTyping(false);
              setIsLoading(false);
              continue;
            }

            try {
              const parsed = JSON.parse(data);

              if (parsed.error) {
                throw new Error(parsed.error);
              }

              // Stop typing animation on first chunk
              if (isFirstChunk) {
                setIsTyping(false);
                isFirstChunk = false;
              }

              const content = parsed.choices[0]?.delta?.content || "";
              accumulatedContent += content;

              // Update message content using functional update
              setMessages((prev) => {
                const messageIndex = prev.findIndex(
                  (msg) => msg.id === assistantMessage.id
                );
                if (messageIndex === -1) return prev;

                const newMessages = [...prev];
                newMessages[messageIndex] = {
                  ...newMessages[messageIndex],
                  content: accumulatedContent,
                };
                return newMessages;
              });
            } catch (e) {
              if (e.message !== "Unexpected end of JSON input") {
                throw e;
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);

      // Update or add error message
      setMessages((prev) => {
        const messageIndex = prev.findIndex(
          (msg) => msg.id === assistantMessage.id
        );
        if (messageIndex === -1) {
          // Add new error message if assistant message wasn't added
          return [
            ...prev,
            {
              ...assistantMessage,
              content:
                "I apologize, but I encountered an error. Please try again.",
            },
          ];
        }
        // Update existing assistant message
        const newMessages = [...prev];
        newMessages[messageIndex] = {
          ...newMessages[messageIndex],
          content: "I apologize, but I encountered an error. Please try again.",
        };
        return newMessages;
      });

      setIsTyping(false);
      setIsLoading(false);
    } finally {
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
      <div className={styles.background_container}>
        <ElegantBackground
          badge={!isExpanded ? "AI Chat Assistant" : ""}
          title1={!isExpanded ? "What can I" : ""}
          title2={!isExpanded ? "help you ship?" : ""}
          description={
            !isExpanded
              ? "Crafting exceptional digital experiences through innovative design and cutting-edge technology."
              : ""
          }
        />
      </div>
      <div
        className={`${styles.wrapper} ${
          isExpanded ? styles.wrapper_expanded : ""
        }`}
      >
        {!isExpanded ? (
          <div className={styles.header}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={styles.header__suggestions}
            >
              {suggestions.map((suggestion) => (
                <motion.button
                  key={suggestion}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: suggestions.indexOf(suggestion) * 0.1 }}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={styles.suggestion}
                >
                  {suggestion}
                </motion.button>
              ))}
            </motion.div>
          </div>
        ) : (
          <>
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
          </>
        )}

        <div
          className={styles.chat}
          style={{ height: isExpanded ? "calc(100vh - 180px)" : 0 }}
        >
          <AnimatePresence mode="sync">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
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
                  <FormattedContent content={message.content} />
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div
                key="typing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={styles.chat__typing}
              >
                <div className={styles.chat__avatar}>
                  <BsRobot />
                </div>
                <div className={styles.chat__content}>
                  <MessageLoading />
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
