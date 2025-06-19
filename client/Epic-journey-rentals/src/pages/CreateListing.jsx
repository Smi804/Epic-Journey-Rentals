"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import {
  ArrowLeft,
  Upload,
  X,
  MapPin,
  DollarSign,
  Calendar,
  Package,
  Car,
  Home,
  Camera,
  AlertCircle,
  CheckCircle,
  Loader,
  Plus,
  Info,
} from "lucide-react"
import toast from "react-hot-toast"
import Navbar from "../Comps/Navbar"
import Footer from "../Comps/Footer"

const CreateListing = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    location: "",
    availability: {
      startDate: "",
      endDate: "",
    },
    images: [],
  })
  const [imageFiles, setImageFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [currentStep, setCurrentStep] = useState(1)
  const navigate = useNavigate()

  const categories = [
    {
      value: "gear",
      label: "Touring Gear",
      icon: <Package className="w-6 h-6" />,
      description: "Camping equipment, backpacks, outdoor gear",
      examples: ["Tents", "Sleeping bags", "Hiking boots", "Camping stoves"],
    },
    {
      value: "vehicle",
      label: "Vehicles",
      icon: <Car className="w-6 h-6" />,
      description: "Cars, bikes, motorcycles, and transport",
      examples: ["Cars", "Motorcycles", "Bicycles", "Scooters"],
    },
    {
      value: "room",
      label: "Accommodation",
      icon: <Home className="w-6 h-6" />,
      description: "Rooms, apartments, and living spaces",
      examples: ["Private rooms", "Apartments", "Guest houses", "Studios"],
    },
  ]

  const steps = [
    { number: 1, title: "Basic Info", description: "Title, category, and description" },
    { number: 2, title: "Details", description: "Price, location, and availability" },
    { number: 3, title: "Photos", description: "Upload images of your item" },
    { number: 4, title: "Review", description: "Review and publish your listing" },
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + imageFiles.length > 10) {
      toast.error("You can upload maximum 10 images")
      return
    }

    const validFiles = files.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is 5MB`)
        return false
      }
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not a valid image file`)
        return false
      }
      return true
    })

    setImageFiles((prev) => [...prev, ...validFiles])

    // Create preview URLs
    validFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, e.target.result],
        }))
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const validateStep = (step) => {
    const newErrors = {}

    switch (step) {
      case 1:
        if (!formData.title.trim()) newErrors.title = "Title is required"
        if (!formData.category) newErrors.category = "Category is required"
        if (!formData.description.trim()) newErrors.description = "Description is required"
        if (formData.description.length < 20) newErrors.description = "Description must be at least 20 characters"
        break

      case 2:
        if (!formData.price || formData.price <= 0) newErrors.price = "Valid price is required"
        if (!formData.location.trim()) newErrors.location = "Location is required"
        if (!formData.availability.startDate) newErrors.startDate = "Start date is required"
        if (!formData.availability.endDate) newErrors.endDate = "End date is required"
        if (
          formData.availability.startDate &&
          formData.availability.endDate &&
          new Date(formData.availability.startDate) >= new Date(formData.availability.endDate)
        ) {
          newErrors.endDate = "End date must be after start date"
        }
        break

      case 3:
        if (formData.images.length === 0) newErrors.images = "At least one image is required"
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateStep(currentStep)) return

    setLoading(true)
    const token = localStorage.getItem("token")

    if (!token) {
      toast.error("You must be logged in")
      navigate("/auth")
      return
    }

    try {
      // Create FormData for file upload
      const submitData = new FormData()
      submitData.append("title", formData.title)
      submitData.append("description", formData.description)
      submitData.append("category", formData.category)
      submitData.append("price", formData.price)
      submitData.append("location", formData.location)
      submitData.append("availability[startDate]", formData.availability.startDate)
      submitData.append("availability[endDate]", formData.availability.endDate)

      // Append image files
      imageFiles.forEach((file) => {
        submitData.append("images", file)
      })
          const res = await fetch("http://localhost:5000/api/listings", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
          })

      /* const res = await fetch("http://localhost:5000/api/listings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: submitData,
      })

      const data = await res.json() */

      if (!res.ok) throw new Error(data.message || "Failed to create listing")

      toast.success("Listing created successfully!")
      navigate("/owner/listings")
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const selectedCategory = categories.find((cat) => cat.value === formData.category)

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center gap-4">
              <Link
                to="/owner/listings"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Listings
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Create New Listing</h1>
                <p className="text-gray-600 mt-1">Share your items with the Epic Journey community</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Progress Steps */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                        currentStep >= step.number ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {currentStep > step.number ? <CheckCircle className="w-5 h-5" /> : step.number}
                    </div>
                    <div className="ml-3">
                      <p className={`font-medium ${currentStep >= step.number ? "text-blue-600" : "text-gray-600"}`}>
                        {step.title}
                      </p>
                      <p className="text-sm text-gray-500">{step.description}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-1 mx-4 ${currentStep > step.number ? "bg-blue-600" : "bg-gray-200"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Listing Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.title ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="e.g., Professional DSLR Camera with Lens Kit"
                      maxLength={100}
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.title}
                      </p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">{formData.title.length}/100 characters</p>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">Category *</label>
                    <div className="grid md:grid-cols-3 gap-4">
                      {categories.map((category) => (
                        <div
                          key={category.value}
                          className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${
                            formData.category === category.value
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => handleInputChange({ target: { name: "category", value: category.value } })}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div
                              className={`${formData.category === category.value ? "text-blue-600" : "text-gray-600"}`}
                            >
                              {category.icon}
                            </div>
                            <h3 className="font-semibold text-gray-900">{category.label}</h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {category.examples.slice(0, 2).map((example, index) => (
                              <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {example}
                              </span>
                            ))}
                          </div>
                          {formData.category === category.value && (
                            <div className="absolute top-3 right-3">
                              <CheckCircle className="w-5 h-5 text-blue-600" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    {errors.category && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.category}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={6}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                        errors.description ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="Describe your item in detail. Include condition, features, what's included, and any special instructions..."
                      maxLength={1000}
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.description}
                      </p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">{formData.description.length}/1000 characters</p>
                  </div>
                </div>
              )}

              {/* Step 2: Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Pricing & Availability</h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Price */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Daily Rental Price (Rs) *</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                            errors.price ? "border-red-300" : "border-gray-300"
                          }`}
                          placeholder="0"
                          min="1"
                        />
                      </div>
                      {errors.price && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.price}
                        </p>
                      )}
                      <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2 text-blue-700 text-sm">
                          <Info className="w-4 h-4" />
                          <span>Pricing tip: Research similar items in your area for competitive rates</span>
                        </div>
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                            errors.location ? "border-red-300" : "border-gray-300"
                          }`}
                          placeholder="e.g., Lahore, Punjab"
                        />
                      </div>
                      {errors.location && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.location}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Availability */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">Availability Period *</label>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">Available From</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="date"
                            name="availability.startDate"
                            value={formData.availability.startDate}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                              errors.startDate ? "border-red-300" : "border-gray-300"
                            }`}
                            min={new Date().toISOString().split("T")[0]}
                          />
                        </div>
                        {errors.startDate && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.startDate}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">Available Until</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="date"
                            name="availability.endDate"
                            value={formData.availability.endDate}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                              errors.endDate ? "border-red-300" : "border-gray-300"
                            }`}
                            min={formData.availability.startDate || new Date().toISOString().split("T")[0]}
                          />
                        </div>
                        {errors.endDate && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.endDate}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

             {/*  {/* Step 3: Photos */}
           {currentStep === 3 && (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Image URLs</h2>
      <p className="text-gray-600">Enter direct image URLs (e.g., from Cloudinary, Imgur, etc.)</p>
    </div>

    {formData.images.map((url, index) => (
      <div key={index} className="flex items-center gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => {
            const newUrls = [...formData.images]
            newUrls[index] = e.target.value
            setFormData({ ...formData, images: newUrls })
          }}
          placeholder="https://example.com/image.jpg"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        <button
          type="button"
          onClick={() => {
            const newUrls = formData.images.filter((_, i) => i !== index)
            setFormData({ ...formData, images: newUrls })
          }}
          className="text-red-500 hover:text-red-700"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    ))}

    <button
      type="button"
      onClick={() => setFormData({ ...formData, images: [...formData.images, ""] })}
      className="text-blue-600 hover:text-blue-800 mt-2 flex items-center gap-1"
    >
      <Plus className="w-4 h-4" /> Add Another URL
    </button>

    {errors.images && (
      <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
        <AlertCircle className="w-4 h-4" />
        {errors.images}
      </p>
    )}
  </div>
)}


              {/* Step 4: Review */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Listing</h2>
                    <p className="text-gray-600">Make sure everything looks good before publishing</p>
                  </div>

                  {/* Preview Card */}
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    {/* Image */}
                    <div className="relative h-64">
                      {formData.images.length > 0 ? (
                        <img
                          src={formData.images[0] || "/placeholder.svg"}
                          alt={formData.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <Camera className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      {selectedCategory && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {selectedCategory.label}
                          </span>
                        </div>
                      )}
                      {formData.images.length > 1 && (
                        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                          +{formData.images.length - 1} more
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{formData.title}</h3>
                      <p className="text-gray-600 mb-4">{formData.description}</p>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{formData.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(formData.availability.startDate).toLocaleDateString()} -{" "}
                            {new Date(formData.availability.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-5 h-5 text-green-600" />
                          <span className="text-2xl font-bold text-green-600">
                            Rs {Number(formData.price).toLocaleString()}
                          </span>
                          <span className="text-gray-500">/day</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-2">Before publishing:</p>
                        <ul className="space-y-1">
                          <li>• Your listing will be reviewed by our AI system for quality</li>
                          <li>• Make sure all information is accurate and up-to-date</li>
                          <li>• You can edit your listing anytime after publishing</li>
                          <li>• Follow our community guidelines for best results</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-8 border-t border-gray-200">
                <button
                  type="button"
                  onClick={prevStep}
                  className={`px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ${
                    currentStep === 1 ? "invisible" : ""
                  }`}
                >
                  Previous
                </button>

                <div className="flex gap-3">
                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Next Step
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          Publishing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Publish Listing
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default CreateListing
