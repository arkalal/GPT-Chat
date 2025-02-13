import { Inter } from "next/font/google";
import { AnimatePresence } from "framer-motion";
import Navigation from "../components/Layout/Navigation";
import "./globals.scss";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "GPT Chat - Advanced AI Chat Interface",
  description:
    "Chat with multiple AI models including OpenAI, Anthropic, and Google AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Navigation />
        <AnimatePresence mode="wait">
          <main className="app-container">{children}</main>
        </AnimatePresence>
      </body>
    </html>
  );
}
