"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
    // Redirect to dashboard after a short delay
    const timer = setTimeout(() => {
      router.push("/dashboard")
    }, 500)

    return () => clearTimeout(timer)
  }, [router])

  return (
      <div className="flex items-center justify-center h-screen">
        <div className={`text-center opacity-0 ${isLoaded ? "animate-fade-in" : ""}`}>
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to Lovy-tech</h1>
          <p className="text-white/70">Redirecting to dashboard...</p>
        </div>
      </div>
  )
}

