"use client"

import { useState, useEffect } from "react"
import { useSession, signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, MapPin, Upload, X } from "lucide-react"

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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
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
          handleInputChange('location', `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
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
    if (typeof onCancel === "function") onCancel()
  }

  
  if (status === "unauthenticated") {
    return (
      <Card className="border-0 shadow-none">
        <CardHeader className="pb-2 px-5 pt-5">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Sign In Required</CardTitle>
              <CardDescription className="text-sm text-gray-500">
                You must be signed in to report civic issues
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancel}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-4">
          <div className="text-center py-6">
            <Button onClick={() => signIn()} className="mx-auto">
              Sign In to Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

 
  if (status === "loading") {
    return (
      <Card className="border-0 shadow-none">
        <CardContent className="px-5 py-8">
          <div className="text-center">Loading...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="pb-2 px-5 pt-5">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              {initialData ? "Edit Issue" : "Report New Issue"}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              {initialData ? "Update your issue details" : "Help improve your community by reporting civic issues"}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancel}
            className="h-6 w-6 cursor-pointer"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
      </CardHeader>

      
      <CardContent className="max-h-[70vh] overflow-y-auto px-5 pb-4">
        <form onSubmit={handleSubmit} className="space-y-3">
        
          <div className="space-y-1">
            <Label htmlFor="title">Issue Title *</Label>
            <Input
              id="title"
              placeholder="Brief description of the issue"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
            />
          </div>

       
          <div className="space-y-1">
            <Label>Category *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => handleInputChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

         
          <div className="space-y-1">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Provide more details about the issue"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="min-h-[80px]"
              required
            />
          </div>

         
          <div className="space-y-1">
            <Label htmlFor="location">Location *</Label>
            <div className="flex gap-2">
              <Input
                id="location"
                placeholder="Enter address or coordinates"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                required
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={getCurrentLocation}
                title="Use current location"
              >
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
          </div>

         
          <div className="space-y-1">
            <Label>Photo</Label>
            <div className="border border-dashed border-gray-300 rounded-md p-4">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Issue preview"
                    className="w-full h-36 object-cover rounded"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Camera className="mx-auto h-8 w-8 text-gray-400" />
                  <div className="mt-2">
                    <Label htmlFor="image-input" className="cursor-pointer text-sm text-gray-600">
                      Take Photo
                    </Label>
                    <input
                      id="image-input"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden "
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={handleCancel}
              variant="outline"
              disabled={isSubmitting}
              className="flex-1 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                !formData.title ||
                !formData.description ||
                !formData.category ||
                !formData.location
              }
              className="flex-1 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Upload className="mr-2 h-4 w-4 animate-spin" />
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