"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { useCart } from "@/context/cart-context"
import { useRouter, useParams } from "next/navigation"
import { bookService, genreService } from "@/services/api"

import Link from "next/link"

interface Book {
  id: string
  title: string
  writer: string
  publisher: string
  publication_year: number
  description: string
  price: number
  stock_quantity: number
  genre_id: string
  created_at: string
  updated_at: string
  deleted_at?: string
  genre?: string
  image_url?: string
}

export default function GenreBooksPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { addToCart } = useCart()
  const router = useRouter()
  const params = useParams()
  const genreId = params.id as string

  const [books, setBooks] = useState<Book[]>([])
  const [genreName, setGenreName] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    if (isAuthenticated && genreId) {
      fetchGenreBooks()
      fetchGenreName()
    }
  }, [genreId, isAuthenticated])

  const fetchGenreBooks = async () => {
    setIsLoading(true)
    setError("")
    try {
      const response = await bookService.getBooks({ genre: genreId })
      let booksData = []

      if (Array.isArray(response)) {
        booksData = response
      } else if (response.books) {
        booksData = response.books
      } else if (response.data) {
        booksData = Array.isArray(response.data) ? response.data : [response.data]
      } else {
        booksData = []
      }

      setBooks(booksData)
    } catch (err: any) {
      console.error("fetchGenreBooks error:", err)
      setError(err.response?.data?.message || "Failed to load books")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchGenreName = async () => {
    try {
      const response = await genreService.getGenres()
      const genreList = Array.isArray(response) ? response : response.genres || response.data || []
      const genre = genreList.find((g: any) => (g.id || g) === genreId)
      setGenreName(genre ? (genre.name || genre) : genreId)
    } catch (err: any) {
      console.error("Failed to fetch genre name:", err)
    }
  }

  if (authLoading) return <div className="text-center py-12">Loading...</div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      // Header
      <div className="flex items-center gap-4 mb-8">
        <Link href="/books" className="text-primary hover:underline">
          ← Kembali
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Buku {genreName}</h1>
          <p className="text-muted-foreground mt-1">{books.length} buku ditemukan</p>
        </div>
      </div>

      // Error State
      {error && <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg text-accent mb-6">{error}</div>}

      // Loading State
      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading books...</p>
        </div>
      )}

      // Empty State
      {!isLoading && books.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-foreground mb-2">Tidak ada buku ditemukan</h3>
          <p className="text-muted-foreground">Kategori ini belum memiliki buku</p>
        </div>
      )}

      // Books Grid
      {!isLoading && books.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {books.map((book) => (
            <Link key={book.id} href={`/books/${book.id}`}>
              <div className="h-full hover:shadow-lg transition-shadow cursor-pointer border rounded-lg overflow-hidden">
                {book.image_url && (
                  <div className="w-full h-48 bg-secondary rounded-t-lg overflow-hidden">
                    <img
                      src={book.image_url || "/placeholder.svg"}
                      alt={book.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-bold text-foreground text-lg line-clamp-2 mb-2">{book.title}</h3>
                  <p className="text-sm text-muted-foreground mb-1 font-medium">{book.writer}</p>
                  <p className="text-sm text-muted-foreground mb-1">{book.publisher}</p>
                  <p className="text-xs text-muted-foreground mb-1">{book.publication_year}</p>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-primary text-sm">Rp {(book.price || 0).toLocaleString('id-ID')}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        book.stock_quantity > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {book.stock_quantity > 0 ? `${book.stock_quantity}` : "Out"}
                    </span>
                  </div>
                  {book.stock_quantity > 0 && (
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        addToCart({
                          id: book.id,
                          title: book.title,
                          price: book.price
                        })
                      }}
                      className="w-full text-xs px-3 py-2 rounded-md bg-[var(--dark-blue)] text-[var(--near-white)] hover:bg-[var(--dark-blue)]/90"
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
