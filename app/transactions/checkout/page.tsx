"use client"

import { useState, useEffect, Suspense } from "react"
import { useAuth } from "@/context/auth-context"
import { useCart } from "@/context/cart-context"
import { useRouter, useSearchParams } from "next/navigation"
import { bookService, orderService } from "@/services/api"
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

import Link from "next/link"

// Color Variables (using CSS custom properties)
const darkBlue = "var(--dark-blue)"; // Primary Text & Accent
const mediumBlue = "var(--medium-blue)"; // Button Background, Links
const lightGreyBlue = "var(--light-grey-blue)"; // Card Background
const nearWhite = "var(--near-white)"; // Main Page Background

// Button Component (using mediumBlue as primary action color)
const Button = ({ children, type = "button", disabled = false, className = "", variant, onClick }: any) => (
  <button
    type={type}
    disabled={disabled}
    onClick={onClick}
    className={`w-full py-3 px-4 text-center font-semibold rounded-lg transition duration-200 hover:opacity-90 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    style={variant === "outline" ? {} : { backgroundColor: mediumBlue, color: nearWhite }}
  >
    {children}
  </button>
)

interface CartItem {
  id: string
  book_id: string
  title: string
  price: number
  quantity: number
}

function CheckoutContent() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { cart, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart()
  const router = useRouter()
  const searchParams = useSearchParams()
  const bookId = searchParams.get("bookId")
  const initialQuantity = Number.parseInt(searchParams.get("quantity") || "1")

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    if (isAuthenticated && bookId && cart.length === 0) {
      initializeCart()
    }
  }, [bookId, isAuthenticated, cart.length])

  const initializeCart = async () => {
    setIsLoading(true)
    setError("")
    try {
      const book = await bookService.getBookById(bookId!)
      // Add to cart context instead of local state
      // This will be handled by the cart context
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load book")
    } finally {
      setIsLoading(false)
    }
  }

  const calculateTotal = () => {
    return getTotalPrice()
  }

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setError("Cart is empty")
      return
    }

    setIsCheckingOut(true)
    try {
      const items = cart.map((item) => ({
        book_id: item.book_id,
        quantity: item.quantity,
      }))

      const order = await orderService.createOrder({ items })
      clearCart()
      router.push(`/transactions/${order.data.transaction_id}`)
    } catch (err: any) {
      setError(err.response?.data?.message || "Checkout failed")
      setIsCheckingOut(false)
    }
  }

  if (authLoading) return <div className="text-center py-12">Loading...</div>
  if (isLoading)
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading checkout...</p>
      </div>
    )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[var(--dark-blue)] mb-8">Checkout</h1>

      {error && <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg text-accent mb-6">{error}</div>}

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <div key={item.id} className="border rounded-lg shadow-sm">
                <div className="p-6 flex justify-between items-center gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-[var(--dark-blue)]">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">Rp {(item.price || 0).toLocaleString('id-ID')}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.book_id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center border rounded-md text-sm hover:bg-gray-100">-</button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.book_id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center border rounded-md text-sm hover:bg-gray-100">+</button>
                  </div>

                  <p className="font-semibold text-[var(--medium-blue)] text-lg min-w-[100px] text-right">
                    Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                  </p>

                  <button className="text-red-500 hover:text-red-700 px-3 py-2 rounded-md" onClick={() => removeFromCart(item.book_id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="border rounded-lg shadow-sm h-fit">
            <div className="p-4 border-b">
              <h2 className="text-lg font-bold text-[var(--dark-blue)]">Order Summary</h2>
            </div>
            <div className="space-y-3 p-4">
              <div className="space-y-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.quantity}x {item.title}
                    </span>
                    <span className="text-foreground font-medium">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground font-medium">Rp {calculateTotal().toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground font-medium">Free</span>
                </div>
              </div>

              <div className="border-t pt-3 flex justify-between">
                <span className="font-bold text-[var(--dark-blue)]">Total</span>
                <span className="text-[var(--medium-blue)] font-bold text-lg">Rp {calculateTotal().toLocaleString('id-ID')}</span>
              </div>

              <button onClick={handleCheckout} disabled={isCheckingOut || cart.length === 0} className="w-full bg-[var(--dark-blue)] text-[var(--near-white)] hover:bg-[var(--dark-blue)]/90 px-4 py-3 rounded-lg font-semibold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                {isCheckingOut ? "Processing..." : "Complete Purchase"}
              </button>

              <Link href="/books">
                <button className="w-full border-[var(--medium-blue)] text-[var(--medium-blue)] hover:bg-[var(--medium-blue)] hover:text-[var(--near-white)] px-4 py-2 rounded-lg border">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}
