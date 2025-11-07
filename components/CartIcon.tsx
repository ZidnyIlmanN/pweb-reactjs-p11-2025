"use client"

import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"

export function CartIcon() {
  const { cart, getTotalItems, getTotalPrice } = useCart()
  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsDropdownOpen(false)
        }
      }
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])
  
    const handleMouseEnter = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      setIsDropdownOpen(true)
    }
  
    const handleMouseLeave = () => {
      timeoutRef.current = setTimeout(() => {
        setIsDropdownOpen(false)
      }, 200) // 200ms delay
    }
  
    return (
      <div
        className="relative"
        ref={dropdownRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Link href="/cart">            <Button
              className="relative bg-transparent text-[var(--dark-blue)] hover:bg-gray-200"
              aria-label="Cart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-shopping-cart w-5 h-5"
              >
                <circle cx="8" cy="21" r="1"></circle>
                <circle cx="19" cy="21" r="1"></circle>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[var(--medium-blue)] text-[var(--near-white)] text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-[#DBE2EF] rounded-md shadow-lg py-2 z-50 animate-in slide-in-from-top-2 duration-200">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-6">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" xmlSpace="preserve" className="w-24 h-24 mb-2">
                <path fill="#6E83B7" d="m440 360 62-213H119.373L94.734 40H10v32h59.266L136 361.818V440h304v-32H168v-48z"/>
                <circle fill="#EDEFF1" cx="168" cy="455" r="47"/>
                <circle fill="#D3D3D3" cx="168" cy="455" r="20"/>
                <circle fill="#EDEFF1" cx="366.286" cy="455" r="47"/>
                <circle fill="#D3D3D3" cx="366.286" cy="455" r="20"/>
              </svg>
              <p className="text-sm text-gray-500">Your cart is empty.</p>
            </div>
          ) : (
            <>
              <div className="max-h-60 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between px-4 py-2 hover:bg-gray-50">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[var(--dark-blue)] line-clamp-1">{item.title}</span>
                      <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                    </div>
                    <span className="text-sm font-semibold text-[var(--medium-blue)]">
                      Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#DBE2EF] mt-2 pt-2 px-4 flex justify-between items-center">
                <span className="text-base font-semibold text-[var(--dark-blue)]">Total:</span>
                <span className="text-base font-bold text-[var(--medium-blue)]">Rp {totalPrice.toLocaleString("id-ID")}</span>
              </div>
              <div className="px-4 pt-2">
                <Link href="/cart" onClick={() => setIsDropdownOpen(false)}>
                  <Button className="w-full bg-[var(--dark-blue)] text-[var(--near-white)] hover:bg-[var(--dark-blue)]/90">
                    View Cart
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
