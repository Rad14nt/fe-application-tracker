"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import LoginModal from "@/components/auth/login-modal"
import RegisterModal from "@/components/auth/register-modal"
import { Calendar, Briefcase, Users, FileText, ArrowRight } from "lucide-react"

export default function LandingPage() {
  const router = useRouter()
  const { bypassAuth } = useAuth()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)

  const openLoginModal = () => {
    setIsRegisterModalOpen(false)
    setIsLoginModalOpen(true)
  }

  const openRegisterModal = () => {
    setIsLoginModalOpen(false)
    setIsRegisterModalOpen(true)
  }

  const handleBypass = () => {
    bypassAuth()
    router.push("/dashboard")
  }

  return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop"
              alt="Mountain landscape"
              fill
              className="object-cover opacity-30"
              priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 to-gray-800/70"></div>
        </div>

        {/* Header */}
        <header className="relative z-10 flex items-center justify-between px-8 py-6">
          <div className="flex items-center gap-4">
            <span className="text-2xl font-semibold text-white drop-shadow-lg">Applify</span>
          </div>

          <div className="flex items-center gap-4">
            <button
                onClick={openLoginModal}
                className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              Log in
            </button>
            <button
                onClick={openRegisterModal}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-colors"
            >
              Sign up
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative z-10 container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="max-w-3xl text-center">
            <h1 className="text-5xl font-bold mb-6 leading-tight">Job Application Tracking & Career Management</h1>
            <p className="text-xl text-white/80 mb-10">
              Streamline your job search with our comprehensive application tracking system. Manage opportunities,
              schedule interviews, and collaborate with mentors all in one place.
            </p>

            {/* Demo Access Button */}
            <button
                onClick={handleBypass}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-lg font-medium transition-colors flex items-center justify-center mx-auto"
            >
              <span>Explore Demo Dashboard</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </main>

        {/* Features Section */}
        <section className="relative z-10 bg-white/5 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="bg-white/10 p-6 rounded-xl">
                <div className="bg-blue-500/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Briefcase className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Opportunity Tracking</h3>
                <p className="text-white/70">
                  Track job applications, interviews, and offers in a centralized dashboard with status updates.
                </p>
              </div>
              <div className="bg-white/10 p-6 rounded-xl">
                <div className="bg-green-500/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Interview Calendar</h3>
                <p className="text-white/70">
                  Schedule and manage interviews, follow-ups, and important deadlines with our integrated calendar.
                </p>
              </div>
              <div className="bg-white/10 p-6 rounded-xl">
                <div className="bg-purple-500/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Collaboration</h3>
                <p className="text-white/70">
                  Share opportunities with mentors and coaches to get feedback and improve your application strategy.
                </p>
              </div>
              <div className="bg-white/10 p-6 rounded-xl">
                <div className="bg-amber-500/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-amber-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Document Management</h3>
                <p className="text-white/70">
                  Store and organize resumes, cover letters, and other job application documents in one secure location.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative z-10 py-16">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 md:p-12 backdrop-blur-sm border border-white/10">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-6">Ready to streamline your job search?</h2>
                <p className="text-xl text-white/80 mb-8">
                  Get started with our demo to see how Applify can help you manage your job applications more effectively.
                </p>
                <button
                    onClick={handleBypass}
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-lg font-medium transition-colors"
                >
                  Access Demo Dashboard
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 bg-gray-900 py-8">
          <div className="container mx-auto px-4 text-center text-white/50 text-sm">
            <p>© 2025 Applify. All rights reserved.</p>
          </div>
        </footer>

        {/* Auth Modals */}
        <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            onSwitchToRegister={openRegisterModal}
        />
        <RegisterModal
            isOpen={isRegisterModalOpen}
            onClose={() => setIsRegisterModalOpen(false)}
            onSwitchToLogin={openLoginModal}
        />
      </div>
  )
}

