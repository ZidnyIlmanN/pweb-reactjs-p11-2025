"use client"

import { useState, useEffect } from "react"
import Swal from 'sweetalert2'
import { useAuth } from "@/context/auth-context"
import { useCart } from "@/context/cart-context"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { bookService } from "@/services/api"
import LoadingSpinner from "@/components/ui/loading-spinner";


interface Genre {
  name: string;
}

interface RelatedBook {
  id: string
  title: string
  writer: string
  publisher: string
  price: number
  stock_quantity: number
  genre_id: string
  publication_year: number
  description: string
  created_at: string
  updated_at: string
  deleted_at?: string
  genre?: string | Genre
  image_url?: string
  condition: string
}

interface Book {
  id: string
  title: string
  writer: string
  publisher: string
  price: number
  stock_quantity: number
  genre_id: string
  publication_year: number
  description: string
  created_at: string
  updated_at: string
  deleted_at?: string
  genre?: string
  image_url?: string
  condition: string
}

export default function BookDetailPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { addToCart } = useCart()
  const router = useRouter()
  const params = useParams()
  const bookId = params.id as string

  const [book, setBook] = useState<Book | null>(null)
  const [relatedBooks, setRelatedBooks] = useState<RelatedBook[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerPage = 6

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    if (isAuthenticated && bookId) {
      fetchBook()
      fetchRelatedBooks()
    }
  }, [bookId, isAuthenticated])

  const fetchBook = async () => {
    setIsLoading(true)
    setError("")
    try {
      const data = await bookService.getBookById(bookId)
      setBook(data)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load book details")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRelatedBooks = async () => {
    try {
      // First get the current book's genre
      const bookResponse = await bookService.getBookById(bookId)
      const genreId = bookResponse.genre_id

      // Fetch all books with the same genre, excluding the current book
      const relatedResponse = await bookService.getBooks({
        genre_id: genreId,
        limit: 100 // Large limit to get all books in the genre
      })

      let relatedBooksData: RelatedBook[] = []
      if (relatedResponse && relatedResponse.data) {
        relatedBooksData = Array.isArray(relatedResponse.data) ? relatedResponse.data : [relatedResponse.data]
      } else if (Array.isArray(relatedResponse)) {
        relatedBooksData = relatedResponse
      }

      // Filter out the current book
      const filteredBooks = relatedBooksData
        .filter(book => book.id !== bookId)

      setRelatedBooks(filteredBooks)
    } catch (err: any) {
      console.error("fetchRelatedBooks error:", err)
      // Don't set error state for related books, just leave empty
    }
  }

  const handleDelete = async () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--dark-blue)',
      cancelButtonColor: 'var(--medium-blue)',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setDeleteLoading(true)
        try {
          await bookService.deleteBook(bookId)
          Swal.fire({
            title: 'Deleted!',
            html: '<dotlottie-player src="https://lottie.host/6ac93cc4-9b34-4776-a34c-5f47e391baf0/LXVQgZFNCb.lottie" background="transparent" speed="1" style="width: 300px; height: 300px; margin: 0 auto;" loop autoplay></dotlottie-player>',
            showConfirmButton: false,
            timer: 2000
          }).then(() => {
            router.push("/books")
          })
        } catch (err: any) {
          setError(err.response?.data?.message || "Failed to delete book")
          setDeleteLoading(false)
        }
      }
    })
  }

  const handleAddToCart = () => {
    if (book) {
      addToCart({
        id: book.id,
        title: book.title,
        price: book.price
      })
      Swal.fire({
        title: "Added to cart!",
        text: `${book.title} has been added to your cart.`,
        icon: "success",
        position: 'top',
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          popup: 'bg-[var(--near-white)] rounded-lg shadow-lg',
          title: 'text-[var(--dark-blue)]',
          htmlContainer: 'text-[var(--dark-blue)]',
        }
      })
    }
  }

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - itemsPerPage))
  }

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(relatedBooks.length - itemsPerPage, prev + itemsPerPage))
  }

  if (authLoading) return <div className="text-center py-12">Loading...</div>
  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <LoadingSpinner />
          <p className="mt-4 text-muted-foreground">Loading book details...</p>
        </div>
      </div>
    )

  if (!book)
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-foreground">Book not found</h2>
          <Link href="/books" className="text-primary hover:underline mt-4 inline-block">
            Back to books
          </Link>
        </div>
      </div>
    )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link href="/books" className="text-[var(--dark-blue)] hover:underline mb-6 inline-flex items-center gap-2">
        ← Back to Books
      </Link>

      {error && <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive mb-6">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Book Image */}
        {book.image_url && (
          <div className="bg-white border rounded-lg shadow-sm overflow-hidden h-96 flex items-center justify-center">
            <img src={book.image_url || "/placeholder.svg"} alt={book.title} className="max-w-full max-h-full object-contain" />
          </div>
        )}

        {/* Book Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-5xl font-bold text-[var(--dark-blue)] mb-3 leading-tight">{book.title}</h1>
            <p className="text-xl text-muted-foreground font-semibold mb-6">{book.writer}</p>

            {/* Price and Stock */}
            <div className="flex items-center gap-4 mb-6">
              <p className="text-4xl font-bold text-[var(--medium-blue)]">Rp {(book.price || 0).toLocaleString('id-ID')}</p>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${book.stock_quantity > 0 ? "bg-[var(--medium-blue)]/20 text-[var(--dark-blue)]" : "bg-muted text-muted-foreground"}`}>
                {book.stock_quantity > 0 ? `${book.stock_quantity} in stock` : "Out of Stock"}
              </span>
            </div>
          </div>

          {/* Book Info */}
          <div className="space-y-4">
            <div className="flex gap-8">
              <div>
                <span className="text-sm text-muted-foreground block">Genre</span>
                <p className="text-foreground font-medium">{book.genre || book.genre_id}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground block">Publisher</span>
                <p className="text-foreground font-medium">{book.publisher}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground block">Year</span>
                <p className="text-foreground font-medium">{book.publication_year}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground block">Condition</span>
                <p className="text-gray-700 font-medium">{book.condition}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            {book.stock_quantity > 0 && (
              <button onClick={handleAddToCart} className="flex-1 bg-[var(--dark-blue)] text-[var(--near-white)] hover:bg-[var(--dark-blue)]/90 py-3 px-4 rounded-lg text-lg font-semibold">
                Add to Cart
              </button>
            )}
            <button onClick={handleDelete} disabled={deleteLoading} className="flex-1 bg-red-500 text-white hover:bg-red-600 py-3 px-4 rounded-lg text-lg font-semibold">
              {deleteLoading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-[var(--dark-blue)] mb-6">Description</h2>
        <p className="text-foreground text-base leading-relaxed whitespace-pre-wrap">{book.description}</p>
      </div>

      {/* Related Books */}
      {relatedBooks.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-[var(--dark-blue)] mb-6">Related Books</h2>
          <div className="relative flex justify-center">
            {/* Navigation Buttons */}
            {currentIndex > 0 && (
              <button
                onClick={handlePrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors duration-200 border border-gray-200"
                aria-label="Previous books"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[var(--dark-blue)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Next Button */}
            {currentIndex + itemsPerPage < relatedBooks.length && (
              <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors duration-200 border border-gray-200"
                aria-label="Next books"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[var(--dark-blue)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
              {relatedBooks.slice(currentIndex, currentIndex + itemsPerPage).map((relatedBook) => (
                <div key={relatedBook.id} className="group relative h-full border transition-all duration-300 cursor-pointer flex flex-col rounded-lg overflow-hidden">
                  {relatedBook.condition && (
                    <div
                      className={`absolute z-10 px-2 py-1 rounded-tr-none rounded-bl-none text-xs font-semibold text-white bg-gray-700`}
                    >
                      {relatedBook.condition}
                    </div>
                  )}
                  <Link href={`/books/${relatedBook.id}`} className="flex flex-col flex-grow">
                    {relatedBook.image_url && (
                      <div className="w-full h-48 bg-secondary rounded-t-lg overflow-hidden">
                        <img
                          src={relatedBook.image_url || "/placeholder.svg"}
                          alt={relatedBook.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4 pt-8 flex flex-col flex-grow pb-10">
                      <h3 className="font-bold text-[var(--dark-blue)] text-lg line-clamp-2 mb-2 flex-grow">
                        {relatedBook.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-1 font-medium">
                        {relatedBook.writer}
                      </p>
                      <div className="flex items-center justify-between mt-auto mb-1">
                        <div className="flex flex-col">
                          <span className="font-bold text-[var(--medium-blue)] text-sm">
                            Rp {(relatedBook.price || 0).toLocaleString("id-ID")}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 mb-1 rounded ${relatedBook.stock_quantity > 0 ? "bg-[var(--medium-blue)]/20 text-[var(--dark-blue)]" : "bg-muted text-muted-foreground"}`}
                          >
                            {relatedBook.stock_quantity > 0
                              ? `${relatedBook.stock_quantity} in stock`
                              : "Out of Stock"}
                          </span>
                        </div>
                      </div>
                      {relatedBook.genre && (
                        <div className="text-center text-xs text-muted-foreground mt-1">
                          {typeof relatedBook.genre === 'object' ? relatedBook.genre.name : relatedBook.genre}
                        </div>
                      )}
                    </div>
                  </Link>
                  {relatedBook.stock_quantity > 0 && (
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        addToCart({
                          id: relatedBook.id,
                          title: relatedBook.title,
                          price: relatedBook.price
                        })
                        Swal.fire({
                          title: "Added to cart!",
                          text: `${relatedBook.title} has been added to your cart.`,
                          icon: "success",
                          position: 'top',
                          toast: true,
                          showConfirmButton: false,
                          timer: 3000,
                          timerProgressBar: true,
                          customClass: {
                            popup: 'bg-[var(--near-white)] rounded-lg shadow-lg',
                            title: 'text-[var(--dark-blue)]',
                            htmlContainer: 'text-[var(--dark-blue)]',
                          }
                        })
                      }}
                      className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-green-500/80 to-transparent text-white text-xs font-semibold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-lg"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      Add to Cart
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}


    </div>
  )
}
