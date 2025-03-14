import type React from "react"
import ProtectedRoute from "@/components/auth/protected-route"
import Sidebar from "@/components/sidebar"

export default function ProtectedLayout({
                                            children,
                                        }: {
    children: React.ReactNode
}) {
    return (
        <ProtectedRoute>
            <div className="flex h-screen overflow-hidden">
                <Sidebar />
                <main className="flex-1 flex flex-col overflow-hidden">{children}</main>
            </div>
        </ProtectedRoute>
    )
}

