"use client"

import React, { useState } from "react"
import {
  Phone,
  Mail,
  MapPin,
  Plus,
  Save,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
  email?: string;
  phone?: string;
  address?: string;
}

interface ContactData {
  email: string;
  phone: string;
  address: string;
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
const contactSchema = {
  email: (value: string): string | null => {
    if (!value || value.trim().length === 0) {
      return "Email is required"
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value.trim())) {
      return "Please enter a valid email address"
    }
    if (value.trim().length > 100) {
      return "Email must be less than 100 characters"
    }
    return null
  },
  phone: (value: string): string | null => {
    if (!value || value.trim().length === 0) {
      return "Phone number is required"
    }
    // Remove all non-digit characters for validation
    const digitsOnly = value.replace(/\D/g, '')
    if (digitsOnly.length < 10) {
      return "Phone number must be at least 10 digits"
    }
    if (digitsOnly.length > 15) {
      return "Phone number must be less than 15 digits"
    }
    return null
  },
  address: (value: string): string | null => {
    if (!value || value.trim().length === 0) {
      return "Address is required"
    }
    if (value.trim().length < 10) {
      return "Address must be at least 10 characters long"
    }
    if (value.trim().length > 500) {
      return "Address must be less than 500 characters"
    }
    return null
  }
}

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

const Contact: React.FC = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [toast, setToast] = useState<Toast | null>(null)

  // Current displayed data
  const [contactInfo, setContactInfo] = useState<ContactData>({
    email: "alakhpandey@email.com",
    phone: "(416) 658-3027",
    address: `B/152, Near Allen House, 
Akota, Patna, Bihar, Ohio
222222`
  })

  // Form data for editing
  const [editContact, setEditContact] = useState<ContactData>({
    email: "",
    phone: "",
    address: ""
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
  const validateField = (name: keyof ContactData, value: string): string | null => {
    const validator = contactSchema[name]
    return validator ? validator(value) : null
  }

  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}
    Object.keys(editContact).forEach(key => {
      const error = validateField(key as keyof ContactData, editContact[key as keyof ContactData])
      if (error) newErrors[key as keyof ValidationErrors] = error
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle input change
  const handleInputChange = (field: keyof ContactData, value: string) => {
    setEditContact(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  // Handle input blur
  const handleInputBlur = (field: keyof ContactData) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    const error = validateField(field, editContact[field])
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }))
    }
  }

  // Handle opening modal
  const handleOpenModal = () => {
    // Pre-populate the form with current values
    setEditContact({
      email: contactInfo.email,
      phone: contactInfo.phone,
      address: contactInfo.address
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
      
      // Update contact info
      setContactInfo({
        email: editContact.email,
        phone: editContact.phone,
        address: editContact.address
      })
      
      setModalOpen(false)
      showToast("Contact information updated successfully!")
      
      // Reset form state
      setTouched({})
      setErrors({})
    } catch {
      showToast("Failed to update contact information. Please try again.", 'error')
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

      {/* Contact Information */}
      <Card className="border-0 shadow-md bg-gray-100">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base font-semibold flex items-center space-x-2">
            <Phone className="w-4 h-4 text-green-600" />
            <span>Contact Info</span>
          </CardTitle>
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" onClick={handleOpenModal}>
                <Plus className="w-3 h-3" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Contact Info</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="grid gap-2">
                  <Label htmlFor="email">Personal Email</Label>
                  <Input 
                    id="email" 
                    value={editContact.email} 
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onBlur={() => handleInputBlur('email')}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && touched.email && (
                    <p className="text-sm text-red-500 flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    value={editContact.phone} 
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    onBlur={() => handleInputBlur('phone')}
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && touched.phone && (
                    <p className="text-sm text-red-500 flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.phone}</span>
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Input 
                    id="address" 
                    value={editContact.address} 
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    onBlur={() => handleInputBlur('address')}
                    className={errors.address ? 'border-red-500' : ''}
                  />
                  {errors.address && touched.address && (
                    <p className="text-sm text-red-500 flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.address}</span>
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setModalOpen(false)} disabled={isLoading}>
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100 rounded-lg">
            <label className="text-xs font-medium text-gray-600">Personal Email</label>
            <div className="flex items-center space-x-2 ">
              <Mail className="w-3 h-3 text-gray-400 mt-1" />
              <span className="text-gray-900 text-sm">{contactInfo.email}</span>
            </div>
          </div>
          <div className="p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100 rounded-lg">
            <label className="text-xs font-medium text-gray-600">Phone Number</label>
            <div className="flex items-center space-x-2 ">
              <Phone className="w-3 h-3 text-gray-400 mt-1" />
              <span className="text-gray-900 text-sm">{contactInfo.phone}</span>
            </div>
          </div>
          <div className="p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100 rounded-lg">
            <label className="text-xs font-medium text-gray-600">Address</label>
            <div className="flex items-start space-x-2">
              <MapPin className="w-3 h-3 text-gray-400 mt-1" />
              <div className="text-gray-900 text-sm">
                <p>{contactInfo.address}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Contact