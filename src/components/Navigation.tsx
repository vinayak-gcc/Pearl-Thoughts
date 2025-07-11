'use client'

import React, { useState, useEffect } from 'react'
import Link from "next/link"
import { usePathname } from 'next/navigation'
import {
  Menu, X, Users, Calendar, BookOpen,
  Settings, GraduationCap, Edit, Mail, DollarSign
} from "lucide-react"
import AuthButton from './AuthButton'

export default function Navigation() {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)


  const navigationItems = [
    // Path can be adjusted based on your routing structure
    { href: "/Teacher/Dashboard/", label: "Dashboard", icon: BookOpen, pathMatch: "/Teacher/Dashboard" },
    { href: "/Teacher/Teacher-List/", label: "Teacher List", icon: Users, pathMatch: "/Teacher/Teacher-List" },
    { href: "/Teacher/Qualifications/", label: "Qualifications", icon: GraduationCap, pathMatch: "/Teacher/Qualifications" },
    { href: "/Teacher/Scheduling/", label: "Scheduling", icon: Calendar, pathMatch: "/Teacher/Scheduling" },
    { href: "/Teacher/Payments/", label: "Payments", icon: DollarSign, pathMatch: "/Teacher/Payments" },
    { href: "/Teacher/Performance/", label: "Performance Reviews", icon: Edit, pathMatch: "/Teacher/Performance" },
    { href: "/Teacher/Feedback/", label: "Student Feedback", icon: Mail, pathMatch: "/Teacher/Feedback" },
    { href: "/Teacher/Settings/", label: "Settings", icon: Settings, pathMatch: "/Teacher/Settings" }
  ]

  const isActive = (path: string) => pathname.startsWith(path)
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)





  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : 'auto'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [sidebarOpen])



  const NavigationLink: React.FC<{
    item: { href: string; label: string; icon: React.ElementType; pathMatch: string }
    onClick?: () => void
  }> = ({ item, onClick = () => {} }) => {
    const IconComponent = item.icon
    return (
      <Link
        href={item.href}
        className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md ${
          isActive(item.pathMatch)
            ? 'bg-violet-400 text-black'
            : 'text-white hover:bg-gray-50 hover:text-black'
        }`}
        onClick={onClick}
      >
        <IconComponent size={22} />
        {item.label}
      </Link>
    )
  }

  return (
    <>
      <div className="flex flex-col">
        {/* Navbar */}
        <nav className="bg-[#de4c38] w-screen z-30 md:w-[98.8vw] md:fixed absolute z-30 flex items-center justify-between">
          <div className="flex items-center bg-[#de4c38] p-4 px-7.5">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold">Pearl Thoughts</span>
            </Link>
          </div>

          <div className="flex items-center gap-3 -mt-1 pr-2 sm:pr-4 lg:pr-6">
            <div className="hidden md:flex items-center gap-5">
              <div className="mt-1">
                <AuthButton />
              </div>
            </div>

            <button
              className="md:hidden p-2 mt-1 rounded-lg hover:bg-gray-100 focus:outline-none"
              onClick={toggleSidebar}
              aria-label="Toggle menu"
            >
              {sidebarOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </nav>

        <div className="flex">
          {/* Sidebar - Desktop */}
          <aside className="md:max-w-[13rem] hidden md:block bg-[#222d32] border-none overflow-y-auto md:fixed md:top-0 md:left-0 md:h-full md:pt-[72px] md:z-10">
            <nav>
              <div className="space-y-2 mt-2">
                {navigationItems.map((item, index) => (
                  <NavigationLink key={index} item={item} />
                ))}
              </div>
            </nav>
          </aside>

          {/* Main content area - add left margin to account for fixed sidebar */}
          <main className="flex-1 md:ml-[13rem]">
            {/* This is where your page content will go */}
          </main>
        </div>

        {/* Sidebar - Mobile */}
        <div
          className={`fixed inset-y-0 right-0 max-w-[16rem] md:max-w-[18rem] w-full bg-[#222d32] shadow-xl transform transition-transform duration-300 ease-in-out z-30 overflow-y-auto ${
            sidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex justify-end mt-1 p-4">
            <button
              onClick={toggleSidebar}
              title="Toggle"
              className="py-0.5 rounded-lg hover:bg-gray-100 focus:outline-none"
            >
              <X className="h-6 w-6 mt-1 text-white" />
            </button>
          </div>

          <div className="p-4 border-b -mt-16 border-gray-100">
            <AuthButton />
          </div>

          <nav className="px-1 py-2">
            <div className="space-y-1">
              {navigationItems.map((item, index) => (
                <NavigationLink
                  key={index}
                  item={item}
                  onClick={() => setSidebarOpen(false)}
                />
              ))}
            </div>
          </nav>
        </div>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
      </div>
    </>
  )
}