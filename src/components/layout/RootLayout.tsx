import { type ReactNode } from 'react'
import { Toast } from '../ui/Toast'

interface RootLayoutProps {
  children: ReactNode
}

export const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <div className="min-h-screen bg-base-100">
      <Toast />
      <div className="max-w-7xl mx-auto p-8">{children}</div>
    </div>
  )
}
