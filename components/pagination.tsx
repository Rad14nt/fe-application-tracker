"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

    // Show at most 5 page numbers
    const visiblePages = () => {
        if (totalPages <= 5) return pages

        if (currentPage <= 3) return pages.slice(0, 5)
        if (currentPage >= totalPages - 2) return pages.slice(totalPages - 5)

        return pages.slice(currentPage - 3, currentPage + 2)
    }

    return (
        <div className="flex items-center justify-center mt-4 space-x-1">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-md bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronLeft className="h-4 w-4" />
            </button>

            {currentPage > 3 && totalPages > 5 && (
                <>
                    <button
                        onClick={() => onPageChange(1)}
                        className={`w-8 h-8 rounded-md text-sm ${
                            currentPage === 1 ? "bg-blue-500 text-white" : "bg-white/10 text-white hover:bg-white/20"
                        }`}
                    >
                        1
                    </button>
                    {currentPage > 4 && <span className="text-white/50">...</span>}
                </>
            )}

            {visiblePages().map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`w-8 h-8 rounded-md text-sm ${
                        currentPage === page ? "bg-blue-500 text-white" : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                >
                    {page}
                </button>
            ))}

            {currentPage < totalPages - 2 && totalPages > 5 && (
                <>
                    {currentPage < totalPages - 3 && <span className="text-white/50">...</span>}
                    <button
                        onClick={() => onPageChange(totalPages)}
                        className={`w-8 h-8 rounded-md text-sm ${
                            currentPage === totalPages ? "bg-blue-500 text-white" : "bg-white/10 text-white hover:bg-white/20"
                        }`}
                    >
                        {totalPages}
                    </button>
                </>
            )}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronRight className="h-4 w-4" />
            </button>
        </div>
    )
}

