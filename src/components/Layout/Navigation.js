"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { FiMessageSquare, FiSettings } from "react-icons/fi";
import styles from "./Navigation.module.scss";

export default function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Chat", icon: FiMessageSquare },
    { href: "/settings", label: "Settings", icon: FiSettings },
  ];

  return (
    <nav className={styles.nav}>
      <div className={styles.content}>
        <Link href="/" className={styles.logo}>
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            GPT Chat
          </motion.span>
        </Link>

        <div className={styles.links}>
          {links.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                className={`${styles.link} ${isActive ? styles.active : ""}`}
              >
                <motion.div
                  className={styles.linkContent}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className={styles.icon} />
                  <span>{label}</span>
                </motion.div>
                {isActive && (
                  <motion.div
                    className={styles.activeIndicator}
                    layoutId="activeIndicator"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
