"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  Clock,
  DollarSign,
  Users,
  BookOpen,
} from "lucide-react"
import Header from "@/components/Header"
import Details from "./Details"
import Contact from "./Contact"
import Qualification from "./Practical"
import Today from "./Today"
import Schedule from "./Schedule"

export default function TeacherManagementSystem() {

  const stats = [
    { label: "Total Students", value: "24", icon: Users, color: "bg-blue-500" },
    { label: "Weekly Hours", value: "32", icon: Clock, color: "bg-green-500" },
    { label: "Monthly Revenue", value: "$2,840", icon: DollarSign, color: "bg-purple-500" },
    { label: "Active Courses", value: "7", icon: BookOpen, color: "bg-orange-500" },
  ]

  return (
    <div className=" px-4 ">

      <div className=" max-w-[1440px] mx-auto">
       
      <Header />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 bg-gray-100 shadow-md transition-shadow duration-200">
              <CardContent className="px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid - 4 cards in responsive grid */}
        <div className="grid grid-cols-1  xl:grid-cols-2 gap-6 mb-8">
       
           {/* Personal Details */}
           <Details />

          {/* Contact Information */}
        <Contact />

          {/* Private Qualifications */}
        <Qualification />

          {/* Today's Schedule */}
         <Today />

        </div>

               {/* Schedule Management */}
<Schedule />

       
      </div>
    </div>
  )
}