import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "lucide-react"

const Today = () => {

  const upcomingLessons = [
  { time: "10:00 AM", student: "Emma Johnson", subject: "Quantum Mechanics", duration: "1h" },
  { time: "2:00 PM", student: "Michael Chen", subject: "Electromagnetism", duration: "1.5h" },
  { time: "4:00 PM", student: "Sarah Williams", subject: "Thermodynamics", duration: "1h" },
  { time: "7:00 PM", student: "Peter Parker", subject: "Classical Mechanics", duration: "1h" },
]

  return (
    <div>
          {/* Today's Schedule */}
          <Card className="border-0 shadow-md bg-gray-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span>Today&#39;s Schedule</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {upcomingLessons.map((lesson, index) => (
                  <div key={index} className="p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate">{lesson.student}</p>
                          <p className="text-xs mt-1 text-gray-600 truncate">{lesson.subject}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-gray-900 text-sm">{lesson.time}</p>
                        <p className="text-xs text-gray-600">{lesson.duration}</p>
                      </div>
                    </div>
                  </div>
                ))}

              </div>
            </CardContent>
          </Card>
    </div>
  )
}

export default Today
