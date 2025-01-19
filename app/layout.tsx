'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import { AnimatePresence } from 'framer-motion'
import { ThemeProvider } from 'next-themes'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <AnimatePresence mode="wait">
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
          </AnimatePresence>
        </ThemeProvider>
      </body>
    </html>
  )
}

