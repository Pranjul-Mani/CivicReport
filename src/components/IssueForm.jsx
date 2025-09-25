"use client"

import { useState, useEffect } from "react"
import { useSession, signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, MapPin, Upload, X, AlertCircle, CheckCircle2 } from "lucide-react"

export default function IssueForm({ onSubmit, onCancel, initialData }) {
  const { data: session, status } = useSession()

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category: initialData?.category || "",
    location: initialData?.location || "",
    imageFile: null,
  });

  const [imagePreview, setImagePreview] = useState(null)
  const [isSubmitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  useEffect(() => {
    if (initialData?.image?.url) {
      setImagePreview(initialData.image.url)
    }
  }, [initialData])

  const categories = [
    "Road Maintenance",
    "Lighting",
    "Sanitation",
    "Parks & Recreation",
    "Public Safety",
    "Water & Sewage",
    "Traffic",
    "Other"
  ]

  const validateField = (field, value) => {
    const newErrors = { ...errors }
    
    switch (field) {
      case 'title':
        if (!value.trim()) {
          newErrors.title = 'Title is required'
        } else if (value.trim().length < 5) {
          newErrors.title = 'Title must be at least 5 characters'
        } else {
          delete newErrors.title
        }
        break
      case 'description':
        if (!value.trim()) {
          newErrors.description = 'Description is required'
        } else if (value.trim().length < 10) {
          newErrors.description = 'Description must be at least 10 characters'
        } else {
          delete newErrors.description
        }
        break
      case 'category':
        if (!value) {
          newErrors.category = 'Category is required'
        } else {
          delete newErrors.category
        }
        break
      case 'location':
        if (!value.trim()) {
          newErrors.location = 'Location is required'
        } else {
          delete newErrors.location
        }
        break
    }
    
    setErrors(newErrors)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    validateField(field, value)
  }

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
     
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB')
        return
      }
      
      setFormData(prev => ({ ...prev, imageFile: file }))
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setFormData(prev => ({ ...prev, imageFile: null }))
    setImagePreview(initialData?.image?.url || null)
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    
    const fieldsToValidate = ['title', 'description', 'category', 'location']
    fieldsToValidate.forEach(field => {
      validateField(field, formData[field])
      setTouched(prev => ({ ...prev, [field]: true }))
    })
    
   
    if (Object.keys(errors).length > 0) {
      return
    }
    
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("description", formData.description);
      fd.append("category", formData.category);
      fd.append("location", formData.location);
      if (formData.imageFile) {
        fd.append("image", formData.imageFile);
      }

      const method = initialData ? "PUT" : "POST";
      const url = initialData ? `/api/issues/${initialData._id}` : "/api/issues";

      const res = await fetch(url, { method, body: fd });
      if (res.ok) {
        const updated = await res.json();
        if (typeof onSubmit === "function") onSubmit(updated);
      } else {
        const txt = await res.text();
        console.error("Submit failed", txt);
        alert("Failed to submit: " + txt);
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting issue");
    } finally {
      setSubmitting(false);
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          const location = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          handleInputChange('location', location)
        },
        (error) => {
          console.error('Error getting location:', error)
          alert('Unable to get your location. Please enter it manually.')
        }
      )
    } else {
      alert('Geolocation is not supported by this browser.')
    }
  }

  const handleCancel = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      location: "",
      imageFile: null
    })
    setImagePreview(null)
    setErrors({})
    setTouched({})
    if (typeof onCancel === "function") onCancel()
  }

  const isFormValid = () => {
    return formData.title.trim() && 
           formData.description.trim() && 
           formData.category && 
           formData.location.trim() &&
           Object.keys(errors).length === 0
  }

  if (status === "unauthenticated") {
    return (
      <Card className="mx-auto max-w-md border-0 shadow-lg bg-white">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
            <AlertCircle className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Authentication Required
          </CardTitle>
          <CardDescription className="text-gray-600">
            Please sign in to report civic issues and help improve your community
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="space-y-4">
            <Button 
              onClick={() => signIn()} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5"
            >
              Sign In to Continue
            </Button>
            <Button 
              onClick={onCancel} 
              variant="outline" 
              className="w-full border-gray-300 text-gray-700"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (status === "loading") {
    return (
      <Card className="mx-auto max-w-md border-0 shadow-lg bg-white">
        <CardContent className="px-6 py-12">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mx-auto max-w-3xl border-0 shadow-lg bg-white">
      <CardHeader className="border-b border-gray-100 ">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
              {initialData ? (
                <CheckCircle2 className="h-6 w-6 text-blue-600" />
              ) : (
                <AlertCircle className="h-6 w-6 text-blue-600" />
              )}
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                {initialData ? "Edit Issue Report" : "Report Civic Issue"}
              </CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                {initialData 
                  ? "Update the details of your reported issue" 
                  : "Help improve your community by reporting infrastructure and civic issues"
                }
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancel}
            className="cursor-pointer h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="max-h-[70vh] overflow-y-auto ">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-2">
            <Label htmlFor="title" className="text-lg font-semibold text-gray-700">
              Issue Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Brief, descriptive title for the issue"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              onBlur={() => handleBlur('title')}
              className={`transition-colors ${
                touched.title && errors.title 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : touched.title && !errors.title 
                    ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
              required
            />
            {touched.title && errors.title && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.title}
              </p>
            )}
          </div>

          
          <div className="space-y-2">
            <Label className="text-lg font-semibold text-gray-700">
              Category <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange('category', value)}
              onOpenChange={() => handleBlur('category')}
            >
              <SelectTrigger className={`transition-colors ${
                touched.category && errors.category 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : touched.category && !errors.category 
                    ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}>
                <SelectValue placeholder="Select the issue category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="cursor-pointer">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {touched.category && errors.category && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.category}
              </p>
            )}
          </div>

         
          <div className="space-y-2">
            <Label htmlFor="description" className="text-lg font-semibold text-gray-700">
              Detailed Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Provide a comprehensive description of the issue, including any relevant details that would help address it effectively"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              onBlur={() => handleBlur('description')}
              className={`min-h-[100px] resize-none transition-colors ${
                touched.description && errors.description 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : touched.description && !errors.description 
                    ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
              required
            />
            {touched.description && errors.description && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.description}
              </p>
            )}
          </div>

        
          <div className="space-y-2">
            <Label htmlFor="location" className="text-lg font-semibold text-gray-700">
              Location <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="location"
                placeholder="Street address or coordinates"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                onBlur={() => handleBlur('location')}
                className={`flex-1 transition-colors ${
                  touched.location && errors.location 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : touched.location && !errors.location 
                      ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
                required
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={getCurrentLocation}
                title="Use current location"
                className="shrink-0 border-gray-300 hover:bg-blue-50 hover:border-blue-300"
              >
                <MapPin className="h-4 w-4 text-blue-600" />
              </Button>
            </div>
            {touched.location && errors.location && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.location}
              </p>
            )}
          </div>

         
          <div className="space-y-2">
            <Label className="text-lg font-medium text-gray-700">
              Supporting Photo
            </Label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Issue preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="cursor-pointer absolute top-2 right-2 bg-red-500 hover:bg-red-600"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div 
                  className="text-center py-8 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors" 
                  onClick={() => document.getElementById('image-input').click()}
                >
                  <Camera className="mx-auto h-10 w-10 text-gray-400" />
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700">
                      Add a photo to support your report
                    </p>
                   
                  </div>
                  <input
                    id="image-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          </div>

      
          <div className="flex gap-3 pt-6 border-t border-gray-100">
            <Button
              type="button"
              onClick={handleCancel}
              variant="outline"
              disabled={isSubmitting}
              className="cursor-pointer flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !isFormValid()}
              className="cursor-pointer flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {initialData ? "Updating..." : "Submitting..."}
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  {initialData ? "Update Issue" : "Submit Report"}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}