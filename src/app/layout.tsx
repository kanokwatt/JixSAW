import '../styles/globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'JixSAW',
  description: 'Next.js TypeScript app'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
