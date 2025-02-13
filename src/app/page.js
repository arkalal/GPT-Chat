"use client";

import dynamic from "next/dynamic";

const ChatInterface = dynamic(
  () => import("../../components/Chat/ChatInterface"),
  {
    ssr: false,
  }
);

export default function Home() {
  return <ChatInterface />;
}
