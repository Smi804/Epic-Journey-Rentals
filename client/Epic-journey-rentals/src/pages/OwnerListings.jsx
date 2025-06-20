import { useEffect, useState } from "react"
import {
  Loader,
  Pencil,
  Trash,
  Plus,
  Eye,
  MoreVertical,
  Search,
  Calendar,
  MapPin,
  Star,
  DollarSign,
  Package,
  Users,
  AlertTriangle,
  X,
  CheckCircle,
  Clock,
  Camera,
} from "lucide-react"
import toast from "react-hot-toast"
import { useNavigate, Link } from "react-router-dom"
import Navbar from "../Comps/Navbar"
import Footer from "../Comps/Footer"

const OwnerListings = () => {
  const [listings, setListings] = useState([])
  const [filteredListings, setFilteredListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedListing, setSelectedListing] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [showDropdown, setShowDropdown] = useState(null)
  const navigate = useNavigate()

  const statusOptions = [
    { value: "all", label: "All Listings", count: 0 },
    { value: "active", label: "Active", count: 0 },
    { value: "inactive", label: "Inactive", count: 0 },
    { value: "pending", label: "Pending Review", count: 0 },
    { value: "booked", label: "Currently Booked", count: 0 },
  ]

  useEffect(() => {
    const fetchOwnerListings = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        toast.error("You must be logged in")
        navigate("/auth")
        return
      }

      try {
        const res = await fetch("http://localhost:5000/api/listings/owner/listings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data.message)
        setListings(data)
        setFilteredListings(data)
      } catch (err) {
        toast.error(err.message || "Failed to load owner listings")
      } finally {
        setLoading(false)
      }
    }

    fetchOwnerListings()
  }, [navigate])

  // Filter listings based on search and status
  useEffect(() => {
    let filtered = [...listings]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (listing) =>
          listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          listing.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          listing.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((listing) => listing.status === statusFilter)
    }

    setFilteredListings(filtered)
  }, [listings, searchTerm, statusFilter])

  const handleDeleteListing = async () => {
    if (!selectedListing) return

    setDeleting(true)
    const token = localStorage.getItem("token")

    try {
      const res = await fetch(`http://localhost:5000/api/listings/${selectedListing._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || "Failed to delete listing")
      }

      // Remove listing from state
      setListings((prev) => prev.filter((listing) => listing._id !== selectedListing._id))
      toast.success("Listing deleted successfully")
      setShowDeleteModal(false)
      setSelectedListing(null)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setDeleting(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200"
      case "inactive":
        return "bg-gray-100 text-gray-700 border-gray-200"
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "booked":
        return "bg-blue-100 text-blue-700 border-blue-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }


  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <Loader className="animate-spin w-12 h-12 text-blue-600 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Loading your listings...</p>
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
        {/* Header Section */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
                <p className="text-gray-600 mt-1">Manage your rental items and track performance</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                

                
                <Link
                  to="/owner/create"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold flex items-center gap-2 whitespace-nowrap"
                >
                  <Plus className="w-5 h-5" />
                  Add New Listing
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
        
          {/* Listings Grid */}
          {filteredListings.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || statusFilter !== "all" ? "No listings found" : "No listings yet"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Create your first listing to start earning from your unused items"}
              </p>
              {!searchTerm && statusFilter === "all" && (
                <Link
                  to="/owner/create"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Listing
                </Link>
              )}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredListings.map((listing) => (
                <div
                  key={listing._id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
                >
                  {/* Image */}
                  <div className="relative h-48">
                    <img
                      src={listing.images?.[0] || "https://via.placeholder.com/400x250?text=No+Image"}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Actions Dropdown */}
                    <div className="absolute top-3 right-3">
                      <div className="relative">
                        <button
                          onClick={() => setShowDropdown(showDropdown === listing._id ? null : listing._id)}
                          className="bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-600" />
                        </button>

                        {showDropdown === listing._id && (
                          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10">
                            <div className="p-1">
                              <Link
                                to={`/items/${listing._id}`}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                onClick={() => setShowDropdown(null)}
                              >
                                <Eye className="w-4 h-4" />
                                View Listing
                              </Link>
                              <button
                                onClick={() => {
                                  navigate(`/owner/edit/${listing._id}`)
                                  setShowDropdown(null)
                                }}
                                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                              >
                                <Pencil className="w-4 h-4" />
                                Edit Listing
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedListing(listing)
                                  setShowDeleteModal(true)
                                  setShowDropdown(null)
                                }}
                                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <Trash className="w-4 h-4" />
                                Delete Listing
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Image Count */}
                    {listing.images && listing.images.length > 1 && (
                      <div className="absolute bottom-3 right-3 bg-black/50 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                        <Camera className="w-3 h-3" />
                        {listing.images.length}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{listing.title}</h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="line-clamp-1">{listing.location}</span>
                      </div>
                      {listing.category && (
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium capitalize">
                            {listing.category}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-lg font-bold text-green-600">Rs {listing.price?.toLocaleString()}</span>
                        <span className="text-sm text-gray-500">/day</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{listing.views || 0} views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{listing.bookings || 0} bookings</span>
                      </div>
                      {listing.averageRating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{listing.averageRating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2">
                      <Link
                        to={`/items/${listing._id}`}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Link>
                      <button
                        onClick={() => navigate(`/owner/edit/${listing._id}`)}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                      >
                        <Pencil className="w-4 h-4" />
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedListing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Delete Listing</h3>
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setSelectedListing(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Are you sure you want to delete <span className="font-medium">"{selectedListing.title}"</span>? This
                  action cannot be undone.
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-red-700 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>All associated bookings and data will be permanently removed</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setSelectedListing(null)
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteListing}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting ? "Deleting..." : "Delete Listing"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}

export default OwnerListings
