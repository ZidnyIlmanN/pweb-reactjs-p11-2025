"use client"

import { useAuth } from "@/context/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CartIcon } from "@/components/CartIcon"

function TransactionsDropdown({ isOpen, onToggle, onClose }: { isOpen: boolean; onToggle: () => void; onClose: () => void }) {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className={`px-3 py-2 transition-colors duration-200 flex items-center gap-1 relative ${
          pathname.startsWith('/transactions')
            ? 'text-[#3F72AF] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#3F72AF]'
            : 'text-[#112D4E] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#3F72AF] after:transition-all after:duration-200 hover:after:w-full'
        }`}
      >
        My Transactions
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-[#DBE2EF] rounded-md shadow-lg py-1 z-50 animate-in slide-in-from-top-2 duration-200">
          <Link
            href="/transactions"
            className={`block px-4 py-2 text-sm transition-colors ${
              pathname === '/transactions'
                ? 'text-[#3F72AF] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#3F72AF]'
                : 'text-[#112D4E]'
            }`}
            onClick={onClose}
          >
            View Transactions
          </Link>
          <Link
            href="/transactions/statistics"
            className={`block px-4 py-2 text-sm transition-colors ${
              pathname === '/transactions/statistics'
                ? 'text-[#3F72AF] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#3F72AF]'
                : 'text-[#112D4E]'
            }`}
            onClick={onClose}
          >
            Statistics
          </Link>
        </div>
      )}
    </div>
  )
}

