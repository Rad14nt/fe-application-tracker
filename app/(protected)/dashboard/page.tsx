"use client"
import Link from "next/link"
import { Calendar, Briefcase, Users, Clock, ChevronRight, Settings, Bell, FileText } from "lucide-react"
import UserDropdown from "@/components/user-dropdown"

// Update the dashboard layout to fill the entire page better
export default function Dashboard() {
  // Sample upcoming events
  const upcomingEvents = [
    { id: 1, title: "Team Meeting", time: "Today, 09:00 AM", type: "calendar" },
    { id: 2, title: "Interview with Google", time: "Tomorrow, 02:00 PM", type: "opportunity" },
    { id: 3, title: "Call with Recruiter", time: "Mar 7, 11:30 AM", type: "opportunity" },
    { id: 4, title: "Project Review", time: "Mar 8, 10:00 AM", type: "calendar" },
  ]

  // Sample opportunities
  const recentOpportunities = [
    { id: 1, company: "Google", role: "Senior Developer", status: "Interviewing", color: "bg-blue-500" },
    { id: 2, company: "Microsoft", role: "Product Manager", status: "Applied", color: "bg-yellow-500" },
    { id: 3, company: "Apple", role: "UX Designer", status: "Offer", color: "bg-green-500" },
    { id: 4, company: "Amazon", role: "Software Engineer", status: "Applied", color: "bg-yellow-500" },
    { id: 5, company: "Netflix", role: "Data Scientist", status: "Interviewing", color: "bg-blue-500" },
  ]

  // Sample collaborators
  const recentCollaborators = [
    { id: 1, name: "Jane Smith", email: "jane@example.com", permission: "Edit", color: "bg-teal-500" },
    { id: 2, name: "John Doe", email: "john@example.com", permission: "View Only", color: "bg-purple-500" },
  ]

  // Sample files
  const recentFiles = [
    { id: 1, name: "Resume_v2.pdf", type: "PDF", size: "1.2 MB", category: "Resumes", color: "bg-indigo-500" },
    {
      id: 2,
      name: "Cover_Letter_Google.docx",
      type: "DOCX",
      size: "0.8 MB",
      category: "Cover Letters",
      color: "bg-pink-500",
    },
    { id: 3, name: "Portfolio_2025.pdf", type: "PDF", size: "4.5 MB", category: "Portfolios", color: "bg-amber-500" },
    {
      id: 4,
      name: "Recommendation_Letter.pdf",
      type: "PDF",
      size: "0.5 MB",
      category: "References",
      color: "bg-green-500",
    },
  ]

  return (
      <div className="relative min-h-screen w-full overflow-hidden">
        {/* Header */}
        <header className="relative z-10 flex items-center justify-between px-8 py-6">
          <h1 className="text-2xl font-semibold text-white drop-shadow-lg">Dashboard</h1>

          <div className="flex items-center gap-4">
            <button className="relative">
              <Bell className="h-6 w-6 text-white drop-shadow-md" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full text-xs flex items-center justify-center text-white">
              3
            </span>
            </button>
            <Settings className="h-6 w-6 text-white drop-shadow-md" />
            <UserDropdown />
          </div>
        </header>

        {/* Main Content - Updated Layout */}
        <main className="relative z-10 p-8 pt-4 grid grid-cols-12 gap-6 overflow-auto">
          {/* Upcoming Events - Spans 4 columns */}
          <div className="col-span-4 bg-white/20 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl p-6 flex flex-col h-[calc(100vh-180px)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white drop-shadow-lg">Upcoming Events</h2>
              <Clock className="h-5 w-5 text-white/70" />
            </div>
            <div className="space-y-4 flex-grow overflow-auto">
              {upcomingEvents.map((event) => (
                  <div
                      key={event.id}
                      className="flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/15 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        {event.type === "calendar" ? (
                            <Calendar className="h-4 w-4 text-blue-400" />
                        ) : (
                            <Briefcase className="h-4 w-4 text-yellow-400" />
                        )}
                        <h3 className="text-white font-medium drop-shadow-lg">{event.title}</h3>
                      </div>
                      <p className="text-white/80 text-sm mt-1 drop-shadow-lg">{event.time}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-white/50" />
                  </div>
              ))}
            </div>
            <Link href="/calendar" className="mt-4 block">
              <button className="w-full py-2 bg-white/15 hover:bg-white/20 rounded-lg text-white text-sm transition-colors">
                View All Events
              </button>
            </Link>
          </div>

          {/* Recent Opportunities - Spans 5 columns */}
          <div className="col-span-5 bg-white/20 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl p-6 flex flex-col h-[calc(100vh-180px)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white drop-shadow-lg">Recent Opportunities</h2>
              <Briefcase className="h-5 w-5 text-white/70" />
            </div>
            <div className="space-y-4 flex-grow overflow-auto">
              {recentOpportunities.map((opportunity) => (
                  <div key={opportunity.id} className="p-3 bg-white/10 rounded-lg hover:bg-white/15 transition-colors">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-medium drop-shadow-lg">{opportunity.company}</h3>
                      <div className={`px-2 py-1 rounded-full ${opportunity.color} text-white text-xs`}>
                        {opportunity.status}
                      </div>
                    </div>
                    <p className="text-white/80 text-sm mt-1 drop-shadow-lg">{opportunity.role}</p>
                  </div>
              ))}
            </div>
            <Link href="/opportunities" className="mt-4 block">
              <button className="w-full py-2 bg-white/15 hover:bg-white/20 rounded-lg text-white text-sm transition-colors">
                View All Opportunities
              </button>
            </Link>
          </div>

          {/* Right Column - Spans 3 columns */}
          <div className="col-span-3 flex flex-col gap-6">
            {/* Recent Files */}
            <div className="bg-white/20 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl p-6 flex flex-col h-[calc((100vh-180px)*0.5)]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white drop-shadow-lg">Recent Files</h2>
                <FileText className="h-5 w-5 text-white/70" />
              </div>
              <div className="space-y-4 flex-grow overflow-auto">
                {recentFiles.map((file) => (
                    <div key={file.id} className="p-3 bg-white/10 rounded-lg hover:bg-white/15 transition-colors">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-medium drop-shadow-lg">{file.name}</h3>
                        <div className={`px-2 py-1 rounded-full ${file.color} text-white text-xs`}>{file.type}</div>
                      </div>
                      <div className="flex justify-between mt-1">
                        <p className="text-white/80 text-sm drop-shadow-lg">{file.category}</p>
                        <p className="text-white/80 text-sm drop-shadow-lg">{file.size}</p>
                      </div>
                    </div>
                ))}
              </div>
              <Link href="/files" className="mt-4 block">
                <button className="w-full py-2 bg-white/15 hover:bg-white/20 rounded-lg text-white text-sm transition-colors">
                  View All Files
                </button>
              </Link>
            </div>

            {/* Recent Collaborators - Smaller section */}
            <div className="bg-white/20 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl p-6 flex flex-col h-[calc((100vh-180px)*0.5)]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white drop-shadow-lg">Collaborators</h2>
                <Users className="h-5 w-5 text-white/70" />
              </div>
              <div className="space-y-4 flex-grow overflow-auto">
                {recentCollaborators.map((collaborator) => (
                    <div key={collaborator.id} className="p-3 bg-white/10 rounded-lg hover:bg-white/15 transition-colors">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-medium drop-shadow-lg">{collaborator.name}</h3>
                        <div className={`px-2 py-1 rounded-full ${collaborator.color} text-white text-xs`}>
                          {collaborator.permission}
                        </div>
                      </div>
                      <p className="text-white/80 text-sm mt-1 drop-shadow-lg">{collaborator.email}</p>
                    </div>
                ))}
              </div>
              <Link href="/collaborations" className="mt-4 block">
                <button className="w-full py-2 bg-white/15 hover:bg-white/20 rounded-lg text-white text-sm transition-colors">
                  View All Collaborators
                </button>
              </Link>
            </div>
          </div>
        </main>
      </div>
  )
}

