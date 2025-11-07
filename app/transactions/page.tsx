"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { orderService } from "@/services/api"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import Link from "next/link"

import Pagination from "@/components/ui/pagination"

import dynamic from "next/dynamic";

const DotLottieReact = dynamic(
  () => import("@lottiefiles/dotlottie-react").then((mod) => mod.DotLottieReact),
  { ssr: false }
);

interface OrderItem {
  id: string
  quantity: number
  order_id: string
  book_id: string
  unit_price?: number
  subtotal?: number
  created_at: string
  updated_at: string
}

interface Order {
  id: string
  user_id: string
  created_at: string | null
  updated_at: string
  order_items: OrderItem[]
  total_price: number
  total_quantity: number
}

const SortIcon = ({ order, textColor }: { order: string; textColor: string }) => {
  if (order === "asc") {
    return (
      <svg
        className={`w-4 h-4 ${textColor}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      </svg>
    )
  }
  return (
    <svg
      className={`w-4 h-4 ${textColor}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  )
}

export default function OrdersPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("created_at_desc")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const handleSortToggle = (field: "id" | "total_price" | "created_at") => {
    const lastUnderscoreIndex = sortBy.lastIndexOf("_")
    const currentField = sortBy.substring(0, lastUnderscoreIndex)
    const currentOrder = sortBy.substring(lastUnderscoreIndex + 1)

    if (field === currentField) {
      setSortBy(`${field}_${currentOrder === "asc" ? "desc" : "asc"}`)
    } else {
      const defaultOrder = field === "created_at" ? "desc" : "asc"
      setSortBy(`${field}_${defaultOrder}`)
    }
    setPage(1)
  }

  const resetFilters = () => {
    setSearch("")
    setSortBy("created_at_desc")
    setPage(1)
  }

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchTransactions()
    }
  }, [page, search, sortBy, isAuthenticated])

  const fetchTransactions = async () => {
    setIsLoading(true)
    setError("")
    try {
      const response = await orderService.getOrders()
      let allOrders = response.data || response || []

      // Ensure created_at is a valid date string or use current date as fallback
      allOrders = allOrders.map((order: any) => ({
        ...order,
        created_at: order.created_at && !isNaN(new Date(order.created_at).getTime())
          ? order.created_at
          : new Date().toISOString(),
      }));

      // Search
      if (search) {
        allOrders = allOrders.filter((order: Order) =>
          order.id.toLowerCase().includes(search.toLowerCase())
        )
      }

      // Sorting
      if (sortBy) {
        const lastUnderscoreIndex = sortBy.lastIndexOf("_")
        const field = sortBy.substring(0, lastUnderscoreIndex)
        const order = sortBy.substring(lastUnderscoreIndex + 1)
        allOrders.sort((a: any, b: any) => {
          let aVal = a[field]
          let bVal = b[field]

          if (field === "id") {
            aVal = aVal?.toLowerCase() || ""
            bVal = bVal?.toLowerCase() || ""
          } else if (field === "total_price") {
            aVal = Number(aVal) || 0
            bVal = Number(bVal) || 0
          } else if (field === "created_at") {
            // Handle null created_at values for sorting
            const aDate = aVal ? new Date(aVal).getTime() : (order === "desc" ? -Infinity : Infinity);
            const bDate = bVal ? new Date(bVal).getTime() : (order === "desc" ? -Infinity : Infinity);

            aVal = aDate;
            bVal = bDate;
          }

          if (order === "desc") {
            return aVal < bVal ? 1 : aVal > bVal ? -1 : 0
          } else {
            return aVal > bVal ? 1 : aVal < bVal ? -1 : 0
          }
        })
      }

      // Pagination
      const limit = 10
      const total = allOrders.length
      const startIndex = (page - 1) * limit
      const paginatedOrders = allOrders.slice(startIndex, startIndex + limit)

      setOrders(paginatedOrders)
      setTotalPages(Math.ceil(total / limit) || 1)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load orders")
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading) return <div className="text-center py-12">Loading...</div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              My Transactions
            </h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Review your purchase history
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-row items-center gap-4 p-4 bg-card border rounded-lg shadow-sm">
          {/* Search Input */}
          <div className="relative flex-grow w-full">
            <svg
              className="w-5 h-5 text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <Input
              placeholder="Search by transaction ID..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="w-full pl-10 pr-10 py-2 text-base transition-all duration-300 ease-in-out focus:shadow-md border-[var(--medium-blue)] focus:ring-[var(--medium-blue)]"
            />
            {search && (
              <Button
                className="absolute top-1/2 right-3 -translate-y-1/2 h-6 w-6 text-muted-foreground transition-all duration-300 ease-in-out hover:scale-110"
                onClick={() => setSearch("")}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>
            )}
          </div>

          {/* Sort Sheet */}
          <Sheet>
            <SheetTrigger>
              <Button
                className="flex items-center gap-2 md:w-auto transition-all duration-300 ease-in-out hover:shadow-md bg-[var(--dark-blue)] text-[var(--near-white)] hover:bg-[var(--dark-blue)]/90"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                <span>Sort</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="w-3/4 md:w-1/3 lg:w-1/4 flex flex-col bg-[var(--near-white)]">
              <SheetHeader className="border-b p-4">
                <SheetTitle className="text-[var(--dark-blue)]">Sort By</SheetTitle>
              </SheetHeader>
              <div className="flex-grow overflow-y-auto p-4 grid gap-6">
                {/* Sort By */}
                <div>
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => handleSortToggle("id")}
                      className={cn(
                        "justify-between text-sm text-[var(--dark-blue)]",
                        sortBy.startsWith("id") ? "bg-[var(--medium-blue)] text-[var(--near-white)] hover:bg-[var(--medium-blue)]/90 hover:text-[var(--near-white)]" : undefined
                      )}
                    >
                      <span>Transaction ID</span>
                      {sortBy.startsWith("id") && (
                        <SortIcon order={sortBy.substring(sortBy.lastIndexOf("_") + 1)} textColor={sortBy.startsWith("id") ? "text-[var(--near-white)]" : "text-[var(--dark-blue)]"} />
                      )}
                    </Button>
                    <Button
                      onClick={() => handleSortToggle("total_price")}
                      className={cn(
                        "justify-between text-sm text-[var(--dark-blue)]",
                        sortBy.startsWith("total_price") ? "bg-[var(--medium-blue)] text-[var(--near-white)] hover:bg-[var(--medium-blue)]/90 hover:text-[var(--near-white)]" : undefined
                      )}
                    >
                      <span>Amount</span>
                      {sortBy.startsWith("total_price") && (
                        <SortIcon order={sortBy.substring(sortBy.lastIndexOf("_") + 1)} textColor={sortBy.startsWith("total_price") ? "text-[var(--near-white)]" : "text-[var(--dark-blue)]"} />
                      )}
                    </Button>
                    <Button
                      onClick={() => handleSortToggle("created_at")}
                      className={cn(
                        "justify-between text-sm text-[var(--dark-blue)]",
                        sortBy.startsWith("created_at") ? "bg-[var(--medium-blue)] text-[var(--near-white)] hover:bg-[var(--medium-blue)]/90 hover:text-[var(--near-white)]" : undefined
                      )}
                    >
                      <span>Date</span>
                      {sortBy.startsWith("created_at") && (
                        <SortIcon order={sortBy.substring(sortBy.lastIndexOf("_") + 1)} textColor={sortBy.startsWith("created_at") ? "text-[var(--near-white)]" : "text-[var(--dark-blue)]"} />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              <SheetFooter className="border-t p-4 flex-row justify-between items-center bg-[var(--near-white)] flex">
                <button onClick={() => {
                  resetFilters()
                  // setIsSheetOpen(false) // No longer needed here
                }} className="text-[var(--dark-blue)] hover:text-[var(--dark-blue)]/90 px-3 py-2 rounded-lg">
                  Reset Sort
                </button>
                <SheetClose>
                  <button className="bg-[var(--dark-blue)] text-[var(--near-white)] hover:bg-[var(--dark-blue)]/90 px-3 py-2 rounded-lg">Apply</button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg text-accent mb-6">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading transactions...</p>
        </div>
      )}

      {/* No Orders Found */}
      {!isLoading && orders.length === 0 && (
        <div className="text-center py-12">
          <div className="w-64 h-64 mx-auto mb-4">
            <DotLottieReact
              src="https://lottie.host/adc7d926-09e0-4e9d-92dc-40b7f2d91b94/Il3vz8BmXk.lottie"
              loop
              autoplay
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No transactions found
          </h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search or filters.
          </p>
          <Link href="/books">
            <Button className="bg-[var(--dark-blue)] text-[var(--near-white)] hover:bg-[var(--dark-blue)]/90">
              Start Shopping
            </Button>
          </Link>
        </div>
      )}

      {/* Orders Table */}
      {!isLoading && orders.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <Card>
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">
                      Total Amount
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-border hover:bg-secondary/50 transition"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-foreground truncate max-w-xs">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        {order.total_quantity || 0}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-[var(--medium-blue)]">
                        Rp {(order.total_price || 0).toLocaleString("id-ID")}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {order.created_at && !isNaN(new Date(order.created_at).getTime())
                          ? new Date(order.created_at).toLocaleDateString("id-ID", {
                              year: 'numeric', month: 'long', day: 'numeric'
                            })
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Link href={`/transactions/${order.id}`}>
                          <Button>
                            View Details
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}

    </div>
  )
}
