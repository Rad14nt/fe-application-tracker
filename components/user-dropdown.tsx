"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { LogOut, Settings } from "lucide-react"

export default function UserDropdown() {
    const { user, logout } = useAuth()
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const handleLogout = () => {
        logout()
        router.push("/")
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shadow-md hover:bg-blue-600 transition-colors"
            >
                {user?.name?.charAt(0) || "U"}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-800 border border-gray-700 z-50">
                    <div className="py-1">
                        <div className="px-4 py-3 border-b border-gray-700">
                            <p className="text-sm font-medium text-white">{user?.name || "User"}</p>
                            <p className="text-xs text-gray-400 truncate">{user?.email || "user@example.com"}</p>
                        </div>
                        <button
                            onClick={() => {
                                setIsOpen(false)
                                // Handle settings
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gray-700"
                        >
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gray-700"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

