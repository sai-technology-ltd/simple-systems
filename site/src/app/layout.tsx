import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Simple Systems | Business systems for teams that run on Notion",
  description:
    "Operational systems for companies that run on Notion. Simple Systems provides lightweight workflows for hiring, support, intake, requests, and CRM.",
  openGraph: {
    title: "Simple Systems",
    description:
      "Operational systems for companies that run on Notion. Simple Systems provides lightweight workflows for hiring, support, intake, requests, and CRM.",
  },
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
