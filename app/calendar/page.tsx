"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  Settings,
  Clock,
  MapPin,
  Users,
  Calendar,
  Pause,
  Sparkles,
  X,
  Plus,
} from "lucide-react"
import { Dialog, Transition } from "@headlessui/react"
import { Fragment } from "react"

export default function CalendarPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)
  const [showAIPopup, setShowAIPopup] = useState(false)
  const [typedText, setTypedText] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: "",
    startTime: "09:00",
    endTime: "10:00",
    date: new Date().toISOString().split("T")[0],
    color: "bg-blue-500",
    description: "",
    location: "",
    attendees: "",
  })

  useEffect(() => {
    setIsLoaded(true)

    // Check if we should open the add event modal from URL params
    const action = searchParams.get("action")
    if (action === "new") {
      setIsAddEventModalOpen(true)
      // Clean up the URL
      router.replace("/calendar")
    }

    // Show AI popup after 3 seconds
    const popupTimer = setTimeout(() => {
      setShowAIPopup(true)
    }, 3000)

    return () => clearTimeout(popupTimer)
  }, [searchParams, router])

  useEffect(() => {
    if (showAIPopup) {
      const text =
          "LLooks like you don't have that many meetings today. Shall I play some Hans Zimmer essentials to help you get into your Flow State?"
      let i = 0
      const typingInterval = setInterval(() => {
        if (i < text.length) {
          setTypedText((prev) => prev + text.charAt(i))
          i++
        } else {
          clearInterval(typingInterval)
        }
      }, 50)

      return () => clearInterval(typingInterval)
    }
  }, [showAIPopup])

  const [currentView, setCurrentView] = useState("week")
  const [currentMonth, setCurrentMonth] = useState("March 2025")
  const [currentDate, setCurrentDate] = useState("March 5")
  const [selectedEvent, setSelectedEvent] = useState(null)

  // Date navigation state
  const today = new Date()
  const [viewDate, setViewDate] = useState(today)

  // Get current year and month for the calendar
  const [selectedYear, setSelectedYear] = useState(today.getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState(today.getDate())

  // Navigate to today
  const goToToday = () => {
    const today = new Date()
    setViewDate(today)
    setSelectedYear(today.getFullYear())
    setSelectedMonth(today.getMonth())
    setSelectedDay(today.getDate())
    setCurrentDate(`${today.toLocaleString("default", { month: "long" })} ${today.getDate()}`)
    setCurrentMonth(`${today.toLocaleString("default", { month: "long" })} ${today.getFullYear()}`)
  }

  // Navigate previous/next based on current view
  const navigatePrevious = () => {
    const newDate = new Date(viewDate)
    if (currentView === "day") {
      newDate.setDate(newDate.getDate() - 1)
    } else if (currentView === "week") {
      newDate.setDate(newDate.getDate() - 7)
    } else if (currentView === "month") {
      newDate.setMonth(newDate.getMonth() - 1)
    }
    updateViewDate(newDate)
  }

  const navigateNext = () => {
    const newDate = new Date(viewDate)
    if (currentView === "day") {
      newDate.setDate(newDate.getDate() + 1)
    } else if (currentView === "week") {
      newDate.setDate(newDate.getDate() + 7)
    } else if (currentView === "month") {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    updateViewDate(newDate)
  }

  const updateViewDate = (date) => {
    setViewDate(date)
    setSelectedYear(date.getFullYear())
    setSelectedMonth(date.getMonth())
    setSelectedDay(date.getDate())
    setCurrentDate(`${date.toLocaleString("default", { month: "long" })} ${date.getDate()}`)
    setCurrentMonth(`${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`)
  }

  // Helper functions for calendar rendering
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay()

  // Get week dates for the week view
  const getWeekDates = (date) => {
    const day = date.getDay() // 0 = Sunday, 6 = Saturday
    const diff = date.getDate() - day
    const weekDates = []
    for (let i = 0; i < 7; i++) {
      const newDate = new Date(date)
      newDate.setDate(diff + i)
      weekDates.push(newDate.getDate())
    }
    return weekDates
  }

  const weekDates = getWeekDates(viewDate)

  const handleEventClick = (event) => {
    setSelectedEvent(event)
  }

  // Sample calendar events with all events before 4 PM
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Team Meeting",
      startTime: "09:00",
      endTime: "10:00",
      color: "bg-blue-500",
      day: 1,
      description: "Weekly team sync-up",
      location: "Conference Room A",
      attendees: ["John Doe", "Jane Smith", "Bob Johnson"],
      organizer: "Alice Brown",
    },
    {
      id: 2,
      title: "Lunch with Sarah",
      startTime: "12:30",
      endTime: "13:30",
      color: "bg-green-500",
      day: 1,
      description: "Discuss project timeline",
      location: "Cafe Nero",
      attendees: ["Sarah Lee"],
      organizer: "You",
    },
    {
      id: 3,
      title: "Project Review",
      startTime: "14:00",
      endTime: "15:30",
      color: "bg-purple-500",
      day: 3,
      description: "Q2 project progress review",
      location: "Meeting Room 3",
      attendees: ["Team Alpha", "Stakeholders"],
      organizer: "Project Manager",
    },
    {
      id: 4,
      title: "Client Call",
      startTime: "10:00",
      endTime: "11:00",
      color: "bg-yellow-500",
      day: 2,
      description: "Quarterly review with major client",
      location: "Zoom Meeting",
      attendees: ["Client Team", "Sales Team"],
      organizer: "Account Manager",
    },
    {
      id: 5,
      title: "Team Brainstorm",
      startTime: "13:00",
      endTime: "14:30",
      color: "bg-indigo-500",
      day: 4,
      description: "Ideation session for new product features",
      location: "Creative Space",
      attendees: ["Product Team", "Design Team"],
      organizer: "Product Owner",
    },
    {
      id: 6,
      title: "Product Demo",
      startTime: "11:00",
      endTime: "12:00",
      color: "bg-pink-500",
      day: 5,
      description: "Showcase new features to stakeholders",
      location: "Demo Room",
      attendees: ["Stakeholders", "Dev Team"],
      organizer: "Tech Lead",
    },
    {
      id: 7,
      title: "Marketing Meeting",
      startTime: "13:00",
      endTime: "14:00",
      color: "bg-teal-500",
      day: 6,
      description: "Discuss Q3 marketing strategy",
      location: "Marketing Office",
      attendees: ["Marketing Team"],
      organizer: "Marketing Director",
    },
    {
      id: 8,
      title: "Code Review",
      startTime: "15:00",
      endTime: "16:00",
      color: "bg-cyan-500",
      day: 7,
      description: "Review pull requests for new feature",
      location: "Dev Area",
      attendees: ["Dev Team"],
      organizer: "Senior Developer",
    },
    {
      id: 9,
      title: "Morning Standup",
      startTime: "08:30",
      endTime: "09:30", // Changed from "09:00" to "09:30"
      color: "bg-blue-400",
      day: 2,
      description: "Daily team standup",
      location: "Slack Huddle",
      attendees: ["Development Team"],
      organizer: "Scrum Master",
    },
    {
      id: 10,
      title: "Design Review",
      startTime: "14:30",
      endTime: "15:45",
      color: "bg-purple-400",
      day: 5,
      description: "Review new UI designs",
      location: "Design Lab",
      attendees: ["UX Team", "Product Manager"],
      organizer: "Lead Designer",
    },
    {
      id: 11,
      title: "Investor Meeting",
      startTime: "10:30",
      endTime: "12:00",
      color: "bg-red-400",
      day: 7,
      description: "Quarterly investor update",
      location: "Board Room",
      attendees: ["Executive Team", "Investors"],
      organizer: "CEO",
    },
    {
      id: 12,
      title: "Team Training",
      startTime: "09:30",
      endTime: "11:30",
      color: "bg-green-400",
      day: 4,
      description: "New tool onboarding session",
      location: "Training Room",
      attendees: ["All Departments"],
      organizer: "HR",
    },
    {
      id: 13,
      title: "Budget Review",
      startTime: "13:30",
      endTime: "15:00",
      color: "bg-yellow-400",
      day: 3,
      description: "Quarterly budget analysis",
      location: "Finance Office",
      attendees: ["Finance Team", "Department Heads"],
      organizer: "CFO",
    },
    {
      id: 14,
      title: "Client Presentation",
      startTime: "11:00",
      endTime: "12:30",
      color: "bg-orange-400",
      day: 6,
      description: "Present new project proposal",
      location: "Client Office",
      attendees: ["Sales Team", "Client Representatives"],
      organizer: "Account Executive",
    },
    {
      id: 15,
      title: "Product Planning",
      startTime: "14:00",
      endTime: "15:30",
      color: "bg-pink-400",
      day: 1,
      description: "Roadmap discussion for Q3",
      location: "Strategy Room",
      attendees: ["Product Team", "Engineering Leads"],
      organizer: "Product Manager",
    },
  ])

  const colorOptions = [
    { name: "Blue", value: "bg-blue-500" },
    { name: "Green", value: "bg-green-500" },
    { name: "Purple", value: "bg-purple-500" },
    { name: "Yellow", value: "bg-yellow-500" },
    { name: "Red", value: "bg-red-500" },
    { name: "Pink", value: "bg-pink-500" },
    { name: "Indigo", value: "bg-indigo-500" },
    { name: "Teal", value: "bg-teal-500" },
  ]

  const handleAddEvent = () => {
    // Convert the date to a day of the week (1-7)
    const date = new Date(newEvent.date)
    const day = date.getDay() + 1 // Sunday is 0, but we want Sunday to be 1

    const newCalendarEvent = {
      id: events.length + 1,
      title: newEvent.title,
      startTime: newEvent.startTime,
      endTime: newEvent.endTime,
      color: newEvent.color,
      day: day,
      description: newEvent.description,
      location: newEvent.location,
      attendees: newEvent.attendees
          .split(",")
          .map((attendee) => attendee.trim())
          .filter((attendee) => attendee),
      organizer: "You",
    }

    setEvents([...events, newCalendarEvent])
    setIsAddEventModalOpen(false)

    // Reset the form
    setNewEvent({
      title: "",
      startTime: "09:00",
      endTime: "10:00",
      date: new Date().toISOString().split("T")[0],
      color: "bg-blue-500",
      description: "",
      location: "",
      attendees: "",
    })
  }

  // Sample calendar days for the week view
  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
  const timeSlots = Array.from({ length: 9 }, (_, i) => i + 8) // 8 AM to 4 PM

  // Helper function to calculate event position and height
  const calculateEventStyle = (startTime, endTime) => {
    const start = Number.parseInt(startTime.split(":")[0]) + Number.parseInt(startTime.split(":")[1]) / 60
    const end = Number.parseInt(endTime.split(":")[0]) + Number.parseInt(endTime.split(":")[1]) / 60
    const top = (start - 8) * 80 // 80px per hour
    const height = (end - start) * 80
    return { top: `${top}px`, height: `${height}px` }
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
    // Here you would typically also control the actual audio playback
  }

  return (
      <div className="relative min-h-screen w-full overflow-hidden">
        {/* Header */}
        <header className="relative z-10 flex items-center justify-between px-8 py-6">
          <div className="flex items-center gap-4">
            <span className="text-2xl font-semibold text-white drop-shadow-lg">Calendar</span>
          </div>

          <div className="flex items-center gap-4">
            <Settings className="h-6 w-6 text-white drop-shadow-md" />
            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shadow-md">
              U
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative z-10 pt-4 flex flex-col">
          {/* Calendar Controls */}
          <div className="flex items-center justify-between p-4 border-b border-white/20">
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 text-white bg-blue-500 rounded-md" onClick={goToToday}>
                Today
              </button>
              <div className="flex">
                <button className="p-2 text-white hover:bg-white/10 rounded-l-md" onClick={navigatePrevious}>
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button className="p-2 text-white hover:bg-white/10 rounded-r-md" onClick={navigateNext}>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              <h2 className="text-xl font-semibold text-white">{currentView === "month" ? currentMonth : currentDate}</h2>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-md p-1">
                <button
                    onClick={() => setCurrentView("day")}
                    className={`px-3 py-1 rounded ${currentView === "day" ? "bg-white/20" : ""} text-white text-sm`}
                >
                  Day
                </button>
                <button
                    onClick={() => setCurrentView("week")}
                    className={`px-3 py-1 rounded ${currentView === "week" ? "bg-white/20" : ""} text-white text-sm`}
                >
                  Week
                </button>
                <button
                    onClick={() => setCurrentView("month")}
                    className={`px-3 py-1 rounded ${currentView === "month" ? "bg-white/20" : ""} text-white text-sm`}
                >
                  Month
                </button>
              </div>
              <button
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 transition-colors"
                  onClick={() => setIsAddEventModalOpen(true)}
              >
                <Plus className="h-4 w-4" />
                <span>Add Event</span>
              </button>
            </div>
          </div>

          {/* Calendar Views */}
          <div className="flex-1 overflow-auto p-4">
            <div className="bg-white/20 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl h-full">
              {currentView === "week" && (
                  <>
                    {/* Week Header */}
                    <div className="grid grid-cols-8 border-b border-white/20">
                      <div className="p-2 text-center text-white/50 text-xs"></div>
                      {weekDays.map((day, i) => (
                          <div key={i} className="p-2 text-center border-l border-white/20">
                            <div className="text-xs text-white/70 font-medium">{day}</div>
                            <div
                                className={`text-lg font-medium mt-1 text-white ${
                                    new Date().getDate() === weekDates[i] &&
                                    new Date().getMonth() === viewDate.getMonth() &&
                                    new Date().getFullYear() === viewDate.getFullYear()
                                        ? "bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center mx-auto"
                                        : ""
                                }`}
                            >
                              {weekDates[i]}
                            </div>
                          </div>
                      ))}
                    </div>

                    {/* Time Grid */}
                    <div className="grid" style={{ gridTemplateColumns: "60px repeat(7, 1fr)" }}>
                      {/* Time Labels */}
                      <div className="text-white/70 text-right pr-2">
                        {timeSlots.map((time, i) => (
                            <div
                                key={i}
                                className="h-20 border-b border-white/10 pr-2 text-right text-xs flex items-center justify-end"
                            >
                              <span className="whitespace-nowrap">{time > 12 ? `${time - 12} PM` : `${time} AM`}</span>
                            </div>
                        ))}
                      </div>

                      {/* Days Columns */}
                      {Array.from({ length: 7 }).map((_, dayIndex) => (
                          <div key={dayIndex} className="border-l border-white/20 relative">
                            {timeSlots.map((_, timeIndex) => (
                                <div key={timeIndex} className="h-20 border-b border-white/10"></div>
                            ))}

                            {/* Events */}
                            {events
                                .filter((event) => event.day === dayIndex + 1)
                                .map((event, i) => {
                                  const eventStyle = calculateEventStyle(event.startTime, event.endTime)
                                  return (
                                      <div
                                          key={i}
                                          className={`absolute ${event.color} rounded-md p-2 text-white text-xs shadow-md cursor-pointer transition-all duration-200 ease-in-out hover:translate-y-[-2px] hover:shadow-lg`}
                                          style={{
                                            ...eventStyle,
                                            left: "4px",
                                            right: "4px",
                                          }}
                                          onClick={() => handleEventClick(event)}
                                      >
                                        <div className="font-medium">{event.title}</div>
                                        <div className="opacity-80 text-[10px] mt-1">{`${event.startTime} - ${event.endTime}`}</div>
                                      </div>
                                  )
                                })}
                          </div>
                      ))}
                    </div>
                  </>
              )}

              {currentView === "day" && (
                  <>
                    {/* Day Header */}
                    <div className="border-b border-white/20 p-4 text-center">
                      <div className="text-white font-medium">
                        {viewDate.toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </div>

                    {/* Time Grid */}
                    <div className="grid" style={{ gridTemplateColumns: "60px 1fr" }}>
                      {/* Time Labels */}
                      <div className="text-white/70">
                        {timeSlots.map((time, i) => (
                            <div
                                key={i}
                                className="h-20 border-b border-white/10 pr-2 text-right text-xs flex items-center justify-end"
                            >
                              <span className="whitespace-nowrap">{time > 12 ? `${time - 12} PM` : `${time} AM`}</span>
                            </div>
                        ))}
                      </div>

                      {/* Day Column */}
                      <div className="border-l border-white/20 relative">
                        {timeSlots.map((_, timeIndex) => (
                            <div key={timeIndex} className="h-20 border-b border-white/10"></div>
                        ))}

                        {/* Events */}
                        {events
                            .filter((event) => event.day === viewDate.getDay() + 1)
                            .map((event, i) => {
                              const eventStyle = calculateEventStyle(event.startTime, event.endTime)
                              return (
                                  <div
                                      key={i}
                                      className={`absolute ${event.color} rounded-md p-2 text-white text-sm shadow-md cursor-pointer transition-all duration-200 ease-in-out hover:translate-y-[-2px] hover:shadow-lg`}
                                      style={{
                                        ...eventStyle,
                                        left: "4px",
                                        right: "4px",
                                      }}
                                      onClick={() => handleEventClick(event)}
                                  >
                                    <div className="font-medium">{event.title}</div>
                                    <div className="opacity-80 text-xs mt-1">{`${event.startTime} - ${event.endTime}`}</div>
                                    <div className="opacity-80 text-xs mt-1">{event.location}</div>
                                  </div>
                              )
                            })}
                      </div>
                    </div>
                  </>
              )}

              {currentView === "month" && (
                  <>
                    {/* Month Grid */}
                    <div className="grid grid-cols-7 text-center">
                      {/* Day Names */}
                      {weekDays.map((day, i) => (
                          <div key={i} className="p-2 text-white/70 font-medium border-b border-white/20">
                            {day}
                          </div>
                      ))}

                      {/* Calendar Days */}
                      {(() => {
                        const days = []
                        const totalDays = daysInMonth(selectedYear, selectedMonth)
                        const firstDay = firstDayOfMonth(selectedYear, selectedMonth)

                        // Empty cells for days before the first day of the month
                        for (let i = 0; i < firstDay; i++) {
                          days.push(<div key={`empty-${i}`} className="p-2 min-h-[120px] border border-white/10"></div>)
                        }

                        // Days of the month
                        for (let day = 1; day <= totalDays; day++) {
                          const date = new Date(selectedYear, selectedMonth, day)
                          const dayOfWeek = date.getDay() + 1 // 1-7 (Sunday-Saturday)

                          const dayEvents = events.filter((event) => event.day === dayOfWeek)

                          days.push(
                              <div key={day} className="p-2 min-h-[120px] border border-white/10 relative overflow-y-auto">
                                <div
                                    className={`text-sm font-medium mb-2 ${
                                        new Date().getDate() === day &&
                                        new Date().getMonth() === selectedMonth &&
                                        new Date().getFullYear() === selectedYear
                                            ? "bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center mx-auto"
                                            : "text-white"
                                    }`}
                                >
                                  {day}
                                </div>
                                <div className="space-y-1">
                                  {dayEvents.map((event, i) => (
                                      <div
                                          key={i}
                                          className={`${event.color} rounded-sm p-1 text-white text-xs truncate cursor-pointer hover:opacity-90`}
                                          onClick={() => handleEventClick(event)}
                                      >
                                        <div className="flex items-center">
                                          <span className="w-1/4 text-[8px]">{event.startTime}</span>
                                          <span className="w-3/4 truncate">{event.title}</span>
                                        </div>
                                      </div>
                                  ))}
                                </div>
                              </div>,
                          )
                        }

                        return days
                      })()}
                    </div>
                  </>
              )}
            </div>
          </div>
        </main>

        {/* AI Popup */}
        {showAIPopup && (
            <div className="fixed bottom-8 right-8 z-20">
              <div className="w-[450px] relative bg-gradient-to-br from-blue-400/30 via-blue-500/30 to-blue-600/30 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-blue-300/30 text-white">
                <button
                    onClick={() => setShowAIPopup(false)}
                    className="absolute top-2 right-2 text-white/70 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <Sparkles className="h-5 w-5 text-blue-300" />
                  </div>
                  <div className="min-h-[80px]">
                    <p className="text-base font-light">{typedText}</p>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <button
                      onClick={togglePlay}
                      className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm transition-colors font-medium"
                  >
                    Yes
                  </button>
                  <button
                      onClick={() => setShowAIPopup(false)}
                      className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm transition-colors font-medium"
                  >
                    No
                  </button>
                </div>
                {isPlaying && (
                    <div className="mt-4 flex items-center justify-between">
                      <button
                          className="flex items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-white text-sm hover:bg-white/20 transition-colors"
                          onClick={togglePlay}
                      >
                        <Pause className="h-4 w-4" />
                        <span>Pause Hans Zimmer</span>
                      </button>
                    </div>
                )}
              </div>
            </div>
        )}

        {/* Event Details Modal */}
        {selectedEvent && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className={`${selectedEvent.color} p-6 rounded-lg shadow-xl max-w-md w-full mx-4`}>
                <h3 className="text-2xl font-bold mb-4 text-white">{selectedEvent.title}</h3>
                <div className="space-y-3 text-white">
                  <p className="flex items-center">
                    <Clock className="mr-2 h-5 w-5" />
                    {`${selectedEvent.startTime} - ${selectedEvent.endTime}`}
                  </p>
                  <p className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    {selectedEvent.location}
                  </p>
                  <p className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    {`${weekDays[selectedEvent.day - 1]}, ${weekDates[selectedEvent.day - 1]} ${currentMonth}`}
                  </p>
                  <p className="flex items-start">
                    <Users className="mr-2 h-5 w-5 mt-1" />
                    <span>
                  <strong>Attendees:</strong>
                  <br />
                      {selectedEvent.attendees.join(", ") || "No attendees"}
                </span>
                  </p>
                  <p>
                    <strong>Organizer:</strong> {selectedEvent.organizer}
                  </p>
                  <p>
                    <strong>Description:</strong> {selectedEvent.description}
                  </p>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                      className="bg-white text-gray-800 px-4 py-2 rounded hover:bg-gray-100 transition-colors"
                      onClick={() => setSelectedEvent(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* Add Event Modal */}
        <Transition appear show={isAddEventModalOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={() => setIsAddEventModalOpen(false)}>
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
                        Add New Event
                      </Dialog.Title>
                      <button
                          onClick={() => setIsAddEventModalOpen(false)}
                          className="text-white/70 hover:text-white transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-white mb-1 drop-shadow-lg">Event Title</label>
                        <input
                            type="text"
                            className="w-full bg-white/15 border border-white/20 rounded-lg py-2 px-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter event title"
                            value={newEvent.title}
                            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-white mb-1 drop-shadow-lg">Date</label>
                          <input
                              type="date"
                              className="w-full bg-white/15 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={newEvent.date}
                              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white mb-1 drop-shadow-lg">Color</label>
                          <select
                              className="w-full bg-white/15 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={newEvent.color}
                              onChange={(e) => setNewEvent({ ...newEvent, color: e.target.value })}
                          >
                            {colorOptions.map((color) => (
                                <option key={color.value} value={color.value} className="bg-gray-800">
                                  {color.name}
                                </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-white mb-1 drop-shadow-lg">Start Time</label>
                          <input
                              type="time"
                              className="w-full bg-white/15 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={newEvent.startTime}
                              onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white mb-1 drop-shadow-lg">End Time</label>
                          <input
                              type="time"
                              className="w-full bg-white/15 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={newEvent.endTime}
                              onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-1 drop-shadow-lg">Location</label>
                        <input
                            type="text"
                            className="w-full bg-white/15 border border-white/20 rounded-lg py-2 px-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter location"
                            value={newEvent.location}
                            onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-1 drop-shadow-lg">Attendees</label>
                        <input
                            type="text"
                            className="w-full bg-white/15 border border-white/20 rounded-lg py-2 px-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter attendees (comma separated)"
                            value={newEvent.attendees}
                            onChange={(e) => setNewEvent({ ...newEvent, attendees: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-1 drop-shadow-lg">Description</label>
                        <textarea
                            className="w-full bg-white/15 border border-white/20 rounded-lg py-2 px-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                            placeholder="Enter event description"
                            value={newEvent.description}
                            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                        ></textarea>
                      </div>

                      <div className="flex justify-end gap-3 pt-4">
                        <button
                            className="px-4 py-2 bg-white/15 hover:bg-white/20 rounded-lg text-white transition-colors"
                            onClick={() => setIsAddEventModalOpen(false)}
                        >
                          Cancel
                        </button>
                        <button
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-colors"
                            onClick={handleAddEvent}
                        >
                          Add Event
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

