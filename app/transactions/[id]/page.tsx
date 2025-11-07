"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { useRouter, useParams } from "next/navigation"
import { orderService, bookService } from "@/services/api"

import Link from "next/link"

interface OrderItem {
  id: string
  quantity: number
  order_id: string
  book_id: string
  created_at: string
  updated_at: string
  book_title?: string
  book_price?: number
}

interface Order {
  id: string
  user_id: string
  created_at: string | null
  updated_at: string
  order_items: OrderItem[]
}

export default function TransactionDetailPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const transactionId = params.id as string

  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    if (isAuthenticated && transactionId) {
      fetchOrder()
    }
  }, [transactionId, isAuthenticated])

  const fetchOrder = async () => {
    setIsLoading(true)
    setError("")
    try {
      const response = await orderService.getOrderById(transactionId)
      const data = response.data

      // Transform the API response to match our interface
      const orderItemsWithBooks = data.items.map((item: any) => ({
        id: item.book_id, // Use book_id as id since we don't have order_item id
        quantity: item.quantity,
        order_id: data.id,
        book_id: item.book_id,
        created_at: "", // Not provided in response
        updated_at: "", // Not provided in response
        book_title: item.book_title,
        book_price: item.subtotal_price / item.quantity, // Calculate unit price
      }))

      const orderData = {
        id: data.id,
        user_id: data.user_id || "", // Assuming user_id might be in data
        created_at: new Date().toISOString(), // Use current date as fallback since API doesn't provide created_at
        updated_at: data.updated_at || "", // Assuming updated_at might be in data
        order_items: orderItemsWithBooks
      }

      setOrder(orderData)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load order details")
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading) return <div className="text-center py-12">Loading...</div>
  if (isLoading)
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading order details...</p>
      </div>
    )

  if (!order)
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-foreground">Order not found</h2>
          <Link href="/transactions" className="text-[var(--medium-blue)] hover:underline mt-4 inline-block">
            Back to orders
          </Link>
        </div>
      </div>
    )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/transactions" className="text-[var(--medium-blue)] hover:underline mb-6 inline-flex items-center gap-2">
        ← Back to Orders
      </Link>

      {error && <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg text-accent mb-6">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Order Details */}
        <div className="md:col-span-2 border rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <h1 className="text-3xl font-bold text-[var(--dark-blue)]">Order #{order.id}</h1>
          </div>
          <div className="space-y-4 p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Order Date</span>
                <p className="text-foreground font-medium">
                  {order.created_at
                    ? new Date(order.created_at).toLocaleDateString("id-ID", {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })
                    : "N/A"}
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Total Items</span>
                <p className="text-foreground font-medium">{order.order_items.length}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Total Amount</span>
                <p className="text-foreground font-bold text-lg text-[var(--medium-blue)]">
                  Rp {order.order_items.reduce((sum, item) => sum + (item.book_price || 0) * item.quantity, 0).toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="border rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <h2 className="text-lg font-bold text-[var(--dark-blue)]">Summary</h2>
          </div>
          <div className="space-y-3 p-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Items Total:</span>
              <span className="text-foreground font-medium">
                Rp {order.order_items.reduce((sum, item) => sum + (item.book_price || 0) * item.quantity, 0).toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping:</span>
              <span className="text-foreground font-medium">Free</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between">
              <span className="text-foreground font-bold">Order Total:</span>
              <span className="text-[var(--medium-blue)] font-bold text-lg">
                Rp {order.order_items.reduce((sum, item) => sum + (item.book_price || 0) * item.quantity, 0).toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="border rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-[var(--dark-blue)]">Order Items</h2>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {order.order_items && order.order_items.length > 0 ? (
              order.order_items.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-4 border border-border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{item.book_title || "Unknown Book"}</h3>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity} × Rp {(item.book_price || 0).toLocaleString('id-ID')}
                    </p>
                  </div>
                  <p className="text-lg font-bold text-[var(--medium-blue)]">Rp {((item.book_price || 0) * item.quantity).toLocaleString('id-ID')}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">No items found</p>
            )}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-8 justify-center">
        <Link href="/transactions">
          <button className="px-4 py-2 rounded-lg text-[var(--dark-blue)] border border-[var(--dark-blue)] hover:bg-[var(--dark-blue)] hover:text-white transition-colors">Back to Transactions</button>
        </Link>
        <Link href="/books">
          <button className="bg-[var(--dark-blue)] text-[var(--near-white)] hover:bg-[var(--dark-blue)]/90 px-4 py-2 rounded-lg">Continue Shopping</button>
        </Link>
      </div>
    </div>
  )
}