export function Navbar() {
  const { isAuthenticated, logout, user, isLoading } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isTransactionsOpen, setIsTransactionsOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  const handleLogout = () => {
    logout()
    router.push("/auth/login")
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <nav className="bg-white border-b border-[#DBE2EF] sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#3F72AF] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">IT</span>
            </div>
            <span className="font-pacifico text-lg hidden sm:inline text-[#112D4E]">IT Literature Shop</span>
          </Link>

          
          <div className="hidden md:flex items-center gap-6 absolute left-1/2 transform -translate-x-1/2">
            {isAuthenticated ? (
              <>
                <Link
                  href="/books"
                  className={`px-3 py-2 transition-colors duration-200 relative ${
                    pathname === '/books' && !pathname.includes('/add') && !pathname.includes('/genre/')
                      ? 'text-[#3F72AF] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#3F72AF]'
                      : 'text-[#112D4E] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#3F72AF] after:transition-all after:duration-200 hover:after:w-full'
                  }`}
                >
                  Browse Books
                </Link>
                <Link
                  href="/books/add"
                  className={`px-3 py-2 transition-colors duration-200 relative ${
                    pathname === '/books/add'
                      ? 'text-[#3F72AF] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#3F72AF]'
                      : 'text-[#112D4E] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#3F72AF] after:transition-all after:duration-200 hover:after:w-full'
                  }`}
                >
                  Add Book
                </Link>
                <TransactionsDropdown
                  isOpen={isTransactionsOpen}
                  onToggle={() => setIsTransactionsOpen(!isTransactionsOpen)}
                  onClose={() => setIsTransactionsOpen(false)}
                />
              </>
            ) : null}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <CartIcon />
                <div className="w-px h-6 bg-[#DBE2EF]"></div>
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-md transition-colors duration-200 hover:bg-[#DBE2EF] focus:outline-none focus:ring-2 focus:ring-[#3F72AF]"
                    aria-label="Profile menu"
                  >
                    <svg className="w-5 h-5 text-[#112D4E]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium text-[#112D4E] hidden sm:inline">{user?.username || 'Profile'}</span>
                    <svg className={`w-4 h-4 text-[#112D4E] transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-[#DBE2EF] rounded-md shadow-lg py-1 z-50 animate-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-2 border-b border-[#DBE2EF]">
                        {user ? (
                          <>
                            <p className="text-sm font-medium text-[#112D4E]">{user.username}</p>
                            <p className="text-xs text-[#3F72AF]">{user.email}</p>
                          </>
                        ) : (
                          <p className="text-sm text-[#3F72AF]">Loading user data...</p>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          handleLogout()
                          setIsProfileOpen(false)
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button className="border-[#3F72AF] text-[#3F72AF] hover:bg-[#3F72AF] hover:text-white">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="bg-[#3F72AF] text-white hover:bg-[#112D4E]">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            {isAuthenticated && <CartIcon />}
            <button className="p-2" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */} 
        {isOpen && (
          <div className="md:hidden py-4 border-t border-[#DBE2EF] bg-white">
            {isAuthenticated ? (
              <div className="space-y-3">
                <Link
                  href="/books"
                  className={`block py-2 px-4 rounded transition-colors relative ${
                    pathname === '/books' && !pathname.includes('/add') && !pathname.includes('/genre/')
                      ? 'text-[#3F72AF] after:absolute after:bottom-0 after:left-4 after:w-[calc(100%-2rem)] after:h-0.5 after:bg-[#3F72AF]'
                      : 'text-[#112D4E] after:absolute after:bottom-0 after:left-4 after:w-0 after:h-0.5 after:bg-[#3F72AF] after:transition-all after:duration-200 hover:after:w-[calc(100%-2rem)]'
                  }`}
                >
                  Browse Books
                </Link>
                <Link
                  href="/books/add"
                  className={`block py-2 px-4 rounded transition-colors relative ${
                    pathname === '/books/add'
                      ? 'text-[#3F72AF] after:absolute after:bottom-0 after:left-4 after:w-[calc(100%-2rem)] after:h-0.5 after:bg-[#3F72AF]'
                      : 'text-[#112D4E] after:absolute after:bottom-0 after:left-4 after:w-0 after:h-0.5 after:bg-[#3F72AF] after:transition-all after:duration-200 hover:after:w-[calc(100%-2rem)]'
                  }`}
                >
                  Add Book
                </Link>
                <div className="space-y-2">
                  <Link
                    href="/transactions"
                    className={`block py-2 px-4 rounded transition-colors relative ${
                      pathname === '/transactions'
                        ? 'text-[#3F72AF] after:absolute after:bottom-0 after:left-4 after:w-[calc(100%-2rem)] after:h-0.5 after:bg-[#3F72AF]'
                        : 'text-[#112D4E] after:absolute after:bottom-0 after:left-4 after:w-0 after:h-0.5 after:bg-[#3F72AF] after:transition-all after:duration-200 hover:after:w-[calc(100%-2rem)]'
                    }`}
                  >
                    View Transactions
                  </Link>
                  <Link
                    href="/transactions/statistics"
                    className={`block py-2 px-4 rounded transition-colors relative ${
                      pathname === '/transactions/statistics'
                        ? 'text-[#3F72AF] after:absolute after:bottom-0 after:left-4 after:w-[calc(100%-2rem)] after:h-0.5 after:bg-[#3F72AF]'
                        : 'text-[#112D4E] after:absolute after:bottom-0 after:left-4 after:w-0 after:h-0.5 after:bg-[#3F72AF] after:transition-all after:duration-200 hover:after:w-[calc(100%-2rem)]'
                    }`}
                  >
                    Statistics
                  </Link>
                </div>
                <div className="pt-3 border-t border-[#DBE2EF]">
                  <div className="relative mb-3" ref={profileRef}>
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center gap-2 w-full px-4 py-2 text-left text-[#112D4E] hover:bg-[#DBE2EF] rounded transition-colors"
                      aria-label="Profile menu"
                    >
                      <svg className="w-4 h-4 text-[#112D4E]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Profile</span>
                    </button>
                    {isProfileOpen && (
                      <div className="absolute left-0 mt-1 w-full bg-white border border-[#DBE2EF] rounded-md shadow-lg py-1 z-50">
                        <div className="px-4 py-2 border-b border-[#DBE2EF]">
                          {user ? (
                            <>
                              <p className="text-sm font-medium text-[#112D4E]">{user.username}</p>
                              <p className="text-xs text-[#3F72AF]">{user.email}</p>
                            </>
                          ) : (
                            <p className="text-sm text-[#3F72AF]">Loading user data...</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={handleLogout}
                    className="w-full mx-4 bg-transparent border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Link href="/auth/login" className="block">
                  <Button
                    className="w-full mx-4 bg-transparent border-[#3F72AF] text-[#3F72AF] hover:bg-[#3F72AF] hover:text-white"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register" className="block">
                  <Button className="w-full mx-4 bg-[#3F72AF] text-white hover:bg-[#112D4E]">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
