"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import {
  Settings,
  Plus,
  Folder,
  File,
  Upload,
  X,
  Download,
  Share,
  Trash,
  MoreHorizontal,
  ChevronRight,
  AlertTriangle,
} from "lucide-react"
import { Dialog, Transition } from "@headlessui/react"
import { Fragment } from "react"
// Import the UserDropdown component
import UserDropdown from "@/components/user-dropdown"

export default function FilesPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeCategory, setActiveCategory] = useState("all")
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [fileToDelete, setFileToDelete] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [menuOpenFiles, setMenuOpenFiles] = useState({})

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Sample file categories
  const categories = [
    { id: "all", name: "All Files", count: 12, icon: Folder },
    { id: "dossier", name: "Application Dossier", count: 1, icon: Folder },
    { id: "cv", name: "CV", count: 3, icon: Folder },
    { id: "cover", name: "Cover Letter", count: 3, icon: Folder },
    { id: "certificates", name: "Work Certificates", count: 2, icon: Folder },
    { id: "certifications", name: "Certifications", count: 3, icon: Folder },
  ]

  // Sample files data
  const allFiles = [
    {
      id: 1,
      name: "Application_Dossier_2025.pdf",
      category: "dossier",
      size: "4.2 MB",
      type: "PDF",
      lastModified: "2025-03-01",
      color: "bg-purple-500",
    },
    {
      id: 2,
      name: "Resume_Software_Engineer.pdf",
      category: "cv",
      size: "1.2 MB",
      type: "PDF",
      lastModified: "2025-02-28",
      color: "bg-blue-500",
    },
    {
      id: 3,
      name: "Resume_Product_Manager.pdf",
      category: "cv",
      size: "1.1 MB",
      type: "PDF",
      lastModified: "2025-02-25",
      color: "bg-blue-500",
    },
    {
      id: 4,
      name: "Resume_UX_Designer.pdf",
      category: "cv",
      size: "1.3 MB",
      type: "PDF",
      lastModified: "2025-02-20",
      color: "bg-blue-500",
    },
    {
      id: 5,
      name: "Cover_Letter_Google.docx",
      category: "cover",
      size: "0.8 MB",
      type: "DOCX",
      lastModified: "2025-02-28",
      color: "bg-green-500",
    },
    {
      id: 6,
      name: "Cover_Letter_Microsoft.docx",
      category: "cover",
      size: "0.7 MB",
      type: "DOCX",
      lastModified: "2025-02-25",
      color: "bg-green-500",
    },
    {
      id: 7,
      name: "Cover_Letter_Apple.docx",
      category: "cover",
      size: "0.9 MB",
      type: "DOCX",
      lastModified: "2025-02-20",
      color: "bg-green-500",
    },
    {
      id: 8,
      name: "Work_Certificate_ABC_Corp.pdf",
      category: "certificates",
      size: "2.1 MB",
      type: "PDF",
      lastModified: "2025-01-15",
      color: "bg-yellow-500",
    },
    {
      id: 9,
      name: "Work_Certificate_XYZ_Inc.pdf",
      category: "certificates",
      size: "1.8 MB",
      type: "PDF",
      lastModified: "2025-01-10",
      color: "bg-yellow-500",
    },
    {
      id: 10,
      name: "AWS_Certification.pdf",
      category: "certifications",
      size: "1.5 MB",
      type: "PDF",
      lastModified: "2024-12-20",
      color: "bg-red-500",
    },
    {
      id: 11,
      name: "Google_Cloud_Certification.pdf",
      category: "certifications",
      size: "1.6 MB",
      type: "PDF",
      lastModified: "2024-11-15",
      color: "bg-red-500",
    },
    {
      id: 12,
      name: "Microsoft_Azure_Certification.pdf",
      category: "certifications",
      size: "1.7 MB",
      type: "PDF",
      lastModified: "2024-10-10",
      color: "bg-red-500",
    },
  ]

  // Filter files based on active category and search query
  const filteredFiles = allFiles.filter((file) => {
    const matchesCategory = activeCategory === "all" || file.category === activeCategory
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleDeleteFile = (id) => {
    // In a real app, this would delete the file
    console.log(`Deleting file with ID: ${id}`)
    setIsDeleteConfirmOpen(false)
    setFileToDelete(null)
  }

  const confirmDelete = (file) => {
    setFileToDelete(file)
    setIsDeleteConfirmOpen(true)
  }

  const toggleMenu = useCallback((fileId) => {
    setMenuOpenFiles((prevState) => ({
      ...prevState,
      [fileId]: !prevState[fileId],
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
          <h1 className="text-2xl font-semibold text-white drop-shadow-lg">Files</h1>

          {/* Replace this in the header:
        <div className="flex items-center gap-4">
          <Settings className="h-6 w-6 text-white drop-shadow-md" />
          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shadow-md">
            U
          </div>
        </div>

        // With this: */}
          <div className="flex items-center gap-4">
            <Settings className="h-6 w-6 text-white drop-shadow-md" />
            <UserDropdown />
          </div>
        </header>

        {/* Main Content */}
        {/* Also, update the main content container to ensure proper scrolling:
      // Replace:
      <main className="relative z-10 p-8 pt-4 grid grid-cols-12 gap-6">

      // With: */}
        <main className="relative z-10 p-8 pt-4 grid grid-cols-12 gap-6 overflow-auto h-[calc(100vh-80px)]">
          {/* Left Sidebar - Categories */}
          <div className="col-span-3 bg-white/20 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6 drop-shadow-lg">Categories</h2>
            <div className="space-y-2">
              {categories.map((category) => (
                  <button
                      key={category.id}
                      className={`w-full flex items-center justify-between p-3 rounded-lg text-white transition-colors ${
                          activeCategory === category.id ? "bg-white/20" : "hover:bg-white/10"
                      }`}
                      onClick={() => setActiveCategory(category.id)}
                  >
                    <div className="flex items-center gap-3">
                      <category.icon className="h-5 w-5 text-white/70" />
                      <span className="font-medium drop-shadow-lg">{category.name}</span>
                    </div>
                    <span className="text-sm bg-white/10 px-2 py-0.5 rounded-full">{category.count}</span>
                  </button>
              ))}
            </div>
          </div>

          {/* Main Content - Files */}
          <div className="col-span-6 bg-white/20 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white drop-shadow-lg">
                {categories.find((c) => c.id === activeCategory)?.name || "All Files"}
              </h2>
              <button
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 transition-colors"
                  onClick={() => setIsUploadModalOpen(true)}
              >
                <Upload className="h-4 w-4" />
                <span>Upload</span>
              </button>
            </div>

            {/* Files Grid */}
            <div className="grid grid-cols-2 gap-4 overflow-y-auto flex-grow">
              {filteredFiles.length > 0 ? (
                  filteredFiles.map((file) => {
                    return (
                        <div
                            key={file.id}
                            className="bg-white/10 border border-white/10 rounded-lg p-4 hover:bg-white/15 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 ${file.color} rounded-lg`}>
                                <File className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <h3 className="text-white font-medium truncate max-w-[180px] drop-shadow-lg">{file.name}</h3>
                                <p className="text-white/70 text-sm drop-shadow-lg">
                                  {file.type} • {file.size}
                                </p>
                              </div>
                            </div>
                            <div className="relative">
                              <button
                                  className="text-white/70 hover:text-white transition-colors"
                                  onClick={() => toggleMenu(file.id)}
                              >
                                <MoreHorizontal className="h-5 w-5" />
                              </button>
                              {menuOpenFiles[file.id] && (
                                  <div className="absolute right-0 top-full mt-1 w-40 bg-white/15 backdrop-blur-lg rounded-lg border border-white/20 shadow-xl z-10">
                                    <div className="p-1">
                                      <button className="w-full flex items-center gap-2 px-3 py-2 text-white hover:bg-white/10 rounded-md text-sm text-left">
                                        <Download className="h-4 w-4" />
                                        Download
                                      </button>
                                      <button className="w-full flex items-center gap-2 px-3 py-2 text-white hover:bg-white/10 rounded-md text-sm text-left">
                                        <Share className="h-4 w-4" />
                                        Share
                                      </button>
                                      <button
                                          className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-white/10 rounded-md text-sm text-left"
                                          onClick={() => confirmDelete(file)}
                                      >
                                        <Trash className="h-4 w-4" />
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                              )}
                            </div>
                          </div>
                          <p className="text-white/60 text-xs drop-shadow-lg">
                            Last modified: {new Date(file.lastModified).toLocaleDateString()}
                          </p>
                        </div>
                    )
                  })
              ) : (
                  <div className="col-span-2 flex flex-col items-center justify-center py-12 text-white/70">
                    <File className="h-12 w-12 mb-4 opacity-50" />
                    <p className="text-lg font-medium">No files found</p>
                    <p className="text-sm">Upload a file or change your search criteria</p>
                  </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Upload Area */}
          <div className="col-span-3 bg-white/20 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl p-6 flex flex-col">
            <h2 className="text-xl font-semibold text-white mb-6 drop-shadow-lg">Upload Files</h2>

            <div className="flex-grow flex flex-col items-center justify-center border-2 border-dashed border-white/30 rounded-xl p-6 bg-white/5">
              <Upload className="h-12 w-12 text-white/50 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2 drop-shadow-lg">Drag & Drop Files</h3>
              <p className="text-white/70 text-center mb-6 drop-shadow-lg">
                Drop your files here, or click to browse your computer
              </p>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 transition-colors">
                <Plus className="h-4 w-4" />
                <span>Browse Files</span>
              </button>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-white mb-4 drop-shadow-lg">Recently Uploaded</h3>
              <div className="space-y-3">
                <div className="bg-white/10 border border-white/10 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-blue-500 rounded-lg">
                      <File className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white text-sm font-medium truncate max-w-[150px] drop-shadow-lg">
                        Resume_latest.pdf
                      </h4>
                      <p className="text-white/70 text-xs drop-shadow-lg">Just now</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-white/50" />
                </div>
                <div className="bg-white/10 border border-white/10 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-green-500 rounded-lg">
                      <File className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white text-sm font-medium truncate max-w-[150px] drop-shadow-lg">
                        Cover_Letter.docx
                      </h4>
                      <p className="text-white/70 text-xs drop-shadow-lg">2 hours ago</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-white/50" />
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Upload Modal */}
        <Transition appear show={isUploadModalOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={() => setIsUploadModalOpen(false)}>
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
                    <div className="flex justify-between items-center mb-6">
                      <Dialog.Title as="h3" className="text-xl font-semibold text-white drop-shadow-lg">
                        Upload File
                      </Dialog.Title>
                      <button
                          onClick={() => setIsUploadModalOpen(false)}
                          className="text-white/70 hover:text-white transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="space-y-6">
                      <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/30 rounded-xl p-6 bg-white/5">
                        <Upload className="h-12 w-12 text-white/50 mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2 drop-shadow-lg">Drag & Drop Files</h3>
                        <p className="text-white/70 text-center mb-6 drop-shadow-lg">
                          Drop your files here, or click to browse your computer
                        </p>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 transition-colors">
                          <Plus className="h-4 w-4" />
                          <span>Browse Files</span>
                        </button>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-1 drop-shadow-lg">Category</label>
                        <select className="w-full bg-white/15 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="" className="bg-gray-800">
                            Select a category
                          </option>
                          {categories
                              .filter((cat) => cat.id !== "all")
                              .map((category) => (
                                  <option key={category.id} value={category.id} className="bg-gray-800">
                                    {category.name}
                                  </option>
                              ))}
                        </select>
                      </div>

                      <div className="flex justify-end gap-3 pt-4">
                        <button
                            className="px-4 py-2 bg-white/15 hover:bg-white/20 rounded-lg text-white transition-colors"
                            onClick={() => setIsUploadModalOpen(false)}
                        >
                          Cancel
                        </button>
                        <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-colors">
                          Upload
                        </button>
                      </div>
                    </div>
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
                      Are you sure you want to delete this file? This action cannot be undone.
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
                          onClick={() => fileToDelete && handleDeleteFile(fileToDelete.id)}
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

