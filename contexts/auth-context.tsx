"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type User = {
    id: string
    name: string
    email: string
    image?: string
}

type AuthContextType = {
    user: User | null
    isLoading: boolean
    login: (email: string, password: string) => Promise<void>
    register: (name: string, email: string, password: string) => Promise<void>
    loginWithGoogle: () => Promise<void>
    loginWithApple: () => Promise<void>
    logout: () => void
    bypassAuth: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Check if user is logged in on mount
    useEffect(() => {
        // Simulate checking for a stored session
        const checkAuth = () => {
            const storedUser = localStorage.getItem("applify-user")
            if (storedUser) {
                setUser(JSON.parse(storedUser))
            }
            setIsLoading(false)
        }

        checkAuth()
    }, [])

    // Login function
    const login = async (email: string, password: string) => {
        setIsLoading(true)
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000))

            // Mock user data
            const userData: User = {
                id: "user-1",
                name: "Demo User",
                email: email,
                image: "/placeholder.svg?height=40&width=40",
            }

            setUser(userData)
            localStorage.setItem("applify-user", JSON.stringify(userData))
        } catch (error) {
            console.error("Login failed:", error)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    // Register function
    const register = async (name: string, email: string, password: string) => {
        setIsLoading(true)
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000))

            // Mock user data
            const userData: User = {
                id: "user-1",
                name: name,
                email: email,
                image: "/placeholder.svg?height=40&width=40",
            }

            setUser(userData)
            localStorage.setItem("applify-user", JSON.stringify(userData))
        } catch (error) {
            console.error("Registration failed:", error)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    // Social login functions
    const loginWithGoogle = async () => {
        setIsLoading(true)
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000))

            // Mock user data
            const userData: User = {
                id: "google-user-1",
                name: "Google User",
                email: "google.user@example.com",
                image: "/placeholder.svg?height=40&width=40",
            }

            setUser(userData)
            localStorage.setItem("applify-user", JSON.stringify(userData))
        } catch (error) {
            console.error("Google login failed:", error)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const loginWithApple = async () => {
        setIsLoading(true)
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000))

            // Mock user data
            const userData: User = {
                id: "apple-user-1",
                name: "Apple User",
                email: "apple.user@example.com",
                image: "/placeholder.svg?height=40&width=40",
            }

            setUser(userData)
            localStorage.setItem("applify-user", JSON.stringify(userData))
        } catch (error) {
            console.error("Apple login failed:", error)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    // Logout function
    const logout = () => {
        setUser(null)
        localStorage.removeItem("applify-user")
    }

    // Bypass auth for testing - this will now work properly
    const bypassAuth = () => {
        const userData: User = {
            id: "bypass-user",
            name: "Bypass User",
            email: "bypass@example.com",
            image: "/placeholder.svg?height=40&width=40",
        }

        setUser(userData)
        localStorage.setItem("applify-user", JSON.stringify(userData))
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                login,
                register,
                loginWithGoogle,
                loginWithApple,
                logout,
                bypassAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

