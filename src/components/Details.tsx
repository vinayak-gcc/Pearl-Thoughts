import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, User, Save, X, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// TypeScript Interfaces
interface ValidationErrors {
  fullName?: string;
  workEmail?: string;
  role?: string;
}

interface PersonalDetailsData {
  fullName: string;
  workEmail: string;
  role: string;
}

interface Toast {
  message: string;
  type: 'success' | 'error';
}

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

// Validation Schema
const personalDetailsSchema = {
  fullName: (value: string): string | null => {
    const trimmed = value.trim();
    
    if (!trimmed) {
      return "Full name is required";
    }
    
    if (trimmed.length < 2) {
      return "Full name must be at least 2 characters long";
    }
    
    if (trimmed.length > 50) {
      return "Full name must be less than 50 characters";
    }
    
    // Only letters, spaces, hyphens, and apostrophes
    if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) {
      return "Full name can only contain letters, spaces, hyphens, and apostrophes";
    }
    
    // No consecutive spaces or special characters
    if (/\s{2,}|[-']{2,}/.test(trimmed)) {
      return "Full name cannot have consecutive spaces or special characters";
    }
    
    // Must start and end with a letter
    if (!/^[a-zA-Z].*[a-zA-Z]$/.test(trimmed) && trimmed.length > 1) {
      return "Full name must start and end with a letter";
    }
    
    // Must contain at least one space (first and last name)
    if (!/\s/.test(trimmed)) {
      return "Please enter your full name (first and last name)";
    }
    
    // No leading/trailing spaces after trim, and no spaces at word boundaries
    if (/^\s|\s$/.test(trimmed)) {
      return "Full name cannot start or end with spaces";
    }
    
    return null;
  },
  
  workEmail: (value: string): string | null => {
    const trimmed = value.trim().toLowerCase();
    
    if (!trimmed) {
      return "Work email is required";
    }
    
    if (trimmed.length > 100) {
      return "Email must be less than 100 characters";
    }
    
    // More comprehensive email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmed)) {
      return "Please enter a valid email address";
    }
    
    // No consecutive dots
    if (/\.{2,}/.test(trimmed)) {
      return "Email cannot contain consecutive dots";
    }
    
    // Must not start or end with dot
    if (/^\.|\.$/.test(trimmed)) {
      return "Email cannot start or end with a dot";
    }
    
    // Local part (before @) validation
    const [localPart, domainPart] = trimmed.split('@');
    
    if (localPart.length < 1 || localPart.length > 64) {
      return "Email username must be between 1 and 64 characters";
    }
    
    if (domainPart.length < 1 || domainPart.length > 255) {
      return "Email domain is invalid";
    }
    
    // Domain must have at least one dot
    if (!/\./.test(domainPart)) {
      return "Email domain must contain at least one dot";
    }
    
    // No spaces allowed
    if (/\s/.test(trimmed)) {
      return "Email cannot contain spaces";
    }
    
    // Common work email domain check (optional - can be removed if too restrictive)
    const personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];
    if (personalDomains.includes(domainPart)) {
      return "Please use your work email address";
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
    
    // Must end with a letter (no trailing punctuation)
    if (!/[a-zA-Z]$/.test(trimmed)) {
      return "Role must end with a letter";
    }
    
    // At least 2 words for professional roles
    if (!/\s/.test(trimmed)) {
      return "Please enter a more descriptive role (e.g., 'Senior Developer', 'Marketing Manager')";
    }
    
    return null;
  }
};

