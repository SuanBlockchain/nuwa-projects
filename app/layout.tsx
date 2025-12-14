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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{__html: `
          .material-symbols-outlined {
            font-family: 'Material Symbols Outlined';
            font-weight: normal;
            font-style: normal;
            font-size: 24px;
            line-height: 1;
            letter-spacing: normal;
            text-transform: none;
            display: inline-block;
            white-space: nowrap;
            word-wrap: normal;
            direction: ltr;
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            -webkit-font-smoothing: antialiased;
            text-rendering: optimizeLegibility;
            -moz-osx-font-smoothing: grayscale;
          }
          .icon-filled {
            font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          }
        `}} />
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