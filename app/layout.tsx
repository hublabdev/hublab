import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HubLab - Multi-Platform Native Generator',
  description: 'Escribe una vez, despliega en todas las plataformas. Con código nativo real, no wrappers.',
  keywords: ['app generator', 'ios', 'android', 'swiftui', 'jetpack compose', 'native apps'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background antialiased">
        {children}
      </body>
    </html>
  )
}
