import type { Metadata } from "next";
import "./globals.css";
import { roboto } from '@/app/ui/fonts';
import Navbar from "./ui/navbar";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { ThemeProvider } from "@/app/components/theme-provider";



export const metadata: Metadata = {
  title: "Nuwa Projects",
  description: "Nuwa Projects handled by Suan",
};

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
            <Navbar />
            <Theme 	>
              {children}

            </Theme>

        </ThemeProvider>
      </body>
    </html>
  );
}
