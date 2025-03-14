"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useSearchParams, useRouter } from "next/navigation"
import { Settings, X, Edit, Trash, Check, Eye, Clock, UserPlus } from "lucide-react"
import { Dialog, Transition } from "@headlessui/react"
import { Fragment } from "react"
import UserDropdown from "@/components/user-dropdown"

export default function CollaborationsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    permission: "View Only",
  })

  useEffect(() => {
    setIsLoaded(true)

    // Check if we should open the add modal from URL params
    const action = searchParams.get("action")
    if (action === "new") {
      setIsAddModalOpen(true)
      // Clean up the URL
      router.replace("/collaborations")
    }
  }, [searchParams, router])

  // Sample collaborators data
  const [collaborators, setCollaborators] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      permission: "View Only",
      permissionColor: "bg-purple-500",
      dateAdded: "2025-02-15",
      lastActive: "2025-03-04",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      permission: "Edit",
      permissionColor: "bg-teal-500",
      dateAdded: "2025-02-20",
      lastActive: "2025-03-05",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      permission: "View Only",
      permissionColor: "bg-purple-500",
      dateAdded: "2025-03-01",
      lastActive: "2025-03-03",
    },
    {
      id: 4,
      name: "Alice Brown",
      email: "alice@example.com",
      permission: "Edit",
      permissionColor: "bg-teal-500",
      dateAdded: "2025-03-02",
      lastActive: "2025-03-05",
    },
  ])

  const permissionOptions = [
    { name: "View Only", color: "bg-purple-500", icon: Eye },
    { name: "Edit", color: "bg-teal-500", icon: Edit },
  ]

  const handleAddCollaborator = () => {
    const newCollaborator = {
      id: collaborators.length + 1,
      name: formData.name,
      email: formData.email,
      permission: formData.permission,
      permissionColor: formData.permission === "Edit" ? "bg-teal-500" : "bg-purple-500",
      dateAdded: new Date().toISOString().split("T")[0],
      lastActive: new Date().toISOString().split("T")[0],
    }

    setCollaborators([...collaborators, newCollaborator])
    setFormData({
      name: "",
      email: "",
      permission: "View Only",
    })
    setIsAddModalOpen(false)
  }

  const handleDeleteCollaborator = (id) => {
    setCollaborators(collaborators.filter((collab) => collab.id !== id))
  }

  const handleUpdatePermission = (id, newPermission) => {
    setCollaborators(
        collaborators.map((collab) => {
          if (collab.id === id) {
            return {
              ...collab,
              permission: newPermission,
              permissionColor: newPermission === "Edit" ? "bg-teal-500" : "bg-purple-500",
            }
          }
          return collab
        }),
    )
  }

  // Filter collaborators based on search query
  const filteredCollaborators = collaborators.filter((collab) => {
    return (
        collab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        collab.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

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
          <h1 className="text-2xl font-semibold text-white drop-shadow-lg">Collaborations</h1>

          <div className="flex items-center gap-4">
            <Settings className="h-6 w-6 text-white drop-shadow-md" />
            <UserDropdown />
          </div>
        </header>

        {/* Main Content */}
        <main className="relative z-10 p-8 pt-4 overflow-auto h-[calc(100vh-80px)]">
          {/* Controls */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-white text-lg">Manage who can access your opportunities</h2>
              <p className="text-white/70">Invite collaborators and set their permissions</p>
            </div>
            <button
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 transition-colors"
                onClick={() => setIsAddModalOpen(true)}
            >
              <UserPlus className="h-4 w-4" />
              <span>Invite Collaborator</span>
            </button>
          </div>

          {/* Collaborators List */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl overflow-hidden">
            <table className="w-full">
              <thead>
              <tr className="border-b border-white/20">
                <th className="px-6 py-4 text-left text-sm font-medium text-white">Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white">Email</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white">Permission</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white">Date Added</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white">Last Active</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-white">Actions</th>
              </tr>
              </thead>
              <tbody>
              {filteredCollaborators.map((collaborator) => (
                  <tr key={collaborator.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                          {collaborator.name.charAt(0)}
                        </div>
                        <span className="text-white">{collaborator.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white">{collaborator.email}</td>
                    <td className="px-6 py-4">
                      <div className="relative group">
                        <button
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${collaborator.permissionColor} text-white`}
                        >
                          {collaborator.permission === "Edit" ? (
                              <Edit className="h-3 w-3" />
                          ) : (
                              <Eye className="h-3 w-3" />
                          )}
                          {collaborator.permission}
                        </button>
                        <div className="absolute left-0 mt-2 w-36 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 shadow-xl z-10 hidden group-hover:block">
                          {permissionOptions.map((option) => (
                              <button
                                  key={option.name}
                                  className={`w-full text-left px-3 py-2 text-white hover:bg-white/10 rounded-md flex items-center gap-2 ${collaborator.permission === option.name ? "bg-white/5" : ""}`}
                                  onClick={() => handleUpdatePermission(collaborator.id, option.name)}
                              >
                                <option.icon className="h-3 w-3" />
                                {option.name}
                                {collaborator.permission === option.name && <Check className="h-3 w-3 ml-auto" />}
                              </button>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white">{new Date(collaborator.dateAdded).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-white">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-white/70" />
                        {new Date(collaborator.lastActive).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                          className="text-white/70 hover:text-white transition-colors"
                          onClick={() => handleDeleteCollaborator(collaborator.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
              ))}
              {filteredCollaborators.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-white/70">
                      No collaborators found. Invite someone to get started.
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>
        </main>

        {/* Add Collaborator Modal */}
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
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white/10 backdrop-blur-lg p-6 border border-white/20 shadow-xl transition-all">
                    <div className="flex justify-between items-center mb-6">
                      <Dialog.Title as="h3" className="text-xl font-semibold text-white">
                        Invite Collaborator
                      </Dialog.Title>
                      <button
                          onClick={() => setIsAddModalOpen(false)}
                          className="text-white/70 hover:text-white transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-white mb-1">Name</label>
                        <input
                            type="text"
                            className="w-full bg-white/5 border border-white/20 rounded-lg py-2 px-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Collaborator name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full bg-white/5 border border-white/20 rounded-lg py-2 px-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Email address"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-1">Permission</label>
                        <div className="flex gap-3">
                          {permissionOptions.map((option) => (
                              <button
                                  key={option.name}
                                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border ${formData.permission === option.name ? `${option.color} border-transparent` : "border-white/20 hover:bg-white/5"} text-white transition-colors`}
                                  onClick={() => setFormData({ ...formData, permission: option.name })}
                              >
                                <option.icon className="h-4 w-4" />
                                {option.name}
                              </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-4">
                        <button
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                            onClick={() => setIsAddModalOpen(false)}
                        >
                          Cancel
                        </button>
                        <button
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-colors"
                            onClick={handleAddCollaborator}
                        >
                          Send Invitation
                        </button>
                      </div>
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

