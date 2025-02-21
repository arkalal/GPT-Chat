"use client";

import { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./sidebar";
import { LayoutDashboard, UserCog, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "../../../src/utils/classNames";
import "./demo.scss";

export function SidebarDemo() {
  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: <LayoutDashboard className="sidebar-demo__icon" />,
    },
    {
      label: "Profile",
      href: "#",
      icon: <UserCog className="sidebar-demo__icon" />,
    },
    {
      label: "Settings",
      href: "#",
      icon: <Settings className="sidebar-demo__icon" />,
    },
    {
      label: "Logout",
      href: "#",
      icon: <LogOut className="sidebar-demo__icon" />,
    },
  ];

  const [open, setOpen] = useState(false);

  return (
    <div className="sidebar-demo">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="sidebar-demo__body">
          <div className="sidebar-demo__content">
            {open ? <Logo /> : <LogoIcon />}
            <div className="sidebar-demo__links">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "User Profile",
                href: "#",
                icon: (
                  <Image
                    src="https://github.com/shadcn.png"
                    className="sidebar-demo__avatar"
                    width={28}
                    height={28}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard />
    </div>
  );
}

const Logo = () => {
  return (
    <Link href="#" className="sidebar-demo__logo">
      <div className="sidebar-demo__logo-icon" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="sidebar-demo__logo-text"
      >
        AI Hub
      </motion.span>
    </Link>
  );
};

const LogoIcon = () => {
  return (
    <Link href="#" className="sidebar-demo__logo">
      <div className="sidebar-demo__logo-icon" />
    </Link>
  );
};

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="dashboard__content">
        <div className="dashboard__grid">
          {[...new Array(4)].map((_, i) => (
            <div key={i} className="dashboard__card" />
          ))}
        </div>
        <div className="dashboard__main">
          {[...new Array(2)].map((_, i) => (
            <div key={i} className="dashboard__panel" />
          ))}
        </div>
      </div>
    </div>
  );
};
