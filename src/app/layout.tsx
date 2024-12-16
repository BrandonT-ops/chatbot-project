import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import "./globals.css";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Maguida',
  description: 'The Ultimate AI-powered Product Search Application',
  icons: '/public/assets/app_logo.svg', 
  applicationName: 'Maguida Product Assistant',
  authors: {url:"Richenel's AI Agency"},
  keywords: ["Product", "AI", ""],
  
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        
        {children}
      </body>
    </html>
  );
}
