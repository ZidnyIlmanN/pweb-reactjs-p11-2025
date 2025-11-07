"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { useCart } from "@/context/cart-context"
import { useRouter } from "next/navigation"

import Link from "next/link"

import { DotLottieReact } from '@lottiefiles/dotlottie-react'

export default function CartPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { cart, updateQuantity, removeFromCart, getTotalItems, getTotalPrice, clearCart } = useCart()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isAuthenticated, authLoading, router])

  if (authLoading) return <div className="text-center py-12">Loading...</div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[var(--dark-blue)] mb-8">Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-64 h-64 mb-8">
            <DotLottieReact
              src="https://lottie.host/da121782-e4ef-46ce-9f52-527aa56fd5db/EYHIKMVXEZ.lottie"
              loop
              autoplay
            />
          </div>
          <h3 className="text-2xl font-semibold text-[var(--dark-blue)] mb-4">Your cart is empty</h3>
          <p className="text-muted-foreground mb-8 text-center max-w-md">
            Looks like you haven't added any books to your cart yet. Start exploring our collection!
          </p>
          <Link href="/books">
            <button className="bg-[var(--dark-blue)] text-[var(--near-white)] hover:bg-[var(--dark-blue)]/90 px-8 py-3 text-lg rounded-lg">
              Browse Books
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          // Cart Items
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="border rounded-lg shadow-sm">
                <div className="flex justify-between items-center gap-4 p-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-[var(--dark-blue)]">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">Rp {(item.price || 0).toLocaleString('id-ID')}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.book_id, item.quantity - 1)} className="px-2 py-1 border rounded-md text-sm">-
                    </button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.book_id, item.quantity + 1)} className="px-2 py-1 border rounded-md text-sm">+
                    </button>
                  </div>

                  <p className="font-semibold text-[var(--medium-blue)] text-lg min-w-[100px] text-right">
                    Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                  </p>

                  <button onClick={() => removeFromCart(item.book_id)} className="text-red-500 hover:text-red-700 px-3 py-2 rounded-md">Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          // Cart Summary
          <div className="border rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <h2 className="text-lg font-bold text-[var(--dark-blue)]">Cart Summary</h2>
            </div>
            <div className="space-y-3 p-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Items</span>
                <span className="text-foreground font-medium">{getTotalItems()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Price</span>
                <span className="text-[var(--medium-blue)] font-bold text-lg">Rp {getTotalPrice().toLocaleString('id-ID')}</span>
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={clearCart} className="flex-1 border-[var(--medium-blue)] text-[var(--medium-blue)] hover:bg-[var(--medium-blue)] hover:text-[var(--near-white)] px-4 py-2 rounded-lg border">
                  Clear Cart
                </button>
                <button onClick={() => router.push('/transactions/checkout')} className="flex-1 bg-[var(--dark-blue)] text-[var(--near-white)] hover:bg-[var(--dark-blue)]/90 px-4 py-2 rounded-lg">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
