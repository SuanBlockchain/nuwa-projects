import { Inter, Lusitana, Roboto, Space_Grotesk } from "next/font/google";

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const lusitana = Lusitana({ weight: ['400', '700'], subsets: ["latin"] });

export const roboto = Roboto({ weight: ['400'], subsets: ["latin"] });

export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});