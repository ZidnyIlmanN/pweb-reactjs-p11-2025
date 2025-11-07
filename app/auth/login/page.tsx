"use client"
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

// Card Component
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white shadow-xl overflow-hidden transition-all duration-300 ${className}`}>
    {children}
  </div>
)

// Input Component (with focus style matching the image)
const Input = ({
  label,
  type,
  placeholder,
  value,
  onChange,
  error,
  showPassword,
  togglePasswordVisibility
}: {
  label?: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  showPassword?: boolean;
  togglePasswordVisibility?: () => void;
}) => (
  <div className="space-y-1">
    {label && (
      <label className="text-sm font-medium" style={{ color: "var(--dark-blue)" }}>{label}</label>
    )}
    <div className="relative">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full py-3 px-4 text-base rounded-lg border-2 bg-white transition duration-200 focus:outline-none focus:ring-2 ${
          error
            ? "border-red-500 ring-red-200"
            : "border-[var(--light-grey-blue)] focus:border-[var(--medium-blue)] focus:ring-[var(--medium-blue)]/50"
        }`}
        style={{ color: "var(--dark-blue)" }}
      />
      {togglePasswordVisibility && (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 flex items-center px-4"
          style={{ color: "var(--dark-blue)/60", "--tw-hover-color": "var(--dark-blue)" } as React.CSSProperties}
        >
          {showPassword ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
          )}
        </button>
      )}
    </div>
    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
  </div>
)

// Button Component
const Button = ({ children, type = "button", disabled = false, className = "" }: {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
}) => (
  <button
    type={type}
    disabled={disabled}
    className={`w-full py-3 px-4 text-center font-semibold rounded-lg transition duration-200 hover:opacity-90 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    style={{ backgroundColor: "var(--medium-blue)", color: "var(--near-white)" }}
  >
    {children}
  </button>
)

// Logo component using inline SVG for the IT Literature Shop brand
const LiteratureLogo = () => (
  <div className="flex items-center space-x-2">
    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--medium-blue)" }}>
      <span className="text-white font-bold text-sm">IT</span>
    </div>
    <span className="text-xl font-pacifico" style={{ color: "var(--dark-blue)" }}>
      IT Literature Shop
    </span>
  </div>
)

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState("")
  const { login, isAuthenticated } = useAuth()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/books")
    }
  }, [isAuthenticated])

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}
    if (!email.trim()) {
      newErrors.email = "Email wajib diisi"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Format email tidak valid"
    }
    if (!password) {
      newErrors.password = "Kata sandi wajib diisi"
    }
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError("")

    const formErrors = validateForm()
    setErrors(formErrors)

    if (Object.keys(formErrors).length > 0) return

    setIsLoading(true)
    try {
      await login(email, password)
      router.push("/books")
    } catch (error: any) {
      setApiError(error.response?.data?.message || "Login gagal. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="flex w-screen min-h-screen">
      {/* Left Side: Branding and Animation (Hidden on mobile, half width on desktop) */}
      <div
        className="hidden lg:flex w-5/12 xl:w-1/2 items-center justify-center p-12"
        style={{
          backgroundImage: `linear-gradient(45deg, var(--dark-blue), var(--medium-blue))`,
          color: "var(--near-white)",
        }}
      >
        <div className="space-y-4 text-center">
          <h2 className="text-4xl font-extrabold">
            Explore the IT World
          </h2>
          <p className="text-lg opacity-90">
            Discover the best IT literature collection for your personal development.
          </p>
          {/* Lottie Animation */}
          <div className="w-full h-96 flex items-center justify-center">
            <DotLottieReact
              src="https://lottie.host/8dcf9eb9-7a5d-4a98-92f7-579966194b1e/mHsqZWzGgM.lottie"
              loop
              autoplay
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div
        className="w-full lg:w-7/12 xl:w-1/2 p-4 sm:p-8 md:p-12 flex flex-col justify-center rounded-l-xl"
        style={{ backgroundColor: "var(--near-white)" }}
      >
        <div className="max-w-sm w-full mx-auto">
          <div className="mb-8">
            <LiteratureLogo />
          </div>

          <h1 className="text-3xl font-extrabold mb-2" style={{ color: "var(--dark-blue)" }}>
            Sign In
          </h1>
          <p className="text-sm mb-6" style={{ color: "var(--dark-blue)", opacity: 0.7 }}>
            Sign in to your account to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {apiError && (
              <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: "var(--light-grey-blue)", color: "var(--dark-blue)" }}>{apiError}</div>
            )}

            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              error={errors.email}
            />

            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              error={errors.password}
              showPassword={showPassword}
              togglePasswordVisibility={togglePasswordVisibility}
            />

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Processing..." : "Sign In"}
            </Button>

            <div className="pt-4 text-center text-sm">
              <span style={{ color: "var(--dark-blue)", opacity: 0.7 }}>Don't have an account? </span>
              <Link href="/auth/register" className="font-semibold hover:underline" style={{ color: "var(--medium-blue)" }}>
                Register here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Card>
  )
}
