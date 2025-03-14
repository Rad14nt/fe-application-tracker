"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth()
    const router = useRouter()

    // For preview purposes, we'll bypass the authentication check
    // In a real app, you would uncomment the following code
    /*
    useEffect(() => {
      if (!isLoading && !user) {
        router.push("/")
      }
    }, [user, isLoading, router])
    */

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 text-blue-500 animate-spin mx-auto" />
                    <p className="mt-2 text-white">Loading...</p>
                </div>
            </div>
        )
    }

    // Always render children for preview purposes
    return <>{children}</>
}

