import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
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
  AlertCircle,
  CheckCircle,
  Loader,
  Plus,
  Info,
  Save,
  Eye,
} from "lucide-react"
import toast from "react-hot-toast"
import Navbar from "../Comps/Navbar"
import Footer from "../Comps/Footer"

const EditListing = () => {
  const { id } = useParams()
  const navigate = useNavigate()

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
  const [originalData, setOriginalData] = useState({})
  const [imageFiles, setImageFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [hasChanges, setHasChanges] = useState(false)

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

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          toast.error("You must be logged in")
          navigate("/auth")
          return
        }

        const res = await fetch(`http://localhost:5000/api/listings/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()

        if (!res.ok) throw new Error(data.message || "Failed to load listing")

        // Format the data for the form
        const listingData = {
          title: data.title || "",
          description: data.description || "",
          category: data.category || "",
          price: data.price || "",
          location: data.location || "",
          availability: {
            startDate: data.availability?.startDate ? data.availability.startDate.split("T")[0] : "",
            endDate: data.availability?.endDate ? data.availability.endDate.split("T")[0] : "",
          },
          images: data.images || [],
        }

        setFormData(listingData)
        setOriginalData(listingData)
      } catch (err) {
        toast.error(err.message || "Failed to load listing")
        navigate("/owner/listings")
      } finally {
        setLoading(false)
      }
    }

    fetchListing()
  }, [id, navigate])

  // Check for changes
  useEffect(() => {
    const hasFormChanges = JSON.stringify(formData) !== JSON.stringify(originalData)
    const hasNewImages = imageFiles.length > 0
    setHasChanges(hasFormChanges || hasNewImages)
  }, [formData, originalData, imageFiles])

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
    if (files.length + formData.images.length + imageFiles.length > 10) {
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

    // Create preview URLs for new images
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

  const removeExistingImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const removeNewImage = (index) => {
    const newImageStartIndex = formData.images.length - imageFiles.length
    const newImageIndex = index - newImageStartIndex

    if (newImageIndex >= 0) {
      setImageFiles((prev) => prev.filter((_, i) => i !== newImageIndex))
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.category) newErrors.category = "Category is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (formData.description.length < 20) newErrors.description = "Description must be at least 20 characters"
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
    if (formData.images.length === 0) newErrors.images = "At least one image is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Please fix the errors before saving")
      return
    }

    setSaving(true)
    const token = localStorage.getItem("token")

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

      // Add existing images (URLs)
      const existingImages = formData.images.filter((img) => typeof img === "string" && img.startsWith("http"))
      existingImages.forEach((img, index) => {
        submitData.append(`existingImages[${index}]`, img)
      })

      // Add new image files
      imageFiles.forEach((file) => {
        submitData.append("images", file)
      })

      const res = await fetch(`http://localhost:5000/api/listings/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: submitData,
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.message || "Failed to update listing")

      toast.success("Listing updated successfully!")
      navigate("/owner/listings")
    } catch (err) {
      toast.error(err.message || "Update failed")
    } finally {
      setSaving(false)
    }
  }

  const selectedCategory = categories.find((cat) => cat.value === formData.category)

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <Loader className="animate-spin w-12 h-12 text-blue-600 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Loading listing details...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  to="/owner/listings"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Listings
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Edit Listing</h1>
                  <p className="text-gray-600 mt-1">Update your rental listing details</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to={`/items/${id}`}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </Link>
                {hasChanges && (
                  <div className="flex items-center gap-2 text-amber-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    Unsaved changes
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>

              {/* Title */}
              <div className="mb-6">
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
              <div className="mb-6">
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
                        <div className={`${formData.category === category.value ? "text-blue-600" : "text-gray-600"}`}>
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

            {/* Pricing & Availability */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Pricing & Availability</h2>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
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

            {/* Images */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Photos</h2>

              {/* Current Images */}
              {formData.images.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Current Images ({formData.images.length}/10)
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (index < formData.images.length - imageFiles.length) {
                              removeExistingImage(index)
                            } else {
                              removeNewImage(index)
                            }
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
                            Main Photo
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload New Images */}
              {formData.images.length < 10 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Add More Photos</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Additional Images</h3>
                      <p className="text-gray-600 mb-4">Drag and drop your images here, or click to browse</p>
                      <div className="bg-blue-600 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2 hover:bg-blue-700 transition-colors">
                        <Plus className="w-4 h-4" />
                        Choose Files
                      </div>
                    </label>
                  </div>

                  <div className="mt-4 text-sm text-gray-500">
                    <p>• Maximum 10 images total</p>
                    <p>• Maximum 5MB per image</p>
                    <p>• Supported formats: JPG, PNG, WebP</p>
                  </div>
                </div>
              )}

              {errors.images && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.images}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex gap-3">
                  <Link
                    to="/owner/listings"
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </Link>
                  <Link
                    to={`/items/${id}`}
                    className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </Link>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={saving || !hasChanges}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>

              {hasChanges && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center gap-2 text-amber-700 text-sm">
                    <Info className="w-4 h-4" />
                    <span>You have unsaved changes. Don't forget to save before leaving this page.</span>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default EditListing
