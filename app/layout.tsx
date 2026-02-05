import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Monefy Clone',
  description: 'Track your expenses and income',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
