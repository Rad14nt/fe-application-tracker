"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Menu,
  Plus,
  CalendarIcon,
  Briefcase,
  Users,
  Home,
  ChevronDown,
  ChevronRight,
  FileText,
  Archive,
  X,
} from "lucide-react"
import { Dialog, Transition } from "@headlessui/react"
import { Fragment } from "react"

// Create a proper forwardRef component for the Dialog

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [expandedSections, setExpandedSections] = useState({
    calendar: true,
    opportunities: true,
    collaborations: true,
    files: true,
  })
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false)

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Sample my calendars
  const myCalendars = [
    { name: "My Calendar", color: "bg-blue-500" },
    { name: "Work", color: "bg-green-500" },
    { name: "Personal", color: "bg-purple-500" },
    { name: "Family", color: "bg-orange-500" },
  ]

  // Sample opportunity statuses
  const opportunityStatuses = [
    { name: "Applied", color: "bg-yellow-500" },
    { name: "Interviewing", color: "bg-blue-500" },
    { name: "Offer", color: "bg-green-500" },
    { name: "Rejected", color: "bg-red-500" },
  ]

  // Sample collaborator types
  const collaboratorTypes = [
    { name: "View Only", color: "bg-purple-500" },
    { name: "Edit", color: "bg-teal-500" },
  ]

  // Sample file categories
  const fileCategories = [
    { name: "Resumes", color: "bg-indigo-500" },
    { name: "Cover Letters", color: "bg-pink-500" },
    { name: "Certificates", color: "bg-amber-500" },
  ]

  const handleQuickAdd = (type: string) => {
    setIsQuickAddOpen(false)

    switch (type) {
      case "event":
        // Navigate to calendar page and set a URL parameter to trigger the add event modal
        router.push("/calendar?action=new")
        break
      case "opportunity":
        // Navigate to opportunities page and set a URL parameter to trigger the add opportunity modal
        router.push("/opportunities?action=new")
        break
      case "collaborator":
        // Navigate to collaborations page and set a URL parameter to trigger the add collaborator modal
        router.push("/collaborations?action=new")
        break
      case "file":
        // Navigate to files page and set a URL parameter to trigger the upload file modal
        router.push("/files?action=new")
        break
    }
  }

  return (
      <>
        <div className="w-64 h-full bg-gray-900 p-4 shadow-xl border-r border-gray-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <Menu className="h-6 w-6 text-white" />
              <span className="text-2xl font-semibold text-white drop-shadow-lg">Lovy-tech</span>
            </div>

            <Link href="/dashboard">
              <div
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-2 ${pathname === "/dashboard" ? "bg-white/20" : "hover:bg-white/10"}`}
              >
                <Home className="h-5 w-5 text-white" />
                <span className="text-white font-medium drop-shadow-lg">Dashboard</span>
              </div>
            </Link>

            {/* Opportunities Section */}
            <div className="mb-4">
              <div
                  className="flex items-center justify-between px-3 py-2 cursor-pointer"
                  onClick={() => toggleSection("opportunities")}
              >
                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-white" />
                  <span className="text-white font-medium drop-shadow-lg">Opportunities</span>
                </div>
                {expandedSections.opportunities ? (
                    <ChevronDown className="h-4 w-4 text-white" />
                ) : (
                    <ChevronRight className="h-4 w-4 text-white" />
                )}
              </div>

              {expandedSections.opportunities && (
                  <div className="ml-8 mt-2 space-y-2">
                    <Link href="/opportunities">
                      <div
                          className={`text-white text-sm py-1 px-2 rounded ${pathname === "/opportunities" && !pathname.includes("archived") ? "bg-white/20" : "hover:bg-white/10"}`}
                      >
                        All Opportunities
                      </div>
                    </Link>
                    <Link href="/opportunities/archived">
                      <div
                          className={`text-white text-sm py-1 px-2 rounded ${pathname === "/opportunities/archived" ? "bg-white/20" : "hover:bg-white/10"}`}
                      >
                        <div className="flex items-center gap-2">
                          <Archive className="h-3 w-3" />
                          <span>Archived</span>
                        </div>
                      </div>
                    </Link>
                    {opportunityStatuses.map((status, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-sm ${status.color}`}></div>
                          <span className="text-white text-sm drop-shadow-lg">{status.name}</span>
                        </div>
                    ))}
                  </div>
              )}
            </div>

            {/* Calendar Section */}
            <div className="mb-4">
              <div
                  className="flex items-center justify-between px-3 py-2 cursor-pointer"
                  onClick={() => toggleSection("calendar")}
              >
                <div className="flex items-center gap-3">
                  <CalendarIcon className="h-5 w-5 text-white" />
                  <span className="text-white font-medium drop-shadow-lg">Calendar</span>
                </div>
                {expandedSections.calendar ? (
                    <ChevronDown className="h-4 w-4 text-white" />
                ) : (
                    <ChevronRight className="h-4 w-4 text-white" />
                )}
              </div>

              {expandedSections.calendar && (
                  <div className="ml-8 mt-2 space-y-2">
                    <Link href="/calendar">
                      <div
                          className={`text-white text-sm py-1 px-2 rounded ${pathname === "/calendar" ? "bg-white/20" : "hover:bg-white/10"}`}
                      >
                        All Events
                      </div>
                    </Link>
                    {myCalendars.map((cal, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-sm ${cal.color}`}></div>
                          <span className="text-white text-sm drop-shadow-lg">{cal.name}</span>
                        </div>
                    ))}
                  </div>
              )}
            </div>

            {/* Files Section */}
            <div className="mb-4">
              <div
                  className="flex items-center justify-between px-3 py-2 cursor-pointer"
                  onClick={() => toggleSection("files")}
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-white" />
                  <span className="text-white font-medium drop-shadow-lg">Files</span>
                </div>
                {expandedSections.files ? (
                    <ChevronDown className="h-4 w-4 text-white" />
                ) : (
                    <ChevronRight className="h-4 w-4 text-white" />
                )}
              </div>

              {expandedSections.files && (
                  <div className="ml-8 mt-2 space-y-2">
                    <Link href="/files">
                      <div
                          className={`text-white text-sm py-1 px-2 rounded ${pathname === "/files" ? "bg-white/20" : "hover:bg-white/10"}`}
                      >
                        All Files
                      </div>
                    </Link>
                    {fileCategories.map((category, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-sm ${category.color}`}></div>
                          <span className="text-white text-sm drop-shadow-lg">{category.name}</span>
                        </div>
                    ))}
                  </div>
              )}
            </div>

            {/* Collaborations Section */}
            <div className="mb-4">
              <div
                  className="flex items-center justify-between px-3 py-2 cursor-pointer"
                  onClick={() => toggleSection("collaborations")}
              >
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-white" />
                  <span className="text-white font-medium drop-shadow-lg">Collaborations</span>
                </div>
                {expandedSections.collaborations ? (
                    <ChevronDown className="h-4 w-4 text-white" />
                ) : (
                    <ChevronRight className="h-4 w-4 text-white" />
                )}
              </div>

              {expandedSections.collaborations && (
                  <div className="ml-8 mt-2 space-y-2">
                    <Link href="/collaborations">
                      <div
                          className={`text-white text-sm py-1 px-2 rounded ${pathname === "/collaborations" ? "bg-white/20" : "hover:bg-white/10"}`}
                      >
                        All Collaborators
                      </div>
                    </Link>
                    {collaboratorTypes.map((type, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-sm ${type.color}`}></div>
                          <span className="text-white text-sm drop-shadow-lg">{type.name}</span>
                        </div>
                    ))}
                  </div>
              )}
            </div>
          </div>

          <div className="mt-auto">
            <button
                className="flex items-center justify-center gap-2 rounded-full bg-blue-500 p-4 text-white w-14 h-14 self-start hover:bg-blue-600 transition-all"
                onClick={() => setIsQuickAddOpen(true)}
            >
              <Plus className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Quick Add Menu - Fixed with proper forwardRef */}
        <Transition appear show={isQuickAddOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={() => setIsQuickAddOpen(false)}>
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/30" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-end justify-start p-4">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0 -translate-x-4"
                    enterTo="opacity-100 translate-x-0"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100 translate-x-0"
                    leaveTo="opacity-0 -translate-x-4"
                >
                  <Dialog.Panel className="w-64 transform overflow-hidden rounded-2xl bg-gray-800 p-5 border border-gray-700 shadow-xl transition-all mb-16 ml-4">
                    <div className="flex justify-between items-center mb-4">
                      <Dialog.Title as="h3" className="text-lg font-medium text-white drop-shadow-lg">
                        Quick Add
                      </Dialog.Title>
                      <button
                          onClick={() => setIsQuickAddOpen(false)}
                          className="text-white/70 hover:text-white transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <button
                          className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/15 rounded-lg text-white transition-colors"
                          onClick={() => handleQuickAdd("event")}
                      >
                        <CalendarIcon className="h-5 w-5 text-blue-400" />
                        <span>New Event</span>
                      </button>
                      <button
                          className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/15 rounded-lg text-white transition-colors"
                          onClick={() => handleQuickAdd("opportunity")}
                      >
                        <Briefcase className="h-5 w-5 text-yellow-400" />
                        <span>New Opportunity</span>
                      </button>
                      <button
                          className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/15 rounded-lg text-white transition-colors"
                          onClick={() => handleQuickAdd("file")}
                      >
                        <FileText className="h-5 w-5 text-indigo-400" />
                        <span>Upload File</span>
                      </button>
                      <button
                          className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/15 rounded-lg text-white transition-colors"
                          onClick={() => handleQuickAdd("collaborator")}
                      >
                        <Users className="h-5 w-5 text-teal-400" />
                        <span>Add Collaborator</span>
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </>
  )
}

