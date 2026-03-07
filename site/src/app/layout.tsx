import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Simple Systems",
  description: "Simple tools for businesses that already run on Notion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
