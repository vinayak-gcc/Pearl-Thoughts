import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  Clock,
  X,
  Users,
  FileText,
  MessageSquare,
  AlertCircle
} from "lucide-react"

const TABS = [
  { id: "availability", label: "Availability", icon: Calendar, shortLabel: "Avail" },
  { id: "unavailabilities", label: "Unavailable", icon: X, shortLabel: "Unavail" },
  { id: "students", label: "Students", icon: Users, shortLabel: "Students" },
  { id: "schedule", label: "Schedule", icon: Clock, shortLabel: "Schedule" },
  { id: "invoiced-lessons", label: "Invoiced", icon: FileText, shortLabel: "Invoiced" },
  { id: "uninvoiced-lessons", label: "Uninvoiced", icon: AlertCircle, shortLabel: "Uninvoiced" },
  { id: "time-voucher", label: "Time Voucher", icon: Clock, shortLabel: "Voucher" },
  { id: "comments", label: "Comments", icon: MessageSquare, shortLabel: "Comments" }
]

const TIME_SLOTS = [
  "7:30am", "8am", "8:30am", "9am", "9:30am", "10am", "10:30am", "11am",
  "11:30am", "12pm", "12:30pm", "1pm", "1:30pm", "2pm", "2:30pm", "3pm",
  "3:30pm", "4pm", "4:30pm", "5pm", "5:30pm", "6pm"
]

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

const MOCK_LESSONS = [
  { day: "Tuesday", startTime: "4pm", endTime: "5pm", student: "Emma Johnson", subject: "Vocal Jazz" },
  { day: "Thursday", startTime: "3pm", endTime: "4:30pm", student: "Michael Chen", subject: "Vocal Core" },
  { day: "Monday", startTime: "10am", endTime: "11am", student: "Sarah Williams", subject: "Instrument" },
  { day: "Wednesday", startTime: "2pm", endTime: "3pm", student: "Group Session", subject: "Group Vocal" }
]

const Schedule = () => {
  const [activeTab, setActiveTab] = useState("availability")

  const findScheduledLesson = (day: string, time: string) => {
    return MOCK_LESSONS.find(lesson => {
      if (lesson.day !== day) return false
      
      const timeIndex = TIME_SLOTS.indexOf(time)
      const startIndex = TIME_SLOTS.indexOf(lesson.startTime)
      const endIndex = TIME_SLOTS.indexOf(lesson.endTime)
      
      return timeIndex >= startIndex && timeIndex < endIndex
    })
  }

  type Tab = {
    id: string
    label: string
    icon: React.ElementType
    shortLabel: string
  }

  const renderTabTrigger = (tab: Tab, className = "") => {
    const Icon = tab.icon
    return (
      <TabsTrigger key={tab.id} value={tab.id} className={className}>
        <Icon className="w-3 h-3 mr-1 sm:w-4 sm:h-4 sm:mr-2" />
        <span className="sm:hidden">{tab.shortLabel}</span>
        <span className="hidden sm:inline">{tab.label}</span>
      </TabsTrigger>
    )
  }

  const renderMobileTabs = () => (
    <div className="block sm:hidden space-y-2">
      <TabsList className="grid grid-cols-2 gap-1 h-auto p-1">
        {TABS.slice(0, 2).map(tab => renderTabTrigger(tab, "text-xs p-2"))}
      </TabsList>
      <TabsList className="grid grid-cols-3 gap-1 h-auto p-1">
        {TABS.slice(2, 5).map(tab => renderTabTrigger(tab, "text-xs p-2"))}
      </TabsList>
      <TabsList className="grid grid-cols-3 gap-1 h-auto p-1">
        {TABS.slice(5).map(tab => renderTabTrigger(tab, "text-xs p-2"))}
      </TabsList>
    </div>
  )

  const renderTabletTabs = () => (
    <div className="hidden sm:block xl:hidden space-y-2">
      <TabsList className="grid grid-cols-4 gap-1 h-auto p-1">
        {TABS.slice(0, 4).map(tab => renderTabTrigger(tab, "text-xs p-2"))}
      </TabsList>
      <TabsList className="grid grid-cols-4 gap-1 h-auto p-1">
        {TABS.slice(4).map(tab => renderTabTrigger(tab, "text-xs p-2"))}
      </TabsList>
    </div>
  )

  const renderDesktopTabs = () => (
    <div className="hidden xl:block">
      <TabsList className="grid grid-cols-8 gap-1 h-auto p-1">
        {TABS.map(tab => renderTabTrigger(tab, "text-sm p-2"))}
      </TabsList>
    </div>
  )

  const renderTimeSlot = (day: string, time: string) => {
    const lesson = findScheduledLesson(day, time)
    const baseClasses = "p-1 h-6 sm:h-8 md:h-10 border border-gray-200 rounded-md transition-all duration-200 cursor-pointer"
    
    if (lesson) {
      return (
        <div
          className={`${baseClasses} bg-gradient-to-r from-green-200 to-green-300 border-green-300 shadow-sm`}
          title={`${lesson.student} - ${lesson.subject}`}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-green-600 rounded-full" />
          </div>
        </div>
      )
    }

    return (
      <div
        className={`${baseClasses} bg-gray-50 hover:bg-blue-50 hover:border-blue-200`}
        title="Available"
      />
    )
  }

  return (
    <div className="w-full max-w-full">
      <Card className="border-0 shadow-md bg-gray-100 w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span>Schedule Management</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="px-2 sm:px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="mb-6">
              {renderMobileTabs()}
              {renderTabletTabs()}
              {renderDesktopTabs()}
            </div>

            <TabsContent value={activeTab}>
              <div className="bg-white rounded-lg border border-gray-200 p-2 md:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Weekly Schedule
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                      <div className="w-3 h-3 bg-green-300 rounded" />
                      <span>Scheduled</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                      <div className="w-3 h-3 bg-gray-100 rounded border border-gray-300" />
                      <span>Available</span>
                    </div>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <div className="min-w-[600px] sm:min-w-[700px]">
                    {/* Days Header */}
                    <div className="grid grid-cols-8 gap-1 mb-3">
                      <div className="p-1 sm:p-2" />
                      {DAYS.map(day => (
                        <div
                          key={day}
                          className="p-1 sm:p-2 md:p-3 text-center font-semibold bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100"
                        >
                          <span className="block sm:hidden text-xs">{day.slice(0, 3)}</span>
                          <span className="hidden sm:block text-xs sm:text-sm">{day}</span>
                        </div>
                      ))}
                    </div>

                    {/* Time Grid */}
                    <div className="space-y-1">
                      {TIME_SLOTS.map(time => (
                        <div key={time} className="grid grid-cols-8 gap-1">
                          <div className="p-1 sm:p-2 text-xs font-medium text-gray-600 text-right pr-2 sm:pr-4 flex items-center justify-end min-w-0">
                            <span className="truncate">{time}</span>
                          </div>
                          {DAYS.map(day => (
                            <div key={`${day}-${time}`}>
                              {renderTimeSlot(day, time)}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default Schedule