"use client"

import React, { useState } from "react"
import {
  Edit,
  Save,
  Users,
  Award,
  Check,
  Loader2,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Zod validation schema
interface ValidationErrors {
  name?: string;
  role?: string;
  experience?: string;
  students?: string;
}

interface FormData {
  name: string;
  role: string;
  experience: string;
  students: string;
}

interface Toast {
  message: string;
  type: 'success' | 'error';
}

const profileSchema = {
  name: (value: string): string | null => {
    const trimmed = value.trim();
    
    if (!trimmed) {
      return "Name is required";
    }
    
    if (trimmed.length < 2) {
      return "Name must be at least 2 characters long";
    }
    
    if (trimmed.length > 50) {
      return "Name must be less than 50 characters";
    }
    
    // Only letters, spaces, hyphens, and apostrophes
    if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) {
      return "Name can only contain letters, spaces, hyphens, and apostrophes";
    }
    
    // No consecutive spaces or special characters
    if (/\s{2,}|[-']{2,}/.test(trimmed)) {
      return "Name cannot have consecutive spaces or special characters";
    }
    
    // Must start and end with a letter
    if (!/^[a-zA-Z].*[a-zA-Z]$/.test(trimmed) && trimmed.length > 1) {
      return "Name must start and end with a letter";
    }
    
    return null;
  },
  
  role: (value: string): string | null => {
    const trimmed = value.trim();
    
    if (!trimmed) {
      return "Role is required";
    }
    
    if (trimmed.length < 3) {
      return "Role must be at least 3 characters long";
    }
    
    if (trimmed.length > 60) {
      return "Role must be less than 60 characters";
    }
    
    // Only letters, spaces, and basic punctuation - NO NUMBERS
    if (!/^[a-zA-Z\s\-.,()&/]+$/.test(trimmed)) {
      return "Role can only contain letters, spaces, and basic punctuation";
    }
    
    // No consecutive spaces
    if (/\s{2,}/.test(trimmed)) {
      return "Role cannot have consecutive spaces";
    }
    
    // Must start with a letter
    if (!/^[a-zA-Z]/.test(trimmed)) {
      return "Role must start with a letter";
    }
    
    return null;
  },
  
  experience: (value: string): string | null => {
    const trimmed = value.trim();
    
    if (!trimmed) {
      return "Experience is required";
    }
    
    if (trimmed.length < 3) {
      return "Experience must be at least 3 characters long";
    }
    
    if (trimmed.length > 30) {
      return "Experience must be less than 30 characters";
    }
    
    // Allow numbers, letters, spaces, and common symbols for "5 years", "10+ years", etc.
    if (!/^[a-zA-Z0-9\s\-+.()]+$/.test(trimmed)) {
      return "Experience contains invalid characters";
    }
    
    // No consecutive spaces
    if (/\s{2,}/.test(trimmed)) {
      return "Experience cannot have consecutive spaces";
    }
    
    // Must contain at least one number or letter
    if (!/[a-zA-Z0-9]/.test(trimmed)) {
      return "Experience must contain letters or numbers";
    }
    
    return null;
  },
  
  students: (value: string): string | null => {
    const trimmed = value.trim();
    
    if (!trimmed) {
      return "Students count is required";
    }
    
    if (trimmed.length < 1) {
      return "Students count cannot be empty";
    }
    
    if (trimmed.length > 15) {
      return "Students field must be less than 15 characters";
    }
    
    // Allow numbers, letters, spaces, and basic symbols for "24 students", "100+", etc.
    if (!/^[a-zA-Z0-9\s\-+]+$/.test(trimmed)) {
      return "Students field contains invalid characters";
    }
    
    // No consecutive spaces
    if (/\s{2,}/.test(trimmed)) {
      return "Students field cannot have consecutive spaces";
    }
    
    // Must contain at least one number
    if (!/\d/.test(trimmed)) {
      return "Students field must contain at least one number";
    }
    
    // If it starts with a number, validate range
    const match = trimmed.match(/^(\d+)/);
    if (match) {
      const num = parseInt(match[1]);
      if (num < 0) {
        return "Number of students cannot be negative";
      }
      if (num > 10000) {
        return "Number of students cannot exceed 10,000";
      }
    }
    
    return null;
  }
};

// Toast component
interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500'
  const Icon = type === 'success' ? CheckCircle : AlertCircle
  
  return (
    <div className={`fixed top-4 right-4 z-50 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out translate-x-0 opacity-100`}>
      <div className="flex items-center space-x-2">
        <Icon className="w-5 h-5" />
        <span className="font-medium">{message}</span>
        <button
        title="close"
          onClick={onClose}
          className="ml-2 text-white hover:text-gray-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [toast, setToast] = useState<Toast | null>(null)
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: "Alakh Pandey",
    role: "Senior Physics Instructor",
    experience: "5 years experience",
    students: "24 students"
  })
  
  // Current displayed data
  const [currentData, setCurrentData] = useState<FormData>({
    name: "Alakh Pandey",
    role: "Senior Physics Instructor",
    experience: "5 years experience",
    students: "24 students"
  })
  
  // Validation errors
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // Show toast
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  // Validate single field
  const validateField = (name: keyof FormData, value: string): string | null => {
    const validator = profileSchema[name]
    return validator ? validator(value) : null
  }

  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}
    Object.keys(formData).forEach(key => {
      const error = validateField(key as keyof FormData, formData[key as keyof FormData])
      if (error) newErrors[key as keyof ValidationErrors] = error
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle input change
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  // Handle input blur
  const handleInputBlur = (field: keyof FormData) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    const error = validateField(field, formData[field])
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }))
    }
  }

  // Handle save
  const handleSave = async () => {
    if (!validateForm()) {
      showToast("Please fix the errors before saving", 'error')
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Update current data
      setCurrentData({ ...formData })
      setIsModalOpen(false)
      showToast("Profile updated successfully!")
      
      // Reset form state
      setTouched({})
      setErrors({})
    } catch {
      showToast("Failed to update profile. Please try again.", 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle cancel
  const handleCancel = () => {
    setFormData({ ...currentData })
    setErrors({})
    setTouched({})
    setIsModalOpen(false)
  }

  return (
    <div className="my-8 select-none">
      {/* Toast */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      
      <div className="bg-gray-100 rounded-2xl -mt-6 md:-mt-4 shadow-md border border-gray-200 p-6 transition-all duration-300 hover:shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Profile Info */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex ">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                {currentData.name.split(" ").map((n) => n[0]).join("").substring(0, 2)}
              </div>
              <div className="mt-14 -ml-6 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center ">
                <Check className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 transition-all duration-300">
                {currentData.name}
              </h1>
              <p className="text-base md:text-lg text-gray-600 transition-all duration-300">
                {currentData.role}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                <div className="flex items-center space-x-1 transition-all duration-300 hover:scale-105">
                  <Award className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-600">{currentData.experience}</span>
                </div>
                <div className="flex items-center space-x-1 transition-all duration-300 hover:scale-105">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600">{currentData.students}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center space-x-2 transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 touch-manipulation"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">Edit Profile</DialogTitle>
              </DialogHeader>
              <div className="space-y-5 py-4">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
                    onBlur={() => handleInputBlur('name')}
                    className={`transition-all duration-300 ${
                      errors.name ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && touched.name && (
                    <p className="text-sm text-red-500 flex items-center space-x-1 transform transition-all duration-300 translate-y-0 opacity-100">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                {/* Role Field */}
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                    Role
                  </Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('role', e.target.value)}
                    onBlur={() => handleInputBlur('role')}
                    className={`transition-all duration-300 ${
                      errors.role ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'
                    }`}
                    placeholder="Enter your role/position"
                  />
                  {errors.role && touched.role && (
                    <p className="text-sm text-red-500 flex items-center space-x-1 transform transition-all duration-300 translate-y-0 opacity-100">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.role}</span>
                    </p>
                  )}
                </div>

                {/* Experience Field */}
                <div className="space-y-2">
                  <Label htmlFor="experience" className="text-sm font-medium text-gray-700">
                    Experience
                  </Label>
                  <Input
                    id="experience"
                    value={formData.experience}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('experience', e.target.value)}
                    onBlur={() => handleInputBlur('experience')}
                    className={`transition-all duration-300 ${
                      errors.experience ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'
                    }`}
                    placeholder="e.g., 5 years experience"
                  />
                  {errors.experience && touched.experience && (
                    <p className="text-sm text-red-500 flex items-center space-x-1 transform transition-all duration-300 translate-y-0 opacity-100">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.experience}</span>
                    </p>
                  )}
                </div>

                {/* Students Field */}
                <div className="space-y-2">
                  <Label htmlFor="students" className="text-sm font-medium text-gray-700">
                    Students
                  </Label>
                  <Input
                    id="students"
                    value={formData.students}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('students', e.target.value)}
                    onBlur={() => handleInputBlur('students')}
                    className={`transition-all duration-300 ${
                      errors.students ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'
                    }`}
                    placeholder="e.g., 24 students"
                  />
                  {errors.students && touched.students && (
                    <p className="text-sm text-red-500 flex items-center space-x-1 transform transition-all duration-300 translate-y-0 opacity-100">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.students}</span>
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button 
                  variant="ghost" 
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={isLoading}
                  className="transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation min-w-[100px]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}

export default Header