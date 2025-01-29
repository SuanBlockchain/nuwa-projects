import type { Metadata } from "next";
import "./globals.css";
import { roboto } from '@/app/ui/fonts';


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
    <html lang="en">
      <body
        className={`${roboto.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
