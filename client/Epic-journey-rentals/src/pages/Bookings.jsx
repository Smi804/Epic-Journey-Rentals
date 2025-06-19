import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import {
  Loader,
  Calendar,
  MapPin,
  BadgeCheck,
  XCircle,
  Clock,
  User,
  Phone,
  MessageCircle,
  Star,
  AlertTriangle,
  Search,
  Eye,
  X,
  CheckCircle,
  DollarSign,
  Package,
} from "lucide-react"
import { useNavigate, Link } from "react-router-dom"
import Navbar from "../Comps/Navbar"
import Footer from "../Comps/Footer"

const Bookings = () => {
  const [bookings, setBookings] = useState([])
  const [filteredBookings, setFilteredBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [cancelReason, setCancelReason] = useState("")
  const [cancelling, setCancelling] = useState(false)
  const navigate = useNavigate()

  const statusOptions = [
    { value: "all", label: "All Bookings", count: 0 },
    { value: "pending", label: "Pending", count: 0 },
    { value: "confirmed", label: "Confirmed", count: 0 },
    { value: "active", label: "Active", count: 0 },
    { value: "completed", label: "Completed", count: 0 },
    { value: "cancelled", label: "Cancelled", count: 0 },
  ]

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        toast.error("You must be logged in")
        navigate("/auth")
        return
      }

      try {
        const res = await fetch("http://localhost:5000/api/bookings", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await res.json()
        console.log("Bookings API response:", data)

        if (!res.ok) throw new Error(data.message || "Failed to load bookings")

        setBookings(data.bookings || [])
        setFilteredBookings(data.bookings || [])
      } catch (err) {
        toast.error(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [navigate])

  // Filter bookings based on search and status
  useEffect(() => {
    let filtered = [...bookings]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.listing?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.listing?.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter)
    }

    setFilteredBookings(filtered)
  }, [bookings, searchTerm, statusFilter])

  const handleCancelBooking = async () => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a reason for cancellation")
      return
    }

    setCancelling(true)
    const token = localStorage.getItem("token")

    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${selectedBooking._id}/cancel`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: cancelReason }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.message || "Failed to cancel booking")

      // Update the booking in state
      setBookings((prev) =>
        prev.map((booking) => (booking._id === selectedBooking._id ? { ...booking, status: "cancelled" } : booking)),
      )

      toast.success("Booking cancelled successfully")
      setShowCancelModal(false)
      setSelectedBooking(null)
      setCancelReason("")
    } catch (err) {
      toast.error(err.message)
    } finally {
      setCancelling(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "active":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "completed":
        return "bg-purple-100 text-purple-700 border-purple-200"
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <BadgeCheck className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      case "active":
        return <CheckCircle className="w-4 h-4" />
      case "completed":
        return <Star className="w-4 h-4" />
      case "cancelled":
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const canCancelBooking = (booking) => {
    const startDate = new Date(booking.startDate)
    const now = new Date()
    const timeDiff = startDate.getTime() - now.getTime()
    const hoursDiff = timeDiff / (1000 * 3600)

    return booking.status === "confirmed" && hoursDiff > 24 // Can cancel if more than 24 hours before start
  }

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays || 1
  }

  // Update status counts
  const updatedStatusOptions = statusOptions.map((option) => ({
    ...option,
    count: option.value === "all" ? bookings.length : bookings.filter((b) => b.status === option.value).length,
  }))

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Loading your bookings...</p>
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
                <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
                <p className="text-gray-600 mt-1">Manage your rental bookings and track your adventures</p>
              </div>

              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Status Filter Tabs */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {updatedStatusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setStatusFilter(option.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === option.value
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  {option.label}
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${statusFilter === option.value ? "bg-white/20" : "bg-gray-200"
                      }`}
                  >
                    {option.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Bookings Grid */}
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || statusFilter !== "all" ? "No bookings found" : "No bookings yet"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Start exploring and book your first adventure!"}
              </p>
              {!searchTerm && statusFilter === "all" && (
                <Link
                  to="/listings"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Listings
                </Link>
              )}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative h-48">
                    <img
                      src={booking.listing?.images?.[0] || "https://via.placeholder.com/400x300?text=No+Image"}
                      alt={booking.listing?.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          booking.status,
                        )}`}
                      >
                        {getStatusIcon(booking.status)}
                        <span className="ml-1 capitalize">{booking.status}</span>
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{booking.listing?.title}</h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{booking.listing?.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(booking.startDate).toLocaleDateString()} →{" "}
                          {new Date(booking.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{calculateDays(booking.startDate, booking.endDate)} days</span>
                      </div>
                    </div>

                    {/* Owner Info */}
                    {booking.listing?.owner && (
                      <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {booking.listing.owner.fullName || booking.listing.owner.name}
                          </p>
                          <p className="text-xs text-gray-500">Owner</p>
                        </div>
                        <div className="flex gap-1">
                          <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                            <MessageCircle className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                            <Phone className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-xl font-bold text-green-600">
                          Rs {booking.totalPrice?.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">Total</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        to={`/items/${booking.listing?._id}`}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        View Item
                      </Link>

                      {canCancelBooking(booking) && (
                        <button
                          onClick={() => {
                            setSelectedBooking(booking)
                            setShowCancelModal(true)
                          }}
                          className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-sm"
                        >
                          <XCircle className="w-4 h-4" />
                          Cancel
                        </button>
                      )}
                    </div>

                    {/* Cancellation Warning */}
                    {booking.status === "confirmed" && !canCancelBooking(booking) && (
                      <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center gap-2 text-yellow-700 text-xs">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Cannot cancel within 24 hours of start date</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cancel Booking Modal */}
        {showCancelModal && selectedBooking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Cancel Booking</h3>
                <button
                  onClick={() => {
                    setShowCancelModal(false)
                    setSelectedBooking(null)
                    setCancelReason("")
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-gray-600 mb-2">
                  Are you sure you want to cancel your booking for{" "}
                  <span className="font-medium">{selectedBooking.listing?.title}</span>?
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-red-700 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>This action cannot be undone</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason for cancellation *</label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Please provide a reason for cancelling this booking..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCancelModal(false)
                    setSelectedBooking(null)
                    setCancelReason("")
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleCancelBooking}
                  disabled={cancelling || !cancelReason.trim()}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cancelling ? "Cancelling..." : "Cancel Booking"}
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

export default Bookings
