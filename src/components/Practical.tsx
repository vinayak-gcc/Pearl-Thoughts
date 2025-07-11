"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, GraduationCap, Save, X, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// TypeScript Interfaces
interface ValidationErrors {
  name?: string;
  rate?: string;
  level?: string;
  years?: string;
}

interface QualificationData {
  name: string;
  rate: string;
  level: string;
  years: number;
}

interface NewQualificationData {
  name: string;
  rate: string;
  level: string;
  years: string;
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

const initialQualifications = [
  { name: "Classical Mechanics", rate: "$30.00", level: "Intermediate", years: 3 },
  { name: "Quantum Physics", rate: "$40.00", level: "Advanced", years: 5 },
  { name: "Electromagnetism", rate: "$35.00", level: "Intermediate", years: 4 },
  { name: "Thermodynamics", rate: "$30.00", level: "Beginner", years: 2 },
  { name: "Nuclear Physics", rate: "$45.00", level: "Expert", years: 7 },
]

const levelOptions = ["Beginner", "Intermediate", "Advanced", "Expert"]

// Validation Schema

const PracticalSchema = {
  name: (value: string): string | null => {
    const trimmed = value.trim();
    if (!trimmed) {
      return "Subject name is required";
    }
    if (!/^[A-Za-z0-9\s\-']+$/.test(trimmed)) {
      return "Subject name can only contain letters, numbers, spaces, hyphens, and apostrophes";
    }
    if (trimmed.length < 2) {
      return "Subject name must be at least 2 characters long";
    }
    if (trimmed.length > 100) {
      return "Subject name must be less than 100 characters";
    }
    return null;
  },

  rate: (value: string): string | null => {
    const trimmed = value.trim();
    if (!trimmed) {
      return "Rate is required";
    }
    const cleanValue = trimmed.replace(/[$,\s]/g, '');
    if (!/^\d+(\.\d{1,2})?$/.test(cleanValue)) {
      return "Please enter a valid rate (e.g., 30 or 30.00)";
    }
    const rateNumber = parseFloat(cleanValue);
    if (rateNumber < 0) {
      return "Rate cannot be negative";
    }
    if (rateNumber > 1000) {
      return "Rate cannot exceed $1000";
    }
    return null;
  },

  level: (value: string): string | null => {
    const trimmed = value.trim();
    if (!trimmed) {
      return "Level is required";
    }
    if (!levelOptions.includes(trimmed as string)) {
      return "Please select a valid level";
    }
    return null;
  },

  years: (value: string): string | null => {
    const trimmed = value.trim();
    if (!trimmed) {
      return "Years of experience is required";
    }
    if (!/^\d+$/.test(trimmed)) {
      return "Please enter a whole number (no decimals or symbols)";
    }
    const yearsNumber = parseInt(trimmed);
    if (yearsNumber < 0) {
      return "Years cannot be negative";
    }
    if (yearsNumber > 50) {
      return "Years cannot exceed 50";
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

const Qualification = () => {
  const [qualifications, setQualifications] = useState<QualificationData[]>(initialQualifications)
  const [showAll, setShowAll] = useState<boolean>(false)
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [toast, setToast] = useState<Toast | null>(null)

  const [newQual, setNewQual] = useState<NewQualificationData>({
    name: "",
    rate: "",
    level: "",
    years: "",
  })

  // Validation states
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // Show toast
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  // Format rate to ensure proper format
  const formatRate = (value: string): string => {
    // Remove existing $ and spaces
    const cleanValue = value.replace(/[$\s]/g, '')
    const rateNumber = parseFloat(cleanValue)
    
    if (isNaN(rateNumber)) return value
    
    // Format as currency
    return `$${rateNumber.toFixed(2)}`
  }

  // Validate single field
  const validateField = (name: keyof NewQualificationData, value: string): string | null => {
    const validator = PracticalSchema[name]
    return validator ? validator(value) : null
  }

  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}
    Object.keys(newQual).forEach(key => {
      const error = validateField(key as keyof NewQualificationData, newQual[key as keyof NewQualificationData])
      if (error) newErrors[key as keyof ValidationErrors] = error
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle input change
  const handleInputChange = (field: keyof NewQualificationData, value: string) => {
    setNewQual(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  // Handle input blur
  const handleInputBlur = (field: keyof NewQualificationData) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    const error = validateField(field, newQual[field])
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }))
    }
  }

  // Handle opening modal
  const handleOpenModal = () => {
    // Reset form
    setNewQual({ name: "", rate: "", level: "", years: "" })
    // Reset validation states
    setErrors({})
    setTouched({})
    setModalOpen(true)
  }

  // Check for duplicate qualification
  const isDuplicate = (name: string): boolean => {
    return qualifications.some(qual => 
      qual.name.toLowerCase().trim() === name.toLowerCase().trim()
    )
  }

  // Handle add qualification
  const handleAdd = async () => {
    if (!validateForm()) {
      showToast("Please fix the errors before saving", 'error')
      return
    }

    // Check for duplicate
    if (isDuplicate(newQual.name)) {
      setErrors(prev => ({ ...prev, name: "This qualification already exists" }))
      showToast("This qualification already exists", 'error')
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Add new qualification
      const formattedQual: QualificationData = {
        name: newQual.name.trim(),
        rate: formatRate(newQual.rate),
        level: newQual.level,
        years: parseInt(newQual.years)
      }
      
      setQualifications(prev => [...prev, formattedQual])
      setNewQual({ name: "", rate: "", level: "", years: "" })
      setModalOpen(false)
      showToast("Qualification added successfully!")
      
      // Reset form state
      setTouched({})
      setErrors({})
    } catch {
      showToast("Failed to add qualification. Please try again.", 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const baseShown = qualifications.slice(0, 3)
  const hidden = qualifications.slice(3)

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

      {/* Practical */}
      <Card className="border-0 bg-gray-100 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2.5">
          <CardTitle className="text-base font-semibold flex items-center space-x-2">
            <GraduationCap className="w-4 h-4 text-orange-600" />
            <span>Practical Lessons</span>
          </CardTitle>
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" onClick={handleOpenModal}>
                <Plus className="w-3 h-3" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Qualification</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="grid gap-2">
                  <Label htmlFor="name">Subject Name</Label>
                  <Input
                    id="name"
                    value={newQual.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    onBlur={() => handleInputBlur('name')}
                    className={errors.name ? 'border-red-500' : ''}
                    placeholder="e.g., Quantum Physics"
                  />
                  {errors.name && touched.name && (
                    <p className="text-sm text-red-500 flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="rate">Rate</Label>
                  <Input
                    id="rate"
                    value={newQual.rate}
                    onChange={(e) => handleInputChange('rate', e.target.value)}
                    onBlur={() => handleInputBlur('rate')}
                    className={errors.rate ? 'border-red-500' : ''}
                    placeholder="e.g., $30.00 or 30"
                  />
                  {errors.rate && touched.rate && (
                    <p className="text-sm text-red-500 flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.rate}</span>
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="level">Level</Label>
                  <Select 
                    value={newQual.level} 
                    onValueChange={(value: string) => handleInputChange('level', value)}
                  >
                    <SelectTrigger className={errors.level ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {levelOptions.map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.level && touched.level && (
                    <p className="text-sm text-red-500 flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.level}</span>
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="years">Years of Experience</Label>
                  <Input
                    id="years"
                    type="number"
                    min="0"
                    max="50"
                    value={newQual.years}
                    onChange={(e) => handleInputChange('years', e.target.value)}
                    onBlur={() => handleInputBlur('years')}
                    className={errors.years ? 'border-red-500' : ''}
                    placeholder="e.g., 5"
                  />
                  {errors.years && touched.years && (
                    <p className="text-sm text-red-500 flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.years}</span>
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setModalOpen(false)} disabled={isLoading}>
                  <X className="w-4 h-4 mr-1" /> Cancel
                </Button>
                <Button onClick={handleAdd} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-1" /> Add
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          <div className="space-y-2">
            {!showAll ? (
              <>
                {/* Show first 3 items normally */}
                {baseShown.map((qual, index) => (
                  <div
                    key={index}
                    className="p-2 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{qual.name}</h4>
                      <span className="text-sm font-bold text-green-600">{qual.rate}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 mt-0.5 rounded-full">
                        {qual.level}
                      </span>
                      <span>{qual.years}y exp.</span>
                    </div>
                  </div>
                ))}
                
                {/* Show "+n more" button */}
                {hidden.length > 0 && (
                  <div className="text-center pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={() => setShowAll(true)}
                    >
                      +{hidden.length} more
                    </Button>
                  </div>
                )}
              </>
            ) : (
              /* When expanded, show all items in scrollable area with same height as original 3 items + button */
              <div className="max-h-[253px] overflow-y-auto pr-1 space-y-2">
                {qualifications.map((qual, index) => (
                  <div
                    key={index}
                    className="p-2 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{qual.name}</h4>
                      <span className="text-sm font-bold text-green-600">{qual.rate}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 mt-0.5 rounded-full">
                        {qual.level}
                      </span>
                      <span>{qual.years}y exp.</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Qualification