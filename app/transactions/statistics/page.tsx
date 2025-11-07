"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { orderService } from "@/services/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TotalTransactionsIcon } from "@/components/icons/total-transactions-icon"
import { AverageAmountIcon } from "@/components/icons/average-amount-icon"
import { GenreMostIcon } from "@/components/icons/genre-most-icon"
import { GenreLeastIcon } from "@/components/icons/genre-least-icon"

interface Statistics {
  total_transactions: number
  average_amount: number
  genre_most_transactions: string
  genre_least_transactions: string
}

export default function StatisticsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchStatistics()
    }
  }, [isAuthenticated])

  const fetchStatistics = async () => {
    setIsLoading(true)
    setError("")
    try {
      const data = await orderService.getStatistics()
      setStatistics(data)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load statistics")
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
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Sales Statistics</h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">Overview of transaction data</p>
          </div>
          
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg text-accent mb-6">{error}</div>}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading statistics...</p>
        </div>
      )}

      {/* Statistics Cards */}
      {!isLoading && statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <TotalTransactionsIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.total_transactions}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Transaction Amount</CardTitle>
              <AverageAmountIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statistics.average_amount !== undefined && statistics.average_amount !== null
                  ? `Rp ${statistics.average_amount.toLocaleString('id-ID')}`
                  : 'N/A'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Genre with Most Transactions</CardTitle>
              <GenreMostIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statistics.genre_most_transactions || 'No data'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Genre with Least Transactions</CardTitle>
              <GenreLeastIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statistics.genre_least_transactions || 'No data'}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
