"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiCopy, FiChevronDown } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { AI_PROVIDERS } from "@/config/ai-config";
import { sendChatMessage } from "@/utils/api";
import styles from "./ChatInterface.module.scss";

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState({
    provider: "OPENAI",
    model: AI_PROVIDERS.OPENAI.models[0].id,
  });
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStreamedMessage, setCurrentStreamedMessage] = useState("");
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentStreamedMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsStreaming(true);
    setCurrentStreamedMessage("");

    try {
      const allMessages = [...messages, userMessage];
      await sendChatMessage(
        allMessages,
        selectedModel.model,
        selectedModel.provider,
        (chunk) => {
          setCurrentStreamedMessage((prev) => prev + chunk);
        }
      );

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: currentStreamedMessage },
      ]);
      setCurrentStreamedMessage("");
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I apologize, but I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsStreaming(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleModelChange = (e) => {
    const [provider, modelId] = e.target.value.split("|");
    setSelectedModel({ provider, model: modelId });
  };

  const renderMessages = () => {
    const messagesToRender = [
      ...messages,
      ...(currentStreamedMessage
        ? [{ role: "assistant", content: currentStreamedMessage }]
        : []),
    ];

    return messagesToRender.map((message, index) => (
      <motion.div
        key={index}
        className={`${styles.message} ${styles[message.role]}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <div className={styles.codeBlock}>
                  <div className={styles.codeHeader}>
                    <span>{match[1]}</span>
                    <button
                      onClick={() => copyToClipboard(children)}
                      className={styles.copyButton}
                    >
                      <FiCopy />
                    </button>
                  </div>
                  <SyntaxHighlighter
                    language={match[1]}
                    style={atomDark}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {message.content}
        </ReactMarkdown>
      </motion.div>
    ));
  };

  return (
    <div className={styles.container}>
      <div className={styles.modelSelector}>
        <select
          value={`${selectedModel.provider}|${selectedModel.model}`}
          onChange={handleModelChange}
          className={styles.select}
        >
          {Object.entries(AI_PROVIDERS).map(([provider, { models }]) =>
            models.map((model) => (
              <option
                key={`${provider}-${model.id}`}
                value={`${provider}|${model.id}`}
              >
                {model.name} ({provider})
              </option>
            ))
          )}
        </select>
        <FiChevronDown className={styles.selectIcon} />
      </div>

      <motion.div
        ref={chatContainerRef}
        className={styles.chatContainer}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="popLayout">{renderMessages()}</AnimatePresence>
      </motion.div>

      <form onSubmit={handleSubmit} className={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isStreaming}
          className={styles.input}
        />
        <motion.button
          type="submit"
          className={styles.sendButton}
          disabled={isStreaming || !input.trim()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiSend />
        </motion.button>
      </form>
    </div>
  );
}
