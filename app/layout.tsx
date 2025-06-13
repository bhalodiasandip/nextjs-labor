// layout.tsx
import "@/app/ui/global.css";
import { inter } from "@/app/ui/fonts";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import LocaleSwitcherSelect from "@/app/ui/LocaleSwitcherSelect";
import { ReduxProvider } from "@/app/providers";
import { ReactNode } from "react";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body className={`${inter.className} antialiased`}>
        <NextIntlClientProvider>
          <ReduxProvider>
            {children}
            <LocaleSwitcherSelect />
          </ReduxProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
