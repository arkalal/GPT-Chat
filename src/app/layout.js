import "./globals.scss";

export const metadata = {
  title: "v0 by Vercel",
  description: "Ship faster with v0",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black min-h-screen">{children}</body>
    </html>
  );
}
