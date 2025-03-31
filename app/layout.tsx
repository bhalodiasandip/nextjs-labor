import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import {NextIntlClientProvider} from 'next-intl';
import {getLocale} from 'next-intl/server';
import LocaleSwitcherSelect from '@/app/ui/LocaleSwitcherSelect';
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
          {children}
          <LocaleSwitcherSelect />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
