'use client';
// import type { Metadata } from "next";
import "./globals.css";
import { roboto } from '@/app/ui/fonts';
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { ThemeProvider } from "@/app/ui/theme-provider";
import Footer from "./ui/footer";
import { Analytics } from "@vercel/analytics/react"
import I18nProvider from "./ui/i18n-provider";
import "@aws-amplify/ui-react/styles.css";

import dynamic from 'next/dynamic';
import Auth from "@/amplify/(auth)/auth";

const Navbar= dynamic(() => import('@/app/ui/navbar'), { ssr: false });


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${roboto.className} antialiased`}
      >
        <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        >
            <Theme>
            <I18nProvider>
              <Auth>
                <Navbar />
                  {children}
                  <Analytics />
                <Footer />
              </Auth>
            </I18nProvider>
            </Theme>
        </ThemeProvider>
      </body>
    </html>
  );
}
