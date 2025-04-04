'use client';

import "./globals.css";
import "./theme-config.css";
import "@radix-ui/themes/styles.css";
import "./radix-overrides.css";
import { lusitana } from '@/app/ui/fonts';
import { Theme } from "@radix-ui/themes";
import { ThemeProvider } from "@/app/ui/theme-provider";
import Footer from "./ui/footer";
import { Analytics } from "@vercel/analytics/react";
import I18nProvider from "./ui/i18n-provider";
import "@aws-amplify/ui-react/styles.css";
import dynamic from 'next/dynamic';
// import Auth from "@/app/amplify/(auth)/auth";

const Navbar = dynamic(() => import('@/app/ui/navbar/navbar'), { ssr: false });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${lusitana.className} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <Theme accentColor="mint" grayColor="slate" scaling="100%" radius="medium">
            <I18nProvider>
              {/* <Auth> */}
                <Navbar />
                <main className="min-h-screen">
                  {children}
                </main>
                <Analytics />
                <Footer />
              {/* </Auth> */}
            </I18nProvider>
            {/* Uncomment for development to adjust theme visually */}
            {/* <ThemePanel /> */}
          </Theme>
        </ThemeProvider>
      </body>
    </html>
  );
}