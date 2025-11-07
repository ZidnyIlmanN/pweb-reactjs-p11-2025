"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Swal from 'sweetalert2'
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { bookService, genreService } from "@/services/api"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import GenreInput from "@/components/ui/genre-input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface FormData {
  title: string
  writer: string
  publisher: string
  price: string
  stock: string
  genre_name: string
  isbn: string
  description: string
  publication_year: string
  condition: string
}

interface FormErrors {
  [key: string]: string
}

export default function AddBookPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [genres, setGenres] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState("")
  const [errors, setErrors] = useState<FormErrors>({})
  const [isConditionOpen, setIsConditionOpen] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    title: "",
    writer: "",
    publisher: "",
    price: "",
    stock: "",
    genre_name: "",
    isbn: "",
    description: "",
    publication_year: "",
    condition: "New",
  })

  const formatRupiah = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) || 0 : value
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num)
  }

  const parseRupiah = (value: string) => {
    return value.replace(/[^\d]/g, '')
  }

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    fetchGenres()
  }, [])

  const fetchGenres = async () => {
    try {
      const response = await genreService.getGenres()
      const genreList = Array.isArray(response) ? response : response.genres || response.data || []
      setGenres(genreList)
    } catch (err) {
      console.error("Failed to fetch genres:", err)
    }
  }

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {}
    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.writer.trim()) newErrors.writer = "Writer is required"
    if (!formData.publisher.trim()) newErrors.publisher = "Publisher is required"
    if (!formData.price || Number.parseFloat(formData.price) <= 0) newErrors.price = "Valid price is required"
    if (!formData.stock || Number.parseInt(formData.stock) < 0) newErrors.stock = "Valid stock quantity is required"
    if (!formData.genre_name) newErrors.genre_name = "Genre is required"
    return newErrors
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    let processedValue = value

    if (name === 'price') {
      processedValue = parseRupiah(value)
    }

    setFormData((prev) => ({ ...prev, [name]: processedValue }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError("")

    const formErrors = validateForm()
    setErrors(formErrors)
    if (Object.keys(formErrors).length > 0) return

    setIsLoading(true)
    try {
      const bookData: any = {
        title: formData.title,
        writer: formData.writer,
        publisher: formData.publisher,
        price: Number.parseFloat(formData.price),
        stock_quantity: Number.parseInt(formData.stock),
        genre_name: formData.genre_name,
        condition: formData.condition,
      }

      if (formData.isbn) bookData.isbn = formData.isbn
      if (formData.description) bookData.description = formData.description
      if (formData.publication_year) bookData.publication_year = Number.parseInt(formData.publication_year)

      await bookService.createBook(bookData)
      Swal.fire({
        title: 'Success!',
        html: '<dotlottie-player src="https://lottie.host/5b721cce-0ad4-4a1e-821e-f04d382e4b17/BeBOKKAZlj.lottie" background="transparent" speed="1" style="width: 300px; height: 300px; margin: 0 auto;" loop autoplay></dotlottie-player>',
        showConfirmButton: false,
        timer: 2000
      }).then(() => {
        router.push("/books")
      })
    } catch (error: any) {
      console.error("Submit error:", error)
      setApiError(error.response?.data?.message || error.message || "Failed to add book")
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading) return <div className="text-center py-12">Loading...</div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--dark-blue)]">Add New Book</h1>
            <p className="text-muted-foreground mt-1">Fill in the details below to add a new book to the catalog.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/books">
              <button type="button" className="px-4 py-2 rounded-lg text-[var(--dark-blue)] border border-[var(--dark-blue)] hover:bg-[var(--dark-blue)] hover:text-white transition-colors">
                Cancel
              </button>
            </Link>
            <button type="submit" disabled={isLoading} className="px-4 py-2 rounded-lg bg-[var(--dark-blue)] text-[var(--near-white)] hover:bg-[var(--dark-blue)]/90">
              {isLoading ? "Saving..." : "Save Book"}
            </button>
          </div>
        </div>

        {apiError && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive mb-6">{apiError}</div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-[var(--dark-blue)]">Book Details</CardTitle>
                <CardDescription>Provide the main details of the book.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" placeholder="e.g., Atomic Habits" value={formData.title} onChange={handleChange} />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="writer">Writer</Label>
                    <Input id="writer" name="writer" placeholder="e.g., James Clear" value={formData.writer} onChange={handleChange} />
                    {errors.writer && <p className="text-red-500 text-sm mt-1">{errors.writer}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="publisher">Publisher</Label>
                    <Input id="publisher" name="publisher" placeholder="e.g., Penguin Random House" value={formData.publisher} onChange={handleChange} />
                    {errors.publisher && <p className="text-red-500 text-sm mt-1">{errors.publisher}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" placeholder="Provide a short summary of the book..." value={formData.description} onChange={handleChange} rows={6} />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>
              </CardContent>
            </Card>
          </div>

          
          <div className="space-y-8">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-[var(--dark-blue)]">Pricing & Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="price">Price (IDR)</Label>
                    <Input
                        name="price"
                        type="text"
                        placeholder="0"
                        value={formData.price ? formatRupiah(formData.price) : ''}
                        onChange={handleChange}
                    />
                    {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                        name="stock"
                        type="number"
                        placeholder="0"
                        value={formData.stock}
                        onChange={handleChange}
                    />
                    {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-[var(--dark-blue)]">Properties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                    <GenreInput
                        label="Genre"
                        genres={genres.map(g => g.name)}
                        selectedGenres={formData.genre_name ? [formData.genre_name] : []}
                        onChange={(selected: string[]) => setFormData((prev) => ({ ...prev, genre_name: selected[0] || "" }))}
                        error={errors.genre_name}
                        placeholder="Select or type genre"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="condition">Condition</Label>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                onClick={() => setIsConditionOpen(!isConditionOpen)}
                            >
                                {formData.condition}
                                <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </DropdownMenuTrigger>
                        {isConditionOpen && (
                            <DropdownMenuContent className="w-[200px]">
                                <DropdownMenuItem onClick={() => { setFormData((prev) => ({ ...prev, condition: "New" })); setIsConditionOpen(false); }}>
                                    New
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => { setFormData((prev) => ({ ...prev, condition: "Used" })); setIsConditionOpen(false); }}>
                                    Used
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        )}
                    </DropdownMenu>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="publication_year">Publication Year</Label>
                  <input id="publication_year" name="publication_year" type="number" placeholder="e.g., 2018" value={formData.publication_year} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isbn">ISBN</Label>
                  <input id="isbn" name="isbn" placeholder="e.g., 978-0735211292" value={formData.isbn} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}