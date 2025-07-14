// Updated EditListing.jsx - refactored to match CreateListing structure & API logic

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
    availability: { startDate: "", endDate: "" },
    existingImages: [],
  })
  const [newImages, setNewImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [hasChanges, setHasChanges] = useState(false)

  const categories = [
    { value: "gear", label: "Touring Gear", icon: <Package /> },
    { value: "vehicle", label: "Vehicles", icon: <Car /> },
    { value: "room", label: "Accommodation", icon: <Home /> },
  ]

  useEffect(() => {
    const fetchListing = async () => {
      const token = localStorage.getItem("token")
      try {
        const res = await fetch(`http://localhost:5000/api/listings/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message)
        setFormData({
          title: data.title,
          description: data.description,
          category: data.category,
          price: data.price,
          location: data.location,
          availability: {
            startDate: data.availability?.startDate?.split("T")[0] || "",
            endDate: data.availability?.endDate?.split("T")[0] || "",
          },
          existingImages: data.images || [],
        })
      } catch (err) {
        toast.error(err.message)
        navigate("/owner/listings")
      } finally {
        setLoading(false)
      }
    }
    fetchListing()
  }, [id, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData((prev) => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const valid = files.filter((f) => f.size <= 5 * 1024 * 1024 && f.type.startsWith("image/"))
    setNewImages((prev) => [...prev, ...valid])
  }

  const removeImage = (index, isNew) => {
    if (isNew) {
      setNewImages((prev) => prev.filter((_, i) => i !== index))
    } else {
      setFormData((prev) => ({
        ...prev,
        existingImages: prev.existingImages.filter((_, i) => i !== index),
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem("token")
    const form = new FormData()
    form.append("title", formData.title)
    form.append("description", formData.description)
    form.append("category", formData.category)
    form.append("price", formData.price)
    form.append("location", formData.location)
    form.append("availability[startDate]", formData.availability.startDate)
    form.append("availability[endDate]", formData.availability.endDate)
    formData.existingImages.forEach((img, i) => {
      form.append(`existingImages[${i}]`, img)
    })
    newImages.forEach((file) => form.append("images", file))

    try {
      setSaving(true)
      const res = await fetch(`http://localhost:5000/api/listings/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      toast.success("Listing updated successfully!")
      navigate("/owner/listings")
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[50vh] flex justify-center items-center">
          <Loader className="w-6 h-6 animate-spin text-blue-600" />
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Edit Listing</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Fields */}
          <input name="title" value={formData.title} onChange={handleInputChange} className="w-full border p-2 rounded" />
          <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full border p-2 rounded"></textarea>
          <select name="category" value={formData.category} onChange={handleInputChange} className="w-full border p-2 rounded">
            <option value="">Select</option>
            {categories.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <input name="price" type="number" value={formData.price} onChange={handleInputChange} className="w-full border p-2 rounded" />
          <input name="location" value={formData.location} onChange={handleInputChange} className="w-full border p-2 rounded" />
          <input name="availability.startDate" type="date" value={formData.availability.startDate} onChange={handleInputChange} className="w-full border p-2 rounded" />
          <input name="availability.endDate" type="date" value={formData.availability.endDate} onChange={handleInputChange} className="w-full border p-2 rounded" />

          {/* Images */}
          <div>
            <label>Existing Images</label>
            <div className="flex gap-2 flex-wrap">
              {formData.existingImages.map((url, i) => (
                <div key={i} className="relative">
                  <img src={url} className="w-24 h-24 object-cover rounded" />
                  <button type="button" onClick={() => removeImage(i, false)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1">X</button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label>Upload New Images</label>
            <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
            <div className="flex gap-2 flex-wrap mt-2">
              {newImages.map((file, i) => (
                <div key={i} className="relative">
                  <img src={URL.createObjectURL(file)} className="w-24 h-24 object-cover rounded" />
                  <button type="button" onClick={() => removeImage(i, true)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1">X</button>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
      <Footer />
    </>
  )
}

export default EditListing
