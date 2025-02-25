"use client";

import { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./sidebar";
import {
  MessageSquare,
  Settings,
  Key,
  History,
  Brain,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import "./ChatSidebar.scss";

// Add an inline script to handle initial state
// This ensures the sidebar is in the collapsed state before any styles are applied
if (typeof document !== "undefined") {
  document.documentElement.classList.add("disable-sidebar-transition");

  // Remove the class after a delay to re-enable transitions
  setTimeout(() => {
    document.documentElement.classList.remove("disable-sidebar-transition");
  }, 500);
}

export function ChatSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [initialRender, setInitialRender] = useState(true);

  // Handle initial render state
  useEffect(() => {
    if (initialRender) {
      // Wait for the component to render fully
      const timer = setTimeout(() => {
        setInitialRender(false);
      }, 600); // Match the timeout in sidebar.js

      return () => clearTimeout(timer);
    }
  }, [initialRender]);

  const links = [
    {
      label: "Chat",
      href: "/",
      icon: <MessageSquare className="sidebar-chat__icon" />,
    },
    {
      label: "API Keys",
      href: "/api-keys",
      icon: <Key className="sidebar-chat__icon" />,
    },
    {
      label: "History",
      href: "/history",
      icon: <History className="sidebar-chat__icon" />,
    },
    {
      label: "AI Models",
      href: "/models",
      icon: <Brain className="sidebar-chat__icon" />,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <Settings className="sidebar-chat__icon" />,
    },
  ];

  return (
    <div
      className={`sidebar-chat ${open ? "open" : ""} ${
        initialRender ? "no-transition" : ""
      }`}
    >
      <Sidebar open={open} setOpen={setOpen} animate={!initialRender}>
        <SidebarBody className="sidebar-chat__body">
          <div className="sidebar-chat__content">
            {open ? <Logo /> : <LogoIcon />}
            <div className="sidebar-chat__links">
              {links.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={link}
                  className={
                    pathname === link.href ? "sidebar__link--active" : ""
                  }
                />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Logout",
                href: "/logout",
                icon: <LogOut className="sidebar-chat__icon" />,
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
    </div>
  );
}

const Logo = () => {
  return (
    <Link href="/" className="sidebar-chat__logo">
      <motion.div
        className="sidebar-chat__logo-icon"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      />
      <motion.span
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="sidebar-chat__logo-text"
      >
        AI Hub
      </motion.span>
    </Link>
  );
};

const LogoIcon = () => {
  return (
    <Link href="/" className="sidebar-chat__logo">
      <motion.div
        className="sidebar-chat__logo-icon"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      />
    </Link>
  );
};