// Toast Component
const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500'
  const Icon = type === 'success' ? CheckCircle : AlertCircle
  
  return (
    <div className={`fixed top-4 right-4 z-50 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out translate-x-0 opacity-100`}>
      <div className="flex items-center space-x-2">
        <Icon className="w-5 h-5" />
        <span className="font-medium">{message}</span>
        <button
          title="Close"
          onClick={onClose}
          className="ml-2 text-white hover:text-gray-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

const Details = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [toast, setToast] = useState<Toast | null>(null)

  // Current displayed data
  const [personalDetails, setPersonalDetails] = useState<PersonalDetailsData>({
    fullName: "Alakh Pandey",
    workEmail: "alakhpandey.allen@teachhub.com",
    role: "Head Physics Teacher"
  })

  // Form data for editing
  const [editDetails, setEditDetails] = useState<PersonalDetailsData>({
    fullName: "",
    workEmail: "",
    role: ""
  })

  // Validation states
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // Show toast
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  // Validate single field
  const validateField = (name: keyof PersonalDetailsData, value: string): string | null => {
    const validator = personalDetailsSchema[name]
    return validator ? validator(value) : null
  }

  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}
    Object.keys(editDetails).forEach(key => {
      const error = validateField(key as keyof PersonalDetailsData, editDetails[key as keyof PersonalDetailsData])
      if (error) newErrors[key as keyof ValidationErrors] = error
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle input change
  const handleInputChange = (field: keyof PersonalDetailsData, value: string) => {
    setEditDetails(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  // Handle input blur
  const handleInputBlur = (field: keyof PersonalDetailsData) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    const error = validateField(field, editDetails[field])
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }))
    }
  }

  // Handle opening modal
  const handleEdit = () => {
    // Pre-populate the form with current values
    setEditDetails({
      fullName: personalDetails.fullName,
      workEmail: personalDetails.workEmail,
      role: personalDetails.role
    })
    // Reset validation states
    setErrors({})
    setTouched({})
    setModalOpen(true)
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
      
      // Update personal details
      setPersonalDetails({
        fullName: editDetails.fullName,
        workEmail: editDetails.workEmail,
        role: editDetails.role
      })
      
      setModalOpen(false)
      showToast("Personal details updated successfully!")
      
      // Reset form state
      setTouched({})
      setErrors({})
    } catch {
      showToast("Failed to update personal details. Please try again.", 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {/* Toast */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Personal Details */}
      <Card className="border-0 bg-gray-100 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base font-semibold flex items-center space-x-2">
            <User className="w-4 h-4 text-blue-600" />
            <span>Personal Details</span>
          </CardTitle>
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" onClick={handleEdit}>
                <Edit className="w-3 h-3" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Personal Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={editDetails.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    onBlur={() => handleInputBlur('fullName')}
                    className={errors.fullName ? 'border-red-500' : ''}
                  />
                  {errors.fullName && touched.fullName && (
                    <p className="text-sm text-red-500 flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.fullName}</span>
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="workEmail">Work Email</Label>
                  <Input
                    id="workEmail"
                    type="email"
                    value={editDetails.workEmail}
                    onChange={(e) => handleInputChange('workEmail', e.target.value)}
                    onBlur={() => handleInputBlur('workEmail')}
                    className={errors.workEmail ? 'border-red-500' : ''}
                  />
                  {errors.workEmail && touched.workEmail && (
                    <p className="text-sm text-red-500 flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.workEmail}</span>
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={editDetails.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    onBlur={() => handleInputBlur('role')}
                    className={errors.role ? 'border-red-500' : ''}
                  />
                  {errors.role && touched.role && (
                    <p className="text-sm text-red-500 flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.role}</span>
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setModalOpen(false)} disabled={isLoading}>
                  <X className="w-4 h-4 mr-1" /> Cancel
                </Button>
                <Button onClick={handleSave} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-1" /> Save
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-3">
            <div className="p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100 rounded-lg">
              <label className="text-xs font-medium text-gray-600">Full Name</label>
              <p className="font-semibold text-gray-900 text-sm">{personalDetails.fullName}</p>
            </div>
            <div className="p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100 rounded-lg">
              <label className="text-xs font-medium text-gray-600">Work Email</label>
              <p className="font-semibold text-gray-900 text-sm">{personalDetails.workEmail}</p>
            </div>
            <div className="p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100 rounded-lg">
              <label className="text-xs font-medium text-gray-600">Role</label>
              <p className="font-semibold text-gray-900 text-sm">{personalDetails.role}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Details