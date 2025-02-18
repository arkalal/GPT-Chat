import "./globals.scss";

export const metadata = {
  title: "AI Hub - Your Universal AI Assistant",
  description:
    "One platform for all your AI needs - OpenAI, Anthropic, Google, and more",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black min-h-screen">{children}</body>
    </html>
  );
}
