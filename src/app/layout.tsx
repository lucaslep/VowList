import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'VowList — Sua lista de casamento', template: '%s | VowList' },
  description: 'Uma lista de presentes elegante e personalizada para celebrar o começo da vida a dois.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
