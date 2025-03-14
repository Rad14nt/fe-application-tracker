"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Settings,
  ChevronLeft,
  Briefcase,
  CalendarIcon,
  X,
  Edit,
  Trash,
  User,
  Mail,
  MapPin,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  Search,
} from "lucide-react"
import { Dialog, Transition } from "@headlessui/react"
import { Fragment } from "react"

// Import the UserDropdown component
import UserDropdown from "@/components/user-dropdown"

export default function ArchivedOpportunitiesPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedOpportunity, setSelectedOpportunity] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortConfig, setSortConfig] = useState({ key: "applicationDate", direction: "descending" })
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [opportunityToDelete, setOpportunityToDelete] = useState(null)
  const [menuOpenFiles, setMenuOpenFiles] = useState({})
  const [isEditMode, setIsEditMode] = useState(false)

  const statusOptions = [
    { name: "Applied", color: "bg-yellow-500" },
    { name: "Interviewing", color: "bg-blue-500" },
    { name: "Offer", color: "bg-green-500" },
    { name: "Rejected", color: "bg-red-500" },
    { name: "Withdrawn", color: "bg-purple-500" },
    { name: "On Hold", color: "bg-gray-500" },
  ]

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Sample archived opportunities data
  const [archivedOpportunities, setArchivedOpportunities] = useState([
    {
      id: 1,
      company: "Facebook",
      role: "Frontend Developer",
      applicationDate: "2024-12-15",
      location: "Menlo Park, CA",
      coordinates: { lat: 37.4829, lng: -122.1486 },
      recruiterName: "David Wilson",
      recruiterEmail: "david.w@facebook.com",
      status: "Rejected",
      statusColor: "bg-red-500",
      notes: "Rejected after technical interview. Feedback: Need more experience with React and state management.",
      collaborators: [],
      archiveDate: "2025-01-20",
      archiveReason: "Position filled",
    },
    {
      id: 2,
      company: "Twitter",
      role: "Software Engineer",
      applicationDate: "2024-11-10",
      location: "San Francisco, CA",
      coordinates: { lat: 37.7749, lng: -122.4194 },
      recruiterName: "Sarah Johnson",
      recruiterEmail: "s.johnson@twitter.com",
      status: "Rejected",
      statusColor: "bg-red-500",
      notes: "Rejected after phone screening. They were looking for someone with more backend experience.",
      collaborators: [],
      archiveDate: "2024-12-05",
      archiveReason: "Not a good fit",
    },
    {
      id: 3,
      company: "LinkedIn",
      role: "UI Designer",
      applicationDate: "2024-10-20",
      location: "Sunnyvale, CA",
      coordinates: { lat: 37.3688, lng: -122.0363 },
      recruiterName: "Michael Brown",
      recruiterEmail: "m.brown@linkedin.com",
      status: "Withdrawn",
      statusColor: "bg-purple-500",
      notes: "Withdrew application after receiving another offer.",
      collaborators: [],
      archiveDate: "2024-11-15",
      archiveReason: "Accepted another offer",
    },
  ])

  const handleViewOpportunity = (opportunity) => {
    setSelectedOpportunity(opportunity)
    setIsDetailModalOpen(true)
    setIsEditMode(false)
  }

  const handleEditOpportunity = (opportunity, e) => {
    e.stopPropagation()
    setSelectedOpportunity(opportunity)
    setIsDetailModalOpen(true)
    setIsEditMode(true)
  }

  const handleUpdateOpportunity = () => {
    setArchivedOpportunities(
        archivedOpportunities.map((opp) => (opp.id === selectedOpportunity.id ? { ...selectedOpportunity } : opp)),
    )
    setIsDetailModalOpen(false)
    setIsEditMode(false)
  }

  const handleDeleteOpportunity = (id) => {
    setArchivedOpportunities(archivedOpportunities.filter((opp) => opp.id !== id))
    setIsDetailModalOpen(false)
    setIsDeleteConfirmOpen(false)
    setOpportunityToDelete(null)
  }

  const confirmDelete = (opportunity, e) => {
    e.stopPropagation()
    setOpportunityToDelete(opportunity)
    setIsDeleteConfirmOpen(true)
  }

  const handleStatusChange = (id, newStatus) => {
    setArchivedOpportunities(
        archivedOpportunities.map((opp) => {
          if (opp.id === id) {
            return {
              ...opp,
              status: newStatus,
              statusColor: statusOptions.find((option) => option.name === newStatus)?.color || "bg-yellow-500",
            }
          }
          return opp
        }),
    )
  }

  // Sorting function
  const requestSort = (key) => {
    let direction = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  // Filter opportunities based on search query
  const filteredOpportunities = archivedOpportunities
      .filter((opp) => {
        return (
            opp.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            opp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
            opp.location.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })
      .sort((a, b) => {
        if (!sortConfig.key) return 0

        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1
        }
        return 0
      })

  const toggleMenu = useCallback((id) => {
    setMenuOpenFiles((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }))
  }, [])

  return (
      <div className="relative min-h-screen w-full overflow-hidden">
        {/* Background Image */}
        <Image
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop"
            alt="Beautiful mountain landscape"
            fill
            className="object-cover"
            priority
        />

        {/* Header */}
        <header className="relative z-10 flex items-center justify-between px-8 py-6">
          <h1 className="text-2xl font-semibold text-white drop-shadow-lg">Archived Opportunities</h1>

          <div className="flex items-center gap-4">
            <Settings className="h-6 w-6 text-white drop-shadow-md" />
            <UserDropdown />
          </div>
        </header>

        {/* Main Content */}
        <main className="relative z-10 p-8 pt-4 overflow-auto h-[calc(100vh-80px)]">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/opportunities">
              <button className="flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-lg text-white border border-white/20 hover:bg-white/20 transition-colors">
                <ChevronLeft className="h-4 w-4" />
                <span>Back to Opportunities</span>
              </button>
            </Link>
          </div>

          {/* Search Input */}
          <div className="mb-6">
            <div className="relative">
              <input
                  type="text"
                  placeholder="Search archived opportunities..."
                  className="w-full bg-white/15 border border-white/20 rounded-lg py-2 px-4 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <Search className="h-5 w-5 text-white/50" />
              </div>
            </div>
          </div>

          {/* Archived Opportunities Table */}
          <div className="bg-white/20 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl overflow-hidden">
            <table className="w-full">
              <thead>
              <tr className="border-b border-white/20">
                <th
                    className="px-6 py-4 text-left text-sm font-medium text-white cursor-pointer"
                    onClick={() => requestSort("company")}
                >
                  <div className="flex items-center gap-1">
                    Company
                    {sortConfig.key === "company" &&
                        (sortConfig.direction === "ascending" ? (
                            <ArrowUp className="h-3 w-3" />
                        ) : (
                            <ArrowDown className="h-3 w-3" />
                        ))}
                  </div>
                </th>
                <th
                    className="px-6 py-4 text-left text-sm font-medium text-white cursor-pointer"
                    onClick={() => requestSort("role")}
                >
                  <div className="flex items-center gap-1">
                    Role
                    {sortConfig.key === "role" &&
                        (sortConfig.direction === "ascending" ? (
                            <ArrowUp className="h-3 w-3" />
                        ) : (
                            <ArrowDown className="h-3 w-3" />
                        ))}
                  </div>
                </th>
                <th
                    className="px-6 py-4 text-left text-sm font-medium text-white cursor-pointer"
                    onClick={() => requestSort("applicationDate")}
                >
                  <div className="flex items-center gap-1">
                    Application Date
                    {sortConfig.key === "applicationDate" &&
                        (sortConfig.direction === "ascending" ? (
                            <ArrowUp className="h-3 w-3" />
                        ) : (
                            <ArrowDown className="h-3 w-3" />
                        ))}
                  </div>
                </th>
                <th
                    className="px-6 py-4 text-left text-sm font-medium text-white cursor-pointer"
                    onClick={() => requestSort("location")}
                >
                  <div className="flex items-center gap-1">
                    Location
                    {sortConfig.key === "location" &&
                        (sortConfig.direction === "ascending" ? (
                            <ArrowUp className="h-3 w-3" />
                        ) : (
                            <ArrowDown className="h-3 w-3" />
                        ))}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white">Archive Date</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-white">Actions</th>
              </tr>
              </thead>
              <tbody>
              {filteredOpportunities.map((opportunity) => (
                  <tr
                      key={opportunity.id}
                      className="border-b border-white/10 hover:bg-white/10 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 text-white" onClick={() => handleViewOpportunity(opportunity)}>
                      {opportunity.company}
                    </td>
                    <td className="px-6 py-4 text-white" onClick={() => handleViewOpportunity(opportunity)}>
                      {opportunity.role}
                    </td>
                    <td className="px-6 py-4 text-white" onClick={() => handleViewOpportunity(opportunity)}>
                      {new Date(opportunity.applicationDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-white" onClick={() => handleViewOpportunity(opportunity)}>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-white/70" />
                        {opportunity.location}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative group">
                        <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleMenu(`status-${opportunity.id}`)
                            }}
                            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${opportunity.statusColor} text-white hover:opacity-90 transition-opacity`}
                        >
                          {opportunity.status}
                        </button>
                        {menuOpenFiles[`status-${opportunity.id}`] && (
                            <div className="absolute left-0 mt-2 w-40 bg-white/15 backdrop-blur-lg rounded-lg border border-white/20 shadow-xl z-10">
                              <div className="p-1">
                                {statusOptions.map((status) => (
                                    <button
                                        key={status.name}
                                        className={`w-full text-left px-3 py-2 text-white hover:bg-white/15 rounded-md flex items-center gap-2 ${opportunity.status === status.name ? "bg-white/10" : ""}`}
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleStatusChange(opportunity.id, status.name)
                                          toggleMenu(`status-${opportunity.id}`)
                                        }}
                                    >
                                      <div className={`w-3 h-3 rounded-full ${status.color}`}></div>
                                      {status.name}
                                    </button>
                                ))}
                              </div>
                            </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white" onClick={() => handleViewOpportunity(opportunity)}>
                      {new Date(opportunity.archiveDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                            className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md text-white transition-colors"
                            onClick={(e) => handleEditOpportunity(opportunity, e)}
                            title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                            className="p-1.5 bg-red-500/30 hover:bg-red-500/50 rounded-md text-white transition-colors"
                            onClick={(e) => confirmDelete(opportunity, e)}
                            title="Delete"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
              ))}
              {filteredOpportunities.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-white/70">
                      No archived opportunities found.
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>
        </main>

        {/* View/Edit Opportunity Modal */}
        <Transition appear show={isDetailModalOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={() => setIsDetailModalOpen(false)}>
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-50" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white/20 backdrop-blur-lg p-6 border border-white/20 shadow-xl transition-all">
                    {selectedOpportunity && (
                        <>
                          <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                              <div
                                  className={`w-10 h-10 ${selectedOpportunity.statusColor} rounded-lg flex items-center justify-center`}
                              >
                                <Briefcase className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <Dialog.Title as="h3" className="text-xl font-semibold text-white drop-shadow-lg">
                                  {isEditMode ? (
                                      <input
                                          type="text"
                                          className="bg-white/15 border border-white/20 rounded-lg py-1 px-2 text-white w-full"
                                          value={selectedOpportunity.company}
                                          onChange={(e) =>
                                              setSelectedOpportunity({ ...selectedOpportunity, company: e.target.value })
                                          }
                                      />
                                  ) : (
                                      selectedOpportunity.company
                                  )}
                                </Dialog.Title>
                                <p className="text-white/80 drop-shadow-lg">
                                  {isEditMode ? (
                                      <input
                                          type="text"
                                          className="bg-white/15 border border-white/20 rounded-lg py-1 px-2 text-white w-full mt-1"
                                          value={selectedOpportunity.role}
                                          onChange={(e) =>
                                              setSelectedOpportunity({ ...selectedOpportunity, role: e.target.value })
                                          }
                                      />
                                  ) : (
                                      selectedOpportunity.role
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {isEditMode ? (
                                  <button
                                      onClick={() => setIsEditMode(false)}
                                      className="text-white/70 hover:text-white transition-colors"
                                  >
                                    <X className="h-5 w-5" />
                                  </button>
                              ) : (
                                  <button
                                      onClick={() => setIsEditMode(true)}
                                      className="text-white/70 hover:text-white transition-colors"
                                  >
                                    <Edit className="h-5 w-5" />
                                  </button>
                              )}
                              <button
                                  onClick={() => setIsDetailModalOpen(false)}
                                  className="text-white/70 hover:text-white transition-colors"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </div>
                          </div>

                          {isEditMode ? (
                              <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-white mb-1 drop-shadow-lg">
                                      Application Date
                                    </label>
                                    <div className="relative">
                                      <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
                                      <input
                                          type="date"
                                          className="w-full bg-white/15 border border-white/20 rounded-lg py-2 pl-10 pr-3 text-white"
                                          value={selectedOpportunity.applicationDate}
                                          onChange={(e) =>
                                              setSelectedOpportunity({ ...selectedOpportunity, applicationDate: e.target.value })
                                          }
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-white mb-1 drop-shadow-lg">Status</label>
                                    <select
                                        className="w-full bg-white/15 border border-white/20 rounded-lg py-2 px-3 text-white"
                                        value={selectedOpportunity.status}
                                        onChange={(e) => {
                                          const newStatus = e.target.value
                                          setSelectedOpportunity({
                                            ...selectedOpportunity,
                                            status: newStatus,
                                            statusColor:
                                                statusOptions.find((option) => option.name === newStatus)?.color ||
                                                "bg-yellow-500",
                                          })
                                        }}
                                    >
                                      {statusOptions.map((option) => (
                                          <option key={option.name} value={option.name} className="bg-gray-800">
                                            {option.name}
                                          </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-white mb-1 drop-shadow-lg">Location</label>
                                  <div className="relative mb-2">
                                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
                                    <input
                                        type="text"
                                        className="w-full bg-white/15 border border-white/20 rounded-lg py-2 pl-10 pr-3 text-white"
                                        value={selectedOpportunity.location}
                                        onChange={(e) =>
                                            setSelectedOpportunity({ ...selectedOpportunity, location: e.target.value })
                                        }
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-white mb-1 drop-shadow-lg">
                                      Recruiter Name
                                    </label>
                                    <div className="relative">
                                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
                                      <input
                                          type="text"
                                          className="w-full bg-white/15 border border-white/20 rounded-lg py-2 pl-10 pr-3 text-white"
                                          value={selectedOpportunity.recruiterName}
                                          onChange={(e) =>
                                              setSelectedOpportunity({ ...selectedOpportunity, recruiterName: e.target.value })
                                          }
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-white mb-1 drop-shadow-lg">
                                      Recruiter Email
                                    </label>
                                    <div className="relative">
                                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
                                      <input
                                          type="email"
                                          className="w-full bg-white/15 border border-white/20 rounded-lg py-2 pl-10 pr-3 text-white"
                                          value={selectedOpportunity.recruiterEmail}
                                          onChange={(e) =>
                                              setSelectedOpportunity({ ...selectedOpportunity, recruiterEmail: e.target.value })
                                          }
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-white mb-1 drop-shadow-lg">
                                    Archive Date
                                  </label>
                                  <div className="relative">
                                    <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
                                    <input
                                        type="date"
                                        className="w-full bg-white/15 border border-white/20 rounded-lg py-2 pl-10 pr-3 text-white"
                                        value={selectedOpportunity.archiveDate}
                                        onChange={(e) =>
                                            setSelectedOpportunity({ ...selectedOpportunity, archiveDate: e.target.value })
                                        }
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-white mb-1 drop-shadow-lg">
                                    Archive Reason
                                  </label>
                                  <input
                                      type="text"
                                      className="w-full bg-white/15 border border-white/20 rounded-lg py-2 px-3 text-white"
                                      value={selectedOpportunity.archiveReason}
                                      onChange={(e) =>
                                          setSelectedOpportunity({ ...selectedOpportunity, archiveReason: e.target.value })
                                      }
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-white mb-1 drop-shadow-lg">Notes</label>
                                  <div className="relative">
                              <textarea
                                  className="w-full bg-white/15 border border-white/20 rounded-lg py-2 px-3 text-white min-h-[100px]"
                                  value={selectedOpportunity.notes}
                                  onChange={(e) =>
                                      setSelectedOpportunity({ ...selectedOpportunity, notes: e.target.value })
                                  }
                              ></textarea>
                                  </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                  <button
                                      className="px-4 py-2 bg-white/15 hover:bg-white/20 rounded-lg text-white transition-colors"
                                      onClick={() => setIsEditMode(false)}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-colors"
                                      onClick={handleUpdateOpportunity}
                                  >
                                    Save Changes
                                  </button>
                                </div>
                              </div>
                          ) : (
                              <>
                                <div className="grid grid-cols-2 gap-6 mb-6">
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="text-sm font-medium text-white/70 mb-1 drop-shadow-lg">
                                        Application Date
                                      </h4>
                                      <p className="text-white flex items-center gap-2 drop-shadow-lg">
                                        <CalendarIcon className="h-4 w-4 text-white/70" />
                                        {new Date(selectedOpportunity.applicationDate).toLocaleDateString()}
                                      </p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium text-white/70 mb-1 drop-shadow-lg">Archive Date</h4>
                                      <p className="text-white flex items-center gap-2 drop-shadow-lg">
                                        <CalendarIcon className="h-4 w-4 text-white/70" />
                                        {new Date(selectedOpportunity.archiveDate).toLocaleDateString()}
                                      </p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium text-white/70 mb-1 drop-shadow-lg">Status</h4>
                                      <p className="text-white drop-shadow-lg">
                                  <span
                                      className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${selectedOpportunity.statusColor} text-white`}
                                  >
                                    {selectedOpportunity.status}
                                  </span>
                                      </p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium text-white/70 mb-1 drop-shadow-lg">
                                        Archive Reason
                                      </h4>
                                      <p className="text-white drop-shadow-lg">{selectedOpportunity.archiveReason}</p>
                                    </div>
                                  </div>
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="text-sm font-medium text-white/70 mb-1 drop-shadow-lg">Location</h4>
                                      <p className="text-white flex items-center gap-2 drop-shadow-lg">
                                        <MapPin className="h-4 w-4 text-white/70" />
                                        {selectedOpportunity.location}
                                      </p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium text-white/70 mb-1 drop-shadow-lg">Recruiter</h4>
                                      <p className="text-white flex items-center gap-2 drop-shadow-lg">
                                        <User className="h-4 w-4 text-white/70" />
                                        {selectedOpportunity.recruiterName}
                                      </p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium text-white/70 mb-1 drop-shadow-lg">Contact</h4>
                                      <p className="text-white flex items-center gap-2 drop-shadow-lg">
                                        <Mail className="h-4 w-4 text-white/70" />
                                        {selectedOpportunity.recruiterEmail}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="mb-6">
                                  <h4 className="text-sm font-medium text-white/70 mb-2 drop-shadow-lg">Notes</h4>
                                  <div className="bg-white/15 border border-white/20 rounded-lg p-4 text-white min-h-[100px] drop-shadow-lg">
                                    {selectedOpportunity.notes || "No notes added."}
                                  </div>
                                </div>

                                <div className="flex justify-between pt-4 border-t border-white/20">
                                  <button
                                      className="px-4 py-2 bg-red-500/80 hover:bg-red-500 rounded-lg text-white transition-colors flex items-center gap-2"
                                      onClick={() => confirmDelete(selectedOpportunity, new Event("click"))}
                                  >
                                    <Trash className="h-4 w-4" />
                                    Delete Permanently
                                  </button>
                                  <div className="flex gap-3">
                                    <button
                                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-colors flex items-center gap-2"
                                        onClick={() => setIsEditMode(true)}
                                    >
                                      <Edit className="h-4 w-4" />
                                      Edit
                                    </button>
                                  </div>
                                </div>
                              </>
                          )}
                        </>
                    )}
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>

        {/* Delete Confirmation Modal */}
        <Transition appear show={isDeleteConfirmOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={() => setIsDeleteConfirmOpen(false)}>
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-50" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white/20 backdrop-blur-lg p-6 border border-white/20 shadow-xl transition-all">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-red-500/20 p-3 rounded-full">
                        <AlertTriangle className="h-6 w-6 text-red-500" />
                      </div>
                      <Dialog.Title as="h3" className="text-xl font-semibold text-white drop-shadow-lg">
                        Confirm Deletion
                      </Dialog.Title>
                    </div>

                    <p className="text-white mb-6 drop-shadow-lg">
                      Are you sure you want to permanently delete this archived opportunity? This action cannot be undone.
                    </p>

                    <div className="flex justify-end gap-3">
                      <button
                          className="px-4 py-2 bg-white/15 hover:bg-white/20 rounded-lg text-white transition-colors"
                          onClick={() => setIsDeleteConfirmOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white transition-colors flex items-center gap-2"
                          onClick={() => opportunityToDelete && handleDeleteOpportunity(opportunityToDelete.id)}
                      >
                        <Trash className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
  )
}

