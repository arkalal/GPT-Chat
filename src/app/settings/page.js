"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSave, FiEye, FiEyeOff } from "react-icons/fi";
import { getStoredAPIKeys, setStoredAPIKey } from "../../utils/api";
import styles from "./page.module.scss";

export default function Settings() {
  const [keys, setKeys] = useState({
    OPENAI: "",
    ANTHROPIC: "",
    GOOGLE: "",
  });

  const [showKeys, setShowKeys] = useState({
    OPENAI: false,
    ANTHROPIC: false,
    GOOGLE: false,
  });

  const [saveStatus, setSaveStatus] = useState({
    OPENAI: "",
    ANTHROPIC: "",
    GOOGLE: "",
  });

  useEffect(() => {
    const storedKeys = getStoredAPIKeys();
    if (storedKeys) {
      setKeys({
        OPENAI: storedKeys.openai || "",
        ANTHROPIC: storedKeys.anthropic || "",
        GOOGLE: storedKeys.google || "",
      });
    }
  }, []);

  const handleSave = (provider) => {
    try {
      setStoredAPIKey(provider, keys[provider]);
      setSaveStatus((prev) => ({
        ...prev,
        [provider]: "Saved successfully!",
      }));

      setTimeout(() => {
        setSaveStatus((prev) => ({
          ...prev,
          [provider]: "",
        }));
      }, 2000);
    } catch (error) {
      setSaveStatus((prev) => ({
        ...prev,
        [provider]: "Failed to save",
      }));
    }
  };

  const toggleShowKey = (provider) => {
    setShowKeys((prev) => ({
      ...prev,
      [provider]: !prev[provider],
    }));
  };

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className={styles.title}>API Settings</h1>
      <p className={styles.description}>
        Enter your API keys for each provider. Keys are stored locally in your
        browser.
      </p>

      {Object.keys(keys).map((provider) => (
        <motion.div
          key={provider}
          className={styles.keySection}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <label className={styles.label}>{provider} API Key</label>
          <div className={styles.inputGroup}>
            <input
              type={showKeys[provider] ? "text" : "password"}
              value={keys[provider]}
              onChange={(e) =>
                setKeys((prev) => ({ ...prev, [provider]: e.target.value }))
              }
              placeholder={`Enter your ${provider} API key`}
              className={styles.input}
            />
            <button
              onClick={() => toggleShowKey(provider)}
              className={styles.toggleButton}
              type="button"
            >
              {showKeys[provider] ? <FiEyeOff /> : <FiEye />}
            </button>
            <motion.button
              onClick={() => handleSave(provider)}
              className={styles.saveButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
            >
              <FiSave />
              Save
            </motion.button>
          </div>
          {saveStatus[provider] && (
            <motion.p
              className={`${styles.status} ${
                saveStatus[provider].includes("Failed")
                  ? styles.error
                  : styles.success
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {saveStatus[provider]}
            </motion.p>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
