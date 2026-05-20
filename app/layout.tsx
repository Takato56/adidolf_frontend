import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Adidolf",
  description: "Express your political beliefs with fashion.",
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
