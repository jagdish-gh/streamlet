import type { Metadata } from "next";
import Favicon from '/public/favicon.ico'
import { Provider as ThemeProvider } from "../_util/providers";
import{ Providers as SessionProviders } from "../_util/sessionProviders";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Streamlet - Personalize Your YouTube Journey",
  description: "Streamlet transforms the way you watch YouTube by focusing exclusively on your interests and subscriptions. Dive into a world where your favorite content",
  icons: [{rel: 'icon', url: Favicon.src}]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
        <SessionProviders>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </SessionProviders>
        
        </body>
      </html>
    
  );
}
