import type { Metadata } from "next";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

import { ContextWrapper } from "./layout.client";

export const metadata: Metadata = {
  title: "One Amigo",
  description: "🚀 👨‍🚀 👩‍🚀 🪐",
};

type RootProps = { children: React.ReactNode };
export default async function RootLayout({ children }: Readonly<RootProps>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <NextIntlClientProvider messages={messages}>
        <ContextWrapper>{children}</ContextWrapper>
      </NextIntlClientProvider>
    </html>
  );
}
