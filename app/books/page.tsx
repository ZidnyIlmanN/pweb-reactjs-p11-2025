"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { useCart } from "@/context/cart-context"
// import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { bookService, genreService } from "@/services/api"

import Link from "next/link"

import LoadingSpinner from "@/components/ui/loading-spinner"
import Pagination from "@/components/ui/pagination"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"

// Make sure to install sweetalert2: npm install sweetalert2
import Swal from 'sweetalert2'
// Make sure to install @lottiefiles/dotlottie-react: npm install @lottiefiles/dotlottie-react
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

interface Book {
  id: string
  title: string
  writer: string
  publisher: string
  publication_year: number
  description: string
  price: number
  stock_quantity: number
  condition: string
  genre_id: string
  created_at: string
  updated_at: string
  deleted_at?: string
  genre?: string | { name: string }
  image_url?: string
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

export default function BooksPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { addToCart } = useCart()
  // const { toast } = useToast()
  const router = useRouter()
  const [books, setBooks] = useState<Book[]>([])
  const [allBooks, setAllBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [genre, setGenre] = useState("")
  const [condition, setCondition] = useState("")
  const [sortBy, setSortBy] = useState("title_asc")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
    const [genres, setGenres] = useState<any[]>([])
    const [isSheetOpen, setIsSheetOpen] = useState(false)
  
    const handleSortToggle = (field: "title" | "publication_year" | "price") => {
      console.log("handleSortToggle called with field:", field)
      console.log("Current sortBy:", sortBy)

      // Split from the end to handle field names containing underscores
      const lastUnderscoreIndex = sortBy.lastIndexOf("_")
      const currentField = sortBy.substring(0, lastUnderscoreIndex)
      const currentOrder = sortBy.substring(lastUnderscoreIndex + 1)

      let newSortBy: string

      if (field === currentField) {
        // Toggle order if the same field is clicked
        newSortBy = `${field}_${currentOrder === "asc" ? "desc" : "asc"}`
        console.log("Toggling order for same field:", newSortBy)
      } else {
        // Set default order for new field
        // Default for publication_year is desc (newest first)
        const defaultOrder = field === "publication_year" ? "desc" : "asc"
        newSortBy = `${field}_${defaultOrder}`
        console.log("Switching to new field:", newSortBy)
      }

      console.log("Setting sortBy to:", newSortBy)
      setSortBy(newSortBy)
      setPage(1)
    }
  
    const resetFilters = () => {
      setSearch("")
      setGenre("")
      setCondition("")
      setSortBy("title_asc")
      setPage(1)
    }
  
    useEffect(() => {
      if (!authLoading && !isAuthenticated) {
        router.push("/auth/login")
      }
    }, [isAuthenticated, authLoading, router])
  
    useEffect(() => {
      fetchGenres()
    }, [])
  
    useEffect(() => {
      if (isAuthenticated) {
        fetchBooks()
      }
    }, [search, genre, condition, sortBy, isAuthenticated])

    // Separate effect for pagination
    useEffect(() => {
      if (allBooks.length > 0) {
        const sortedBooks = sortBooks(allBooks, sortBy)
        const limit = 12
        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit
        const booksForPage = sortedBooks.slice(startIndex, endIndex)
        setBooks(booksForPage)
      }
    }, [page, allBooks, sortBy])
  
    const fetchGenres = async () => {
      try {
        const response = await genreService.getGenres()
        const genreList = Array.isArray(response)
          ? response
          : response.genres || response.data || []
        setGenres(genreList)
      } catch (err: any) {
        console.error("Failed to fetch genres:", err)
      }
    }
  
    const sortBooks = (books: Book[], sortBy: string) => {
      const lastUnderscoreIndex = sortBy.lastIndexOf("_")
      const field = sortBy.substring(0, lastUnderscoreIndex)
      const order = sortBy.substring(lastUnderscoreIndex + 1)
      const isAsc = order === 'asc'

      return [...books].sort((a, b) => {
        let aValue: any
        let bValue: any

        switch (field) {
          case 'title':
            aValue = a.title.toLowerCase()
            bValue = b.title.toLowerCase()
            break
          case 'publication_year':
            aValue = Number(a.publication_year)
            bValue = Number(b.publication_year)
            break
          case 'price':
            aValue = Number(a.price)
            bValue = Number(b.price)
            break
          default:
            return 0
        }

        if (aValue < bValue) return isAsc ? -1 : 1
        if (aValue > bValue) return isAsc ? 1 : -1
        return 0
      })
    }

    const fetchBooks = async () => {
      setIsLoading(true)
      setError("")
      try {
        // Fetch all books for global sorting by fetching all pages
        const baseParams: any = {
          search,
          limit: 100, // Large limit to minimize requests
        }

        if (genre) {
          baseParams.genre_id = genre
        }
        if (condition) {
          baseParams.condition = condition
        }

        // Parse sortBy into a single sort parameter
        // Only send sort param for fields other than publication_year
        if (sortBy && !sortBy.startsWith('publication_year')) {
          const [field, order] = sortBy.split('_')
          // Convert field names to match API expectations
          const apiFieldMap: { [key: string]: string } = {
            'publication_year': 'publication year'
          }
          const apiField = apiFieldMap[field] || field
          baseParams.sort = `${apiField} ${order}`
        }

        let allFetchedBooks: Book[] = []
        let currentPage = 1

        // Fetch all pages
        while (true) {
          const params = { ...baseParams, page: currentPage }
          console.log("Fetching books with params:", params);
          const response = await bookService.getBooks(params)

          let fetchedBooks: Book[] = []

          if (response && response.data) {
            fetchedBooks = Array.isArray(response.data) ? response.data : [response.data]
          } else if (Array.isArray(response)) {
            fetchedBooks = response
          }

          allFetchedBooks = allFetchedBooks.concat(fetchedBooks)

          // Check if there's a next page
          if (!response?.meta?.next_page) {
            break
          }

          currentPage++
        }

        // Store all books
        setAllBooks(allFetchedBooks)

        // Apply sorting to all books
        const sortedBooks = sortBooks(allFetchedBooks, sortBy)

        // Calculate total pages
        const limit = 12
        const totalBooks = sortedBooks.length
        const calculatedTotalPages = Math.ceil(totalBooks / limit)
        setTotalPages(calculatedTotalPages)

        // Get books for current page
        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit
        const booksForPage = sortedBooks.slice(startIndex, endIndex)
        setBooks(booksForPage)
      } catch (err: any) {
        console.error("fetchBooks error:", err)
        setError(err.response?.data?.message || "Failed to load books")
      } finally {
        setIsLoading(false)
      }
    }
  
    if (authLoading) return <div className="text-center py-12">Loading...</div>
  
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                Browse Books
              </h1>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                Discover our collection of IT literature
              </p>
            </div>
          </div>
  
          
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
                                      <input
                                        placeholder="Search by title or author..."
                                        value={search}
                                        onChange={(e) => {
                                          setSearch(e.target.value)
                                          setPage(1)
                                        }}
                                        className="w-full pl-10 pr-10 py-2 h-10 text-base transition-all duration-300 ease-in-out focus:shadow-md border-[var(--medium-blue)] focus:ring-[var(--medium-blue)] border rounded-md focus:outline-none"
                                      />              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute top-1/2 right-3 -translate-y-1/2 h-6 w-6 text-muted-foreground transition-all duration-300 ease-in-out hover:scale-110"
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
                </button>
              )}
            </div>
  
                        
                        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                          <SheetTrigger>
                                                            <button
                                                              className="flex items-center gap-2 md:w-auto transition-all duration-300 ease-in-out hover:shadow-md bg-[var(--dark-blue)] text-[var(--near-white)] hover:bg-[var(--dark-blue)]/90 px-4 py-2 h-10 rounded-lg"
                                                            >                              <svg
                                className="w-5 h-5 flex-shrink-0"
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
                              <span>Filter</span>
                            </button>
                          </SheetTrigger>
                          <SheetContent className="w-3/4 md:w-1/3 lg:w-1/4 bg-[var(--near-white)] p-0 flex flex-col h-full">
                            <SheetHeader className="border-b p-4">
                              <SheetTitle className="text-[var(--dark-blue)]">Filter & Sort</SheetTitle>
                              {/* SheetClose is now part of SheetHeader in sheet.tsx */}
                            </SheetHeader>
                            <div className="flex-grow overflow-y-auto p-4 grid gap-6">
                              {/* Category Filter */}
                              <div>
                                <h3 className="text-base font-semibold mb-4 text-[var(--dark-blue)]">Category</h3>
                                <div className="flex flex-col gap-2">
                                  <button
                                    onClick={() => {
                                      setGenre("")
                                      setPage(1)
                                      // setIsSheetOpen(false) // No longer needed here
                                    }}
                                    className={`justify-start text-sm text-[var(--dark-blue)] px-3 py-2 rounded-lg ${!genre ? "bg-[var(--medium-blue)] text-[var(--near-white)] hover:bg-[var(--medium-blue)]/90 hover:text-[var(--near-white)]" : "hover:bg-gray-100"}`}
                                  >
                                    All Categories
                                  </button>
                                  {genres.map((g) => (
                                    <button
                                      key={g.id}
                                      onClick={() => {
                                        setGenre(g.id)
                                        setPage(1)
                                        // setIsSheetOpen(false) // No longer needed here
                                      }}
                                      className={`justify-start text-sm text-[var(--dark-blue)] px-3 py-2 rounded-lg ${genre === g.id ? "bg-[var(--medium-blue)] text-[var(--near-white)] hover:bg-[var(--medium-blue)]/90 hover:text-[var(--near-white)]" : "hover:bg-gray-100"}`}
                                    >
                                      {g.name}
                                    </button>
                                  ))}
                                </div>
                              </div>
            
                              <div className="h-px bg-[var(--light-grey-blue)]"/>
            
                              {/* Condition Filter */}
                              <div>
                                <h3 className="text-base font-semibold mb-4 text-[var(--dark-blue)]">Condition</h3>
                                <div className="flex flex-col gap-2">
                                  <button
                                    onClick={() => {
                                      setCondition("")
                                      setPage(1)
                                      // setIsSheetOpen(false) // No longer needed here
                                    }}
                                    className={`justify-start text-sm text-[var(--dark-blue)] px-3 py-2 rounded-lg ${!condition ? "bg-[var(--medium-blue)] text-[var(--near-white)] hover:bg-[var(--medium-blue)]/90 hover:text-[var(--near-white)]" : "hover:bg-gray-100"}`}
                                  >
                                    All Conditions
                                  </button>
                                  <button
                                    onClick={() => {
                                      setCondition("New")
                                      setPage(1)
                                      // setIsSheetOpen(false) // No longer needed here
                                    }}
                                    className={`justify-start text-sm text-[var(--dark-blue)] px-3 py-2 rounded-lg ${condition === "New" ? "bg-[var(--medium-blue)] text-[var(--near-white)] hover:bg-[var(--medium-blue)]/90 hover:text-[var(--near-white)]" : "hover:bg-gray-100"}`}
                                  >
                                    New
                                  </button>
                                  <button
                                    onClick={() => {
                                      setCondition("Used")
                                      setPage(1)
                                      // setIsSheetOpen(false) // No longer needed here
                                    }}
                                    className={`justify-start text-sm text-[var(--dark-blue)] px-3 py-2 rounded-lg ${condition === "Used" ? "bg-[var(--medium-blue)] text-[var(--near-white)] hover:bg-[var(--medium-blue)]/90 hover:text-[var(--near-white)]" : "hover:bg-gray-100"}`}
                                  >
                                    Used
                                  </button>
                                </div>
                              </div>
            
                              <div className="h-px bg-[var(--light-grey-blue)]"/>
            
                              {/* Sort By */}
                              <div>
                                <h3 className="text-base font-semibold mb-4 text-[var(--dark-blue)]">Sort by</h3>
                                <div className="flex flex-col gap-2">
                                                      <button
                                                        onClick={(e) => {
                                                          e.stopPropagation()
                                                          handleSortToggle("title")
                                                          // setIsSheetOpen(false) // No longer needed here
                                                        }}
                                                        className={`justify-between text-sm text-[var(--dark-blue)] flex items-center w-full px-3 py-2 rounded-lg ${sortBy.startsWith("title") ? "bg-[var(--medium-blue)] text-[var(--near-white)] hover:bg-[var(--medium-blue)]/90 hover:text-[var(--near-white)]" : "hover:bg-gray-100"}`}
                                                      >
                                                        <span>Title</span>
                                                        {sortBy.startsWith("title") && (
                                                          <SortIcon order={sortBy.substring(sortBy.lastIndexOf("_") + 1)} textColor={sortBy.startsWith("title") ? "text-[var(--near-white)]" : "text-[var(--dark-blue)]"} />
                                                        )}
                                                      </button>
                                                      <button
                                                        onClick={(e) => {
                                                          e.stopPropagation()
                                                          console.log("Publication Year button clicked")
                                                          handleSortToggle("publication_year")
                                                          // setIsSheetOpen(false) // No longer needed here
                                                        }}
                                                        className={`justify-between text-sm text-[var(--dark-blue)] flex items-center w-full px-3 py-2 rounded-lg ${sortBy.startsWith("publication_year") ? "bg-[var(--medium-blue)] text-[var(--near-white)] hover:bg-[var(--medium-blue)]/90 hover:text-[var(--near-white)]" : "hover:bg-gray-100"}`}
                                                      >
                                                        <span>Publication Year</span>
                                                        {sortBy.startsWith("publication_year") && (
                                                          <SortIcon order={sortBy.substring(sortBy.lastIndexOf("_") + 1)} textColor={sortBy.startsWith("publication_year") ? "text-[var(--near-white)]" : "text-[var(--dark-blue)]"} />
                                                        )}
                                                      </button>
                                                      <button
                                                        onClick={(e) => {
                                                          e.stopPropagation()
                                                          handleSortToggle("price")
                                                          // setIsSheetOpen(false) // No longer needed here
                                                        }}
                                                        className={`justify-between text-sm text-[var(--dark-blue)] flex items-center w-full px-3 py-2 rounded-lg ${sortBy.startsWith("price") ? "bg-[var(--medium-blue)] text-[var(--near-white)] hover:bg-[var(--medium-blue)]/90 hover:text-[var(--near-white)]" : "hover:bg-gray-100"}`}
                                                      >
                                                        <span>Price</span>
                                                        {sortBy.startsWith("price") && (
                                                          <SortIcon order={sortBy.substring(sortBy.lastIndexOf("_") + 1)} textColor={sortBy.startsWith("price") ? "text-[var(--near-white)]" : "text-[var(--dark-blue)]"} />
                                                        )}
                              </button>
                                </div>
                              </div>
                            </div>
                            <SheetFooter className="border-t p-4 flex-row justify-between items-center bg-[var(--near-white)] flex">
                              <button onClick={() => {
                                resetFilters()
                                // setIsSheetOpen(false) // No longer needed here
                              }} className="text-[var(--dark-blue)] hover:text-[var(--dark-blue)]/90 px-3 py-2 rounded-lg">
                                Reset Filters
                              </button>
                              <button onClick={() => setIsSheetOpen(false)} className="bg-[var(--dark-blue)] text-[var(--near-white)] hover:bg-[var(--dark-blue)]/90 px-3 py-2 rounded-lg">Apply</button>
                            </SheetFooter>
                          </SheetContent>
                        </Sheet>
          </div>
      </div>

      {/*  Error Message */}
      {error && (
        <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg text-accent mb-6">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center">
            <LoadingSpinner />
            <p className="mt-4 text-muted-foreground">Loading books...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && books.length === 0 && (
        <div className="text-center py-12">
          <div className="w-64 h-64 mx-auto mb-4">
            <DotLottieReact
              src="https://lottie.host/38e37e50-a663-4a3f-bba3-533e0ff86b38/aB0Kog8IUt.lottie"
              loop
              autoplay
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No books found
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your search filters
          </p>
        </div>
      )}

      {/* Books Grid */}
      {!isLoading && books.length > 0 && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
            {books.map((book) => (
              <div key={book.id} className="group relative h-full border transition-all duration-300 cursor-pointer flex flex-col rounded-lg overflow-hidden">
                {book.condition && (
                  <div
                    className={`absolute z-10 px-2 py-1 rounded-tr-none rounded-bl-none text-xs font-semibold text-white bg-gray-700`}                  >
                    {book.condition}
                  </div>
                )}
                <Link href={`/books/${book.id}`} className="flex flex-col flex-grow">
                  {book.image_url && (
                    <div className="w-full h-48 bg-secondary rounded-t-lg overflow-hidden">
                      <img
                        src={book.image_url || "/placeholder.svg"}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4 pt-8 flex flex-col flex-grow pb-10">
                    <h3 className="font-bold text-[var(--dark-blue)] text-lg line-clamp-2 mb-2 flex-grow">
                      {book.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-1 font-medium">
                      {book.writer}
                    </p>
                    <div className="flex items-center justify-between mt-auto mb-1">
                      <div className="flex flex-col">
                        <span className="font-bold text-[var(--medium-blue)] text-sm">
                          Rp {(book.price || 0).toLocaleString("id-ID")}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 mb-1 rounded ${book.stock_quantity > 0 ? "bg-[var(--medium-blue)]/20 text-[var(--dark-blue)]" : "bg-muted text-muted-foreground"}`}
                        >
                          {book.stock_quantity > 0
                            ? `${book.stock_quantity} in stock`
                            : "Out of Stock"}
                        </span>
                      </div>
                    </div>
                    {book.genre && (
                      <div className="text-center text-xs text-muted-foreground mt-1">
                        {typeof book.genre === 'object' ? book.genre.name : book.genre}
                      </div>
                    )}
                  </div>
                </Link>
                {book.stock_quantity > 0 && (
                  <button
                    onClick={(e) => {
                      e.preventDefault()
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
