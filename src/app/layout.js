import { ChatSidebar } from "../../components/ui/sidebar/ChatSidebar";
import "./globals.scss";

export const metadata = {
  title: "AI Hub - Your Universal AI Assistant",
  description: "Your Gateway to AI Excellence",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="app-layout">
          <ChatSidebar />
          <main className="app-layout__main">{children}</main>
        </div>
      </body>
    </html>
  );
}
