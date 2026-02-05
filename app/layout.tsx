import './globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'

const basePath = process.env.NODE_ENV === 'production' ? '/myMoney' : ''

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <title>Monefy Clone</title>
        <meta name="description" content="Track your expenses and income" />
        <link rel="icon" href={`${basePath}/favicon.svg`} type="image/svg+xml" />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
