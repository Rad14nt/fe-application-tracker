"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  Settings,
  Plus,
  Filter,
  ChevronDown,
  Briefcase,
  CalendarIcon,
  X,
  Edit,
  Trash,
  User,
  Mail,
  Building,
  FileText,
  MapPin,
  ArrowUp,
  ArrowDown,
  Archive,
  AlertTriangle,
} from "lucide-react"
import { Dialog, Transition } from "@headlessui/react"
import { Fragment } from "react"
import dynamic from "next/dynamic"

// Import the UserDropdown component
import UserDropdown from "@/components/user-dropdown"
// Import the Pagination component
import Pagination from "@/components/pagination"

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => (
      <div className="h-[300px] bg-white/10 rounded-lg flex items-center justify-center text-white">Loading map...</div>
  ),
})

export default function OpportunitiesPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedOpportunity, setSelectedOpportunity] = useState(null)
  const [filterStatus, setFilterStatus] = useState("All")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortConfig, setSortConfig] = useState({ key: "applicationDate", direction: "descending" })
  const [isEditMode, setIsEditMode] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [opportunityToDelete, setOpportunityToDelete] = useState(null)
  const [menuOpenFiles, setMenuOpenFiles] = useState({})
  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Form state
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    applicationDate: "",
    location: "",
    coordinates: { lat: 40.7128, lng: -74.006 }, // Default to NYC
    recruiterName: "",
    recruiterEmail: "",
    status: "Applied",
    notes: "",
    collaborators: [],
  })

  useEffect(() => {
    setIsLoaded(true)

    // Check if we should open the add modal from URL params
    const action = searchParams.get("action")
    if (action === "new") {
      setIsAddModalOpen(true)
      // Clean up the URL
      router.replace("/opportunities")
    }
  }, [searchParams, router])

  // Sample opportunities data
  const [opportunities, setOpportunities] = useState([
    {
      id: 1,
      company: "Google",
      role: "Senior Frontend Developer",
      applicationDate: "2025-03-01",
      location: "Mountain View, CA",
      coordinates: { lat: 37.422, lng: -122.0841 },
      recruiterName: "Jane Smith",
      recruiterEmail: "jane.smith@google.com",
      status: "Interviewing",
      statusColor: "bg-blue-500",
      notes: "Had initial screening call. Technical interview scheduled for next week.",
      collaborators: [{ id: 1, name: "John Doe", email: "john@example.com", permission: "View Only" }],
    },
    {
      id: 2,
      company: "Microsoft",
      role: "Product Manager",
      applicationDate: "2025-02-25",
      location: "Redmond, WA",
      coordinates: { lat: 47.674, lng: -122.1215 },
      recruiterName: "Michael Johnson",
      recruiterEmail: "michael.j@microsoft.com",
      status: "Applied",
      statusColor: "bg-yellow-500",
      notes: "Applied through company website. Waiting for response.",
      collaborators: [],
    },
    {
      id: 3,
      company: "Apple",
      role: "UX Designer",
      applicationDate: "2025-02-20",
      location: "Cupertino, CA",
      coordinates: { lat: 37.323, lng: -122.0322 },
      recruiterName: "Sarah Williams",
      recruiterEmail: "s.williams@apple.com",
      status: "Offer",
      statusColor: "bg-green-500",
      notes: "Received offer: $120k base + benefits. Need to respond by March 15.",
      collaborators: [{ id: 2, name: "Jane Smith", email: "jane@example.com", permission: "Edit" }],
    },
    {
      id: 4,
      company: "Amazon",
      role: "Software Engineer",
      applicationDate: "2025-02-15",
      location: "Seattle, WA",
      coordinates: { lat: 47.6062, lng: -122.3321 },
      recruiterName: "Robert Brown",
      recruiterEmail: "r.brown@amazon.com",
      status: "Rejected",
      statusColor: "bg-red-500",
      notes: "Rejected after final round. Feedback: Need more experience with distributed systems.",
      collaborators: [],
    },
    {
      id: 5,
      company: "Netflix",
      role: "Data Scientist",
      applicationDate: "2025-03-03",
      location: "Los Gatos, CA",
      coordinates: { lat: 37.2358, lng: -121.9624 },
      recruiterName: "Emily Davis",
      recruiterEmail: "emily.d@netflix.com",
      status: "Applied",
      statusColor: "bg-yellow-500",
      notes: "Applied through referral from Alex. Initial screening expected next week.",
      collaborators: [],
    },
  ])

  const statusOptions = [
    { name: "Applied", color: "bg-yellow-500" },
    { name: "Interviewing", color: "bg-blue-500" },
    { name: "Offer", color: "bg-green-500" },
    { name: "Rejected", color: "bg-red-500" },
    { name: "On Hold", color: "bg-purple-500" },
  ]

  const collaboratorOptions = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com" },
    { id: 4, name: "Alice Brown", email: "alice@example.com" },
  ]

  const permissionOptions = ["View Only", "Edit"]

  const handleAddOpportunity = () => {
    const newOpportunity = {
      id: opportunities.length + 1,
      ...formData,
      statusColor: statusOptions.find((option) => option.name === formData.status)?.color || "bg-yellow-500",
    }

    setOpportunities([...opportunities, newOpportunity])
    setFormData({
      company: "",
      role: "",
      applicationDate: "",
      location: "",
      coordinates: { lat: 40.7128, lng: -74.006 },
      recruiterName: "",
      recruiterEmail: "",
      status: "Applied",
      notes: "",
      collaborators: [],
    })
    setIsAddModalOpen(false)
  }

  const handleUpdateOpportunity = () => {
    setOpportunities(opportunities.map((opp) => (opp.id === selectedOpportunity.id ? { ...selectedOpportunity } : opp)))
    setIsDetailModalOpen(false)
    setIsEditMode(false)
  }

  const handleViewOpportunity = (opportunity) => {
    setSelectedOpportunity(opportunity)
    setIsDetailModalOpen(true)
    setIsEditMode(false)
  }

  const handleDeleteOpportunity = (id) => {
    setOpportunities(opportunities.filter((opp) => opp.id !== id))
    setIsDetailModalOpen(false)
    setIsDeleteConfirmOpen(false)
    setOpportunityToDelete(null)
  }

  const confirmDelete = (opportunity, e) => {
    e.stopPropagation()
    setOpportunityToDelete(opportunity)
    setIsDeleteConfirmOpen(true)
  }

  const handleEditOpportunity = (opportunity, e) => {
    e.stopPropagation()
    setSelectedOpportunity(opportunity)
    setIsDetailModalOpen(true)
    setIsEditMode(true)
  }

  const handleAddCollaborator = () => {
    if (isEditMode) {
      setSelectedOpportunity({
        ...selectedOpportunity,
        collaborators: [
          ...selectedOpportunity.collaborators,
          {
            id: collaboratorOptions[0].id,
            name: collaboratorOptions[0].name,
            email: collaboratorOptions[0].email,
            permission: "View Only",
          },
        ],
      })
    } else {
      setFormData({
        ...formData,
        collaborators: [
          ...formData.collaborators,
          {
            id: collaboratorOptions[0].id,
            name: collaboratorOptions[0].name,
            email: collaboratorOptions[0].email,
            permission: "View Only",
          },
        ],
      })
    }
  }

  const handleRemoveCollaborator = (index) => {
    if (isEditMode) {
      const updatedCollaborators = [...selectedOpportunity.collaborators]
      updatedCollaborators.splice(index, 1)
      setSelectedOpportunity({
        ...selectedOpportunity,
        collaborators: updatedCollaborators,
      })
    } else {
      const updatedCollaborators = [...formData.collaborators]
      updatedCollaborators.splice(index, 1)
      setFormData({
        ...formData,
        collaborators: updatedCollaborators,
      })
    }
  }

  const handleCollaboratorChange = (index, field, value) => {
    if (isEditMode) {
      const updatedCollaborators = [...selectedOpportunity.collaborators]

      if (field === "user") {
        const selectedUser = collaboratorOptions.find((user) => user.id === Number.parseInt(value))
        updatedCollaborators[index] = {
          ...updatedCollaborators[index],
          id: selectedUser.id,
          name: selectedUser.name,
          email: selectedUser.email,
        }
      } else {
        updatedCollaborators[index] = {
          ...updatedCollaborators[index],
          [field]: value,
        }
      }

      setSelectedOpportunity({
        ...selectedOpportunity,
        collaborators: updatedCollaborators,
      })
    } else {
      const updatedCollaborators = [...formData.collaborators]

      if (field === "user") {
        const selectedUser = collaboratorOptions.find((user) => user.id === Number.parseInt(value))
        updatedCollaborators[index] = {
          ...updatedCollaborators[index],
          id: selectedUser.id,
          name: selectedUser.name,
          email: selectedUser.email,
        }
      } else {
        updatedCollaborators[index] = {
          ...updatedCollaborators[index],
          [field]: value,
        }
      }

      setFormData({
        ...formData,
        collaborators: updatedCollaborators,
      })
    }
  }

  const handleStatusChange = (id, newStatus) => {
    setOpportunities(
        opportunities.map((opp) => {
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

  const handleLocationSelect = (location, coordinates) => {
    if (isEditMode) {
      setSelectedOpportunity({
        ...selectedOpportunity,
        location,
        coordinates,
      })
    } else {
      setFormData({
        ...formData,
        location,
        coordinates,
      })
    }
  }

  // Sorting function
  const requestSort = (key) => {
    let direction = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  // Filter opportunities based on status and search query
  const filteredAndSortedOpportunities = opportunities
      .filter((opp) => {
        // Don't show rejected opportunities on the main page
        if (opp.status === "Rejected") return false

        const matchesStatus = filterStatus === "All" || opp.status === filterStatus
        const matchesSearch =
            opp.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            opp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
            opp.location.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesStatus && matchesSearch
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

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedOpportunities.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const filteredOpportunities = filteredAndSortedOpportunities.slice(startIndex, endIndex)

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
          <h1 className="text-2xl font-semibold text-white drop-shadow-lg">Opportunities</h1>

          {/* Replace this in the header: */}
          {/* <div className="flex items-center gap-4">
          <Settings className="h-6 w-6 text-white drop-shadow-md" />
          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shadow-md">
            U
          </div>
        </div> */}

          {/* With this: */}
          <div className="flex items-center gap-4">
            <Settings className="h-6 w-6 text-white drop-shadow-md" />
            <UserDropdown />
          </div>
        </header>

        {/* Main Content */}
        {/* Update the main content container to ensure proper scrolling: */}
        {/* Replace: */}
        {/* <main className="relative z-10 p-8 pt-4"> */}

        {/* With: */}
        <main className="relative z-10 p-8 pt-4 overflow-auto h-[calc(100vh-80px)]">
          {/* Controls */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              {/* Improved Filter Dropdown */}
              <div className="relative">
                <button
                    className="flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-lg text-white border border-white/20 hover:bg-white/20 transition-colors"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <Filter className="h-4 w-4" />
                  <span>Status: {filterStatus}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {isFilterOpen && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white/15 backdrop-blur-lg rounded-lg border border-white/20 shadow-xl z-10">
                      <div className="p-2">
                        <button
                            className={`w-full text-left px-3 py-2 text-white hover:bg-white/15 rounded-md ${filterStatus === "All" ? "bg-white/10" : ""}`}
                            onClick={() => {
                              setFilterStatus("All")
                              setIsFilterOpen(false)
                            }}
                        >
                          All
                        </button>
                        {statusOptions.map((status) => (
                            <button
                                key={status.name}
                                className={`w-full text-left px-3 py-2 text-white hover:bg-white/15 rounded-md flex items-center gap-2 ${filterStatus === status.name ? "bg-white/10" : ""}`}
                                onClick={() => {
                                  setFilterStatus(status.name)
                                  setIsFilterOpen(false)
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
              <Link href="/opportunities/archived">
                <button className="flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-lg text-white border border-white/20 hover:bg-white/20 transition-colors">
                  <Archive className="h-4 w-4" />
                  <span>View Archived</span>
                </button>
              </Link>
            </div>
            <button
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 transition-colors"
                onClick={() => setIsAddModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span>Add Opportunity</span>
            </button>
          </div>

          {/* Opportunities Table */}
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
                <th className="px-6 py-4 text-left text-sm font-medium text-white">Collaborators</th>
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
                      {opportunity.collaborators.length > 0 ? (
                          <div className="flex -space-x-2">
                            {opportunity.collaborators.map((collaborator, index) => (
                                <div
                                    key={index}
                                    className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs border-2 border-white/20"
                                    title={`${collaborator.name} (${collaborator.permission})`}
                                >
                                  {collaborator.name.charAt(0)}
                                </div>
                            ))}
                          </div>
                      ) : (
                          <span className="text-white/50">None</span>
                      )}
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
                      No opportunities found. Add a new opportunity to get started.
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
            {filteredAndSortedOpportunities.length > itemsPerPage && (
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            )}
          </div>
        </main>

        {/* Add/Edit Opportunity Modal */}
        <Transition appear show={isAddModalOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={() => setIsAddModalOpen(false)}>
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
                    <div className="flex justify-between items-center mb-6">
                      <Dialog.Title as="h3" className="text-xl font-semibold text-white drop-shadow-lg">
                        Add New Opportunity
                      </Dialog.Title>
                      <button
                          onClick={() => setIsAddModalOpen(false)}
                          className="text-white/70 hover:text-white transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-white mb-1 drop-shadow-lg">Company</label>
                          <div className="relative">
                            <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
                            <input
                                type="text"
                                className="w-full bg-white/15 border border-white/20 rounded-lg py-2 pl-10 pr-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Company name"
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white mb-1 drop-shadow-lg">Role</label>
                          <div className="relative">
                            <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
                            <input
                                type="text"
                                className="w-full bg-white/15 border border-white/20 rounded-lg py-2 pl-10 pr-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Job title"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white mb-1 drop-shadow-lg">
                            Application Date
                          </label>
                          <div className="relative">
                            <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
                            <input
                                type="date"
                                className="w-full bg-white/15 border border-white/20 rounded-lg py-2 pl-10 pr-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.applicationDate}
                                onChange={(e) => setFormData({ ...formData, applicationDate: e.target.value })}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white mb-1 drop-shadow-lg">Status</label>
                          <select
                              className="w-full bg-white/15 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={formData.status}
                              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
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
                              className="w-full bg-white/15 border border-white/20 rounded-lg py-2 pl-10 pr-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Company location"
                              value={formData.location}
                              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          />
                        </div>
                        <div className="h-[300px] rounded-lg overflow-hidden">
                          <MapComponent coordinates={formData.coordinates} onLocationSelect={handleLocationSelect} />
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
                                className="w-full bg-white/15 border border-white/20 rounded-lg py-2 pl-10 pr-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Recruiter name"
                                value={formData.recruiterName}
                                onChange={(e) => setFormData({ ...formData, recruiterName: e.target.value })}
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
                                className="w-full bg-white/15 border border-white/20 rounded-lg py-2 pl-10 pr-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Email address"
                                value={formData.recruiterEmail}
                                onChange={(e) => setFormData({ ...formData, recruiterEmail: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-1 drop-shadow-lg">Notes</label>
                        <div className="relative">
                          <FileText className="absolute left-3 top-3 h-4 w-4 text-white/70" />
                          <textarea
                              className="w-full bg-white/15 border border-white/20 rounded-lg py-2 pl-10 pr-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                              placeholder="Add any notes about this opportunity"
                              value={formData.notes}
                              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          ></textarea>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-white drop-shadow-lg">Collaborators</label>
                          <button
                              className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                              onClick={handleAddCollaborator}
                          >
                            <Plus className="h-3 w-3" />
                            Add
                          </button>
                        </div>

                        {formData.collaborators.length > 0 ? (
                            <div className="space-y-3">
                              {formData.collaborators.map((collaborator, index) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <select
                                        className="flex-grow bg-white/15 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={collaborator.id}
                                        onChange={(e) => handleCollaboratorChange(index, "user", e.target.value)}
                                    >
                                      {collaboratorOptions.map((option) => (
                                          <option key={option.id} value={option.id} className="bg-gray-800">
                                            {option.name} ({option.email})
                                          </option>
                                      ))}
                                    </select>
                                    <select
                                        className="w-32 bg-white/15 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={collaborator.permission}
                                        onChange={(e) => handleCollaboratorChange(index, "permission", e.target.value)}
                                    >
                                      {permissionOptions.map((option) => (
                                          <option key={option} value={option} className="bg-gray-800">
                                            {option}
                                          </option>
                                      ))}
                                    </select>
                                    <button
                                        className="p-2 text-white/70 hover:text-white"
                                        onClick={() => handleRemoveCollaborator(index)}
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  </div>
                              ))}
                            </div>
                        ) : (
                            <div className="text-center py-4 text-white/50 border border-dashed border-white/20 rounded-lg">
                              No collaborators added
                            </div>
                        )}
                      </div>

                      <div className="flex justify-end gap-3 pt-4">
                        <button
                            className="px-4 py-2 bg-white/15 hover:bg-white/20 rounded-lg text-white transition-colors"
                            onClick={() => setIsAddModalOpen(false)}
                        >
                          Cancel
                        </button>
                        <button
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-colors"
                            onClick={handleAddOpportunity}
                        >
                          Add Opportunity
                        </button>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>

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
                                  <div className="h-[300px] rounded-lg overflow-hidden">
                                    <MapComponent
                                        coordinates={selectedOpportunity.coordinates}
                                        onLocationSelect={handleLocationSelect}
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
                                  <label className="block text-sm font-medium text-white mb-1 drop-shadow-lg">Notes</label>
                                  <div className="relative">
                                    <FileText className="absolute left-3 top-3 h-4 w-4 text-white/70" />
                                    <textarea
                                        className="w-full bg-white/15 border border-white/20 rounded-lg py-2 pl-10 pr-3 text-white min-h-[100px]"
                                        value={selectedOpportunity.notes}
                                        onChange={(e) =>
                                            setSelectedOpportunity({ ...selectedOpportunity, notes: e.target.value })
                                        }
                                    ></textarea>
                                  </div>
                                </div>

                                <div>
                                  <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-white drop-shadow-lg">
                                      Collaborators
                                    </label>
                                    <button
                                        className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                                        onClick={handleAddCollaborator}
                                    >
                                      <Plus className="h-3 w-3" />
                                      Add
                                    </button>
                                  </div>

                                  {selectedOpportunity.collaborators.length > 0 ? (
                                      <div className="space-y-3">
                                        {selectedOpportunity.collaborators.map((collaborator, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                              <select
                                                  className="flex-grow bg-white/15 border border-white/20 rounded-lg py-2 px-3 text-white"
                                                  value={collaborator.id}
                                                  onChange={(e) => handleCollaboratorChange(index, "user", e.target.value)}
                                              >
                                                {collaboratorOptions.map((option) => (
                                                    <option key={option.id} value={option.id} className="bg-gray-800">
                                                      {option.name} ({option.email})
                                                    </option>
                                                ))}
                                              </select>
                                              <select
                                                  className="w-32 bg-white/15 border border-white/20 rounded-lg py-2 px-3 text-white"
                                                  value={collaborator.permission}
                                                  onChange={(e) => handleCollaboratorChange(index, "permission", e.target.value)}
                                              >
                                                {permissionOptions.map((option) => (
                                                    <option key={option} value={option} className="bg-gray-800">
                                                      {option}
                                                    </option>
                                                ))}
                                              </select>
                                              <button
                                                  className="p-2 text-white/70 hover:text-white"
                                                  onClick={() => handleRemoveCollaborator(index)}
                                              >
                                                <X className="h-4 w-4" />
                                              </button>
                                            </div>
                                        ))}
                                      </div>
                                  ) : (
                                      <div className="text-center py-4 text-white/50 border border-dashed border-white/20 rounded-lg">
                                        No collaborators added
                                      </div>
                                  )}
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
                                      <h4 className="text-sm font-medium text-white/70 mb-1 drop-shadow-lg">Status</h4>
                                      <p className="text-white drop-shadow-lg">
                                  <span
                                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedOpportunity.statusColor} text-white`}
                                  >
                                    {selectedOpportunity.status}
                                  </span>
                                      </p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium text-white/70 mb-1 drop-shadow-lg">Location</h4>
                                      <p className="text-white flex items-center gap-2 drop-shadow-lg">
                                        <MapPin className="h-4 w-4 text-white/70" />
                                        {selectedOpportunity.location}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="space-y-4">
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

                                <div className="mb-6">
                                  <h4 className="text-sm font-medium text-white/70 mb-2 drop-shadow-lg">Collaborators</h4>
                                  {selectedOpportunity.collaborators.length > 0 ? (
                                      <div className="space-y-2">
                                        {selectedOpportunity.collaborators.map((collaborator, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between bg-white/15 border border-white/20 rounded-lg p-3"
                                            >
                                              <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                                  {collaborator.name.charAt(0)}
                                                </div>
                                                <div>
                                                  <p className="text-white font-medium drop-shadow-lg">{collaborator.name}</p>
                                                  <p className="text-white/80 text-sm drop-shadow-lg">{collaborator.email}</p>
                                                </div>
                                              </div>
                                              <span
                                                  className={`px-2 py-1 rounded-full text-xs font-medium ${collaborator.permission === "Edit" ? "bg-teal-500" : "bg-purple-500"} text-white`}
                                              >
                                      {collaborator.permission}
                                    </span>
                                            </div>
                                        ))}
                                      </div>
                                  ) : (
                                      <div className="text-center py-4 text-white/50 border border-dashed border-white/20 rounded-lg">
                                        No collaborators added
                                      </div>
                                  )}
                                </div>

                                <div className="flex justify-between pt-4 border-t border-white/20">
                                  <button
                                      className="px-4 py-2 bg-red-500/80 hover:bg-red-500 rounded-lg text-white transition-colors flex items-center gap-2"
                                      onClick={() => confirmDelete(selectedOpportunity, new Event("click"))}
                                  >
                                    <Trash className="h-4 w-4" />
                                    Delete
                                  </button>
                                  <div className="flex gap-3">
                                    <button
                                        className="px-4 py-2 bg-white/15 hover:bg-white/20 rounded-lg text-white transition-colors flex items-center gap-2"
                                        onClick={() => {
                                          // Schedule interview logic would go here
                                          setIsDetailModalOpen(false)
                                          // This would typically navigate to calendar with pre-filled details
                                          router.push("/calendar")
                                        }}
                                    >
                                      <CalendarIcon className="h-4 w-4" />
                                      Schedule Interview
                                    </button>
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
                      Are you sure you want to delete this opportunity? This action cannot be undone.
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
                          onClick={() => handleDeleteOpportunity(opportunityToDelete.id)}
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

