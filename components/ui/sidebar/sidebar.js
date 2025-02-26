"use client";

import { cn } from "../../../src/utils/classNames";
import Link from "next/link";
import { useState, createContext, useContext, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import "./sidebar.scss";

const SidebarContext = createContext(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({ children, open, setOpen, animate }) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...props} />
    </>
  );
};

export const DesktopSidebar = ({ className, children, ...props }) => {
  const { open, setOpen, animate } = useSidebar();
  const [initialRender, setInitialRender] = useState(true);
  const sidebarRef = useRef(null);

  // Check for disable-sidebar-transition class on mount
  useEffect(() => {
    if (typeof document !== "undefined") {
      // Start with initialRender true
      setInitialRender(true);

      // Use a longer timeout to prevent any animations before the page is fully loaded
      const timer = setTimeout(() => {
        setInitialRender(false);
      }, 1500); // Longer than the CSS transition removal timeout

      return () => clearTimeout(timer);
    }
  }, []);

  // Custom mouse leave handler that considers logo hover
  const handleMouseLeave = (e) => {
    if (initialRender) return;

    // Check if moving to the logo element
    const logoElement = document.querySelector(".sidebar-chat__logo");
    if (
      logoElement &&
      (logoElement.contains(e.relatedTarget) || logoElement === e.relatedTarget)
    ) {
      // Don't close if hovering over logo
      return;
    }

    setOpen(false);
  };

  return (
    <motion.div
      ref={sidebarRef}
      className={cn(
        "sidebar__desktop",
        initialRender ? "no-transition" : "",
        className
      )}
      initial={false}
      animate={
        !initialRender
          ? {
              width: animate ? (open ? "300px" : "60px") : "300px",
            }
          : { width: "60px" }
      }
      transition={{ duration: initialRender ? 0 : 0.3 }}
      onMouseEnter={() => !initialRender && setOpen(true)}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({ className, children, ...props }) => {
  const { open, setOpen } = useSidebar();
  const initialRender = className?.includes("no-transition");

  return (
    <>
      <div className={cn("sidebar__mobile", className)} {...props}>
        <div className="sidebar__mobile-menu">
          <Menu
            className="sidebar__mobile-icon"
            onClick={() => setOpen(!open)}
          />
        </div>
        <AnimatePresence>
          {open && !initialRender && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn("sidebar__mobile-content", className)}
            >
              <div
                className="sidebar__mobile-close"
                onClick={() => setOpen(!open)}
              >
                <X />
              </div>
              {children}
            </motion.div>
          )}
          {open && initialRender && (
            <div
              className={cn("sidebar__mobile-content", className)}
              style={{ transform: "translateX(-100%)", opacity: 0 }}
            >
              <div
                className="sidebar__mobile-close"
                onClick={() => setOpen(!open)}
              >
                <X />
              </div>
              {children}
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({ link, className, ...props }) => {
  const { open, animate } = useSidebar();
  const [initialRender, setInitialRender] = useState(true);

  // Track initial render state
  useEffect(() => {
    if (typeof document !== "undefined") {
      // Start with initialRender true
      setInitialRender(true);

      // Use a timeout slightly longer than the CSS transition removal
      const timer = setTimeout(() => {
        setInitialRender(false);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, []);

  // Add classes based on sidebar state for proper icon positioning
  const linkClassName = cn(
    "sidebar__link",
    initialRender
      ? "sidebar__link--collapsed no-transition"
      : open
      ? "sidebar__link--expanded"
      : "sidebar__link--collapsed",
    className
  );

  // Add an inline style for consistent positioning
  const linkStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: initialRender ? "center" : open ? "flex-start" : "center",
  };

  return (
    <Link
      href={link.href}
      className={linkClassName}
      style={linkStyle}
      {...props}
    >
      {link.icon}
      <motion.span
        initial={{ opacity: initialRender ? 0 : open ? 1 : 0 }}
        animate={{
          display: initialRender
            ? "none"
            : animate
            ? open
              ? "inline-block"
              : "none"
            : "inline-block",
          opacity: initialRender ? 0 : animate ? (open ? 1 : 0) : 1,
        }}
        transition={{ duration: 0 }} // Zero-duration transition to prevent movement
        className="sidebar__link-text"
      >
        {link.label}
      </motion.span>
    </Link>
  );
};
