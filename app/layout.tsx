'use client';

import "./globals.css";
import "./theme-config.css";
import "@radix-ui/themes/styles.css";
import "./radix-overrides.css";
import { lusitana, spaceGrotesk } from '@/app/ui/fonts';
import { Theme } from "@radix-ui/themes";
import { ThemeProvider } from "@/app/ui/theme-provider";
import Footer from "./ui/footer";
import { Analytics } from "@vercel/analytics/react";
import I18nProviderClientWrapper from "./providers/i18n-client-wrapper";
import dynamic from 'next/dynamic';
import GlobalLayout from "./GlobalLayout";
import { SessionProvider } from 'next-auth/react';
import { WalletSessionProvider } from '@/app/contexts/wallet-session-context';

const Navbar = dynamic(() => import('@/app/ui/navbar/navbar'), { ssr: false });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${lusitana.className} ${spaceGrotesk.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <Theme accentColor="mint" grayColor="slate" scaling="100%" radius="medium">
            <I18nProviderClientWrapper>
              <SessionProvider>
                <WalletSessionProvider>
                  <Navbar />
                  <GlobalLayout>
                  <main className="min-h-screen">
                    {children}
                  </main>
                  </GlobalLayout>
                  <Analytics />
                  <Footer />
                </WalletSessionProvider>
              </SessionProvider>
            </I18nProviderClientWrapper>
            {/* Uncomment for development to adjust theme visually */}
            {/* <ThemePanel /> */}
          </Theme>
        </ThemeProvider>
      </body>
    </html>
  );
}