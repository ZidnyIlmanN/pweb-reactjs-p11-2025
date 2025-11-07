"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { AuthProvider } from "@/context/auth-context"
import { CartProvider } from "@/context/cart-context"
import Footer from "@/components/Footer"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const showNavbarAndFooter = !pathname.startsWith('/auth')

  return (
    <AuthProvider>
      <CartProvider>
        {showNavbarAndFooter && <Navbar />}
        <main>{children}</main>
        {showNavbarAndFooter && <Footer />}
      </CartProvider>
    </AuthProvider>
  )
}
