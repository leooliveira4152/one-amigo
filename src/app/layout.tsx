import type { Metadata } from "next";
import "./globals.css";
import { ContextWrapper } from "./layout.client";

export const metadata: Metadata = {
  title: "One Amigo",
  description: "🚀 👨‍🚀 👩‍🚀 🪐",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ContextWrapper>{children}</ContextWrapper>
    </html>
  );
}
