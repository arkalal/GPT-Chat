"use client";

import { useState, useEffect, useRef } from "react";
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
  // Stronger approach to disable transitions on initial load
  document.documentElement.classList.add("disable-sidebar-transition");

  // Add a style element to disable transitions right away
  const style = document.createElement("style");
  style.textContent = `
    /* Prevent all movement during page load */
    .sidebar-chat__icon-container,
    .sidebar__link,
    .sidebar-chat__icon,
    .sidebar__link-text,
    .sidebar__desktop, 
    .sidebar-chat,
    .sidebar-chat__body {
      transition: none !important;
      transform: none !important;
      animation: none !important;
    }
    
    /* Fix icon position on page load */
    .sidebar-chat__icon-container {
      position: relative !important;
      left: 0 !important;
      margin: 0 auto !important;
      transform: none !important;
    }
    
    /* Ensure sidebar starts in collapsed state */
    .sidebar__desktop {
      width: 60px !important;
    }
    
    /* Ensure links are properly centered initially */
    .sidebar__link {
      justify-content: center !important;
      padding: 0.75rem 1rem !important;
    }
  `;
  style.id = "disable-sidebar-transitions-style";
  document.head.appendChild(style);

  // Remove the class and style after a longer delay to ensure everything is fully loaded
  setTimeout(() => {
    document.documentElement.classList.remove("disable-sidebar-transition");
    const styleElement = document.getElementById(
      "disable-sidebar-transitions-style"
    );
    if (styleElement) {
      styleElement.remove();
    }
  }, 1200); // Increased timeout for reliable loading
}

export function ChatSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [initialRender, setInitialRender] = useState(true);
  const sidebarRef = useRef(null);

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

  // Add mouse detection for model selector area
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!sidebarRef.current) return;

      // Check if mouse is over the logo or logo text
      const logoElement = sidebarRef.current.querySelector(
        ".sidebar-chat__logo"
      );
      const logoTextElement = sidebarRef.current.querySelector(
        ".sidebar-chat__logo-text"
      );

      // Check if target or any parent is the logo/text (using closest for parent check)
      const isOverLogo =
        logoElement &&
        (logoElement.contains(e.target) ||
          e.target.closest(".sidebar-chat__logo"));
      const isOverLogoText =
        logoTextElement &&
        (logoTextElement.contains(e.target) || e.target === logoTextElement);

      // If mouse is over logo or logo text, don't close sidebar and exit early
      if (isOverLogo || isOverLogoText) {
        setOpen(true);
        sidebarRef.current.classList.remove("model-selector-hover");
        return;
      }

      // Define the area where the model selector is positioned
      const modelSelectorArea = {
        left: 60,
        right: 220, // Approximate width of model selector plus some padding
        top: 0,
        bottom: 80, // Height of the model selector area
      };

      // Check if mouse is in the model selector area and NOT near logo
      const isInSelectorArea =
        e.clientX > modelSelectorArea.left &&
        e.clientX < modelSelectorArea.right &&
        e.clientY > modelSelectorArea.top &&
        e.clientY < modelSelectorArea.bottom;

      if (isInSelectorArea && !isOverLogo && !isOverLogoText) {
        // Add class to handle model selector area hover
        sidebarRef.current.classList.add("model-selector-hover");
      } else {
        // Remove class when mouse leaves the area
        sidebarRef.current.classList.remove("model-selector-hover");
      }
    };

    // Add listener for mouse movements
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [setOpen]);

  const links = [
    {
      label: "Chat",
      href: "/",
      icon: (
        <motion.div className="sidebar-chat__icon-container">
          <MessageSquare className="sidebar-chat__icon" />
        </motion.div>
      ),
    },
    {
      label: "API Keys",
      href: "/api-keys",
      icon: (
        <motion.div className="sidebar-chat__icon-container">
          <Key className="sidebar-chat__icon" />
        </motion.div>
      ),
    },
    {
      label: "History",
      href: "/history",
      icon: (
        <motion.div className="sidebar-chat__icon-container">
          <History className="sidebar-chat__icon" />
        </motion.div>
      ),
    },
    {
      label: "AI Models",
      href: "/models",
      icon: (
        <motion.div className="sidebar-chat__icon-container">
          <Brain className="sidebar-chat__icon" />
        </motion.div>
      ),
    },
    {
      label: "Settings",
      href: "/settings",
      icon: (
        <motion.div className="sidebar-chat__icon-container">
          <Settings className="sidebar-chat__icon" />
        </motion.div>
      ),
    },
  ];

  return (
    <div
      ref={sidebarRef}
      className={`sidebar-chat ${open ? "open" : ""} ${
        initialRender ? "no-transition" : ""
      }`}
    >
      <Sidebar open={open} setOpen={setOpen} animate={!initialRender}>
        <SidebarBody className="sidebar-chat__body">
          <div className="sidebar-chat__content">
            {open ? <Logo setOpen={setOpen} /> : <LogoIcon />}
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
                icon: (
                  <motion.div className="sidebar-chat__icon-container">
                    <LogOut className="sidebar-chat__icon" />
                  </motion.div>
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
    </div>
  );
}

const Logo = ({ setOpen }) => {
  // Keep sidebar open when logo is clicked or hovered
  const forceSidebarOpen = () => {
    setOpen(true);
  };

  // Handle all possible mouse events to ensure sidebar stays open
  const handleInteraction = (e) => {
    e.stopPropagation();
    forceSidebarOpen();
  };

  return (
    <Link
      href="/"
      className="sidebar-chat__logo"
      onMouseEnter={handleInteraction}
      onMouseOver={handleInteraction}
      onMouseMove={handleInteraction}
      onClick={handleInteraction}
    >
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
        onMouseEnter={handleInteraction}
        onMouseOver={handleInteraction}
        onMouseMove={handleInteraction}
        onClick={handleInteraction}
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
