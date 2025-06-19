import { useEffect, useState } from "react"
import {
  Loader,
  MapPin,
  Calendar,
  DollarSign,
  User,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Eye,
  MessageCircle,
  Phone,
  Star,
  Package,
  AlertTriangle,
  TrendingUp,
  CalendarDays,
  X,
} from "lucide-react"
import toast from "react-hot-toast"
import { Link } from "react-router-dom"
import Navbar from "../Comps/Navbar"
import Footer from "../Comps/Footer"

const OwnerBookings = () => {
  const [bookings, setBookings] = useState([])
  const [filteredBookings, setFilteredBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [actionType, setActionType] = useState("")
  const [processing, setProcessing] = useState(false)

  const statusOptions = [
    { value: "all", label: "All Bookings", count: 0 },
    { value: "pending", label: "Pending", count: 0 },
    { value: "confirmed", label: "Confirmed", count: 0 },
    { value: "active", label: "Active", count: 0 },
    { value: "completed", label: "Completed", count: 0 },
    { value: "cancelled", label: "Cancelled", count: 0 },
  ]

  const fetchBookings = async () => {
    setLoading(true)
    const token = localStorage.getItem("token")

    try {
      const res = await fetch("http://localhost:5000/api/bookings/owner", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.message || "Failed to fetch bookings")

      setBookings(data.bookings || [])
      setFilteredBookings(data.bookings || [])
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  // Filter bookings based on search and status
  useEffect(() => {
    let filtered = [...bookings]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.listing?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.renter?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.listing?.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter)
    }

    setFilteredBookings(filtered)
  }, [bookings, searchTerm, statusFilter])

  const handleStatusChange = async (bookingId, newStatus) => {
    setProcessing(true)
    const token = localStorage.getItem("token")

    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.message || "Failed to update status")

      toast.success(`Booking ${newStatus} successfully`)
      fetchBookings()
      setShowConfirmModal(false)
      setSelectedBooking(null)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setProcessing(false)
    }
  }

  const openConfirmModal = (booking, action) => {
    setSelectedBooking(booking)
    setActionType(action)
    setShowConfirmModal(true)
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
        return <CheckCircle className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      case "active":
        return <CalendarDays className="w-4 h-4" />
      case "completed":
        return <Star className="w-4 h-4" />
      case "cancelled":
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays || 1
  }

  // Calculate stats
  const stats = [
    {
      title: "Total Bookings",
      value: bookings.length,
      icon: <Package className="w-6 h-6" />,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Pending Requests",
      value: bookings.filter((b) => b.status === "pending").length,
      icon: <Clock className="w-6 h-6" />,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
    {
      title: "Active Bookings",
      value: bookings.filter((b) => b.status === "active" || b.status === "confirmed").length,
      icon: <CalendarDays className="w-6 h-6" />,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Total Revenue",
      value: `Rs ${bookings
        .filter((b) => b.status === "completed")
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0)
        .toLocaleString()}`,
      icon: <TrendingUp className="w-6 h-6" />,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ]

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
            <Loader className="animate-spin w-12 h-12 text-blue-600 mx-auto mb-4" />
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
                <h1 className="text-3xl font-bold text-gray-900">Booking Requests</h1>
                <p className="text-gray-600 mt-1">Manage bookings for your rental listings</p>
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
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center`}>
                    <div className={stat.color}>{stat.icon}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {updatedStatusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setStatusFilter(option.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === option.value
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {option.label}
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      statusFilter === option.value ? "bg-white/20" : "bg-gray-200"
                    }`}
                  >
                    {option.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Bookings List */}
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
                  : "When customers book your items, they'll appear here"}
              </p>
              {!searchTerm && statusFilter === "all" && (
                <Link
                  to="/owner/listings"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View My Listings
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      {/* Left Section - Booking Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              {booking.listing?.title || "Unknown Item"}
                            </h3>
                            <div className="flex items-center gap-2 mb-2">
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
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Renter</p>
                                <p className="font-medium text-gray-900">{booking.renter?.name || "Unknown"}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <MapPin className="w-4 h-4 text-green-600" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Location</p>
                                <p className="font-medium text-gray-900">{booking.listing?.location || "N/A"}</p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-purple-600" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Duration</p>
                                <p className="font-medium text-gray-900">
                                  {new Date(booking.startDate).toLocaleDateString()} -{" "}
                                  {new Date(booking.endDate).toLocaleDateString()}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {calculateDays(booking.startDate, booking.endDate)} days
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                <DollarSign className="w-4 h-4 text-yellow-600" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Total Amount</p>
                                <p className="font-bold text-green-600 text-lg">
                                  Rs {booking.totalPrice?.toLocaleString() || "0"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Contact Actions */}
                        <div className="flex gap-3">
                          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                            <MessageCircle className="w-4 h-4" />
                            Message
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                            <Phone className="w-4 h-4" />
                            Call
                          </button>
                          <Link
                            to={`/items/${booking.listing?._id}`}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                          >
                            <Eye className="w-4 h-4" />
                            View Item
                          </Link>
                        </div>
                      </div>

                      {/* Right Section - Actions */}
                      {booking.status === "pending" && (
                        <div className="flex flex-col gap-3 lg:w-48">
                          <button
                            onClick={() => openConfirmModal(booking, "confirmed")}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Accept Booking
                          </button>
                          <button
                            onClick={() => openConfirmModal(booking, "cancelled")}
                            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            Decline Booking
                          </button>
                        </div>
                      )}

                      {booking.status === "confirmed" && (
                        <div className="lg:w-48">
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                            <p className="text-green-700 font-medium">Booking Confirmed</p>
                            <p className="text-green-600 text-sm">Ready for pickup</p>
                          </div>
                        </div>
                      )}

                      {booking.status === "completed" && (
                        <div className="lg:w-48">
                          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                            <Star className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                            <p className="text-purple-700 font-medium">Completed</p>
                            <p className="text-purple-600 text-sm">Payment received</p>
                          </div>
                        </div>
                      )}

                      {booking.status === "cancelled" && (
                        <div className="lg:w-48">
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                            <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                            <p className="text-red-700 font-medium">Cancelled</p>
                            <p className="text-red-600 text-sm">Booking declined</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && selectedBooking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  {actionType === "confirmed" ? "Accept Booking" : "Decline Booking"}
                </h3>
                <button
                  onClick={() => {
                    setShowConfirmModal(false)
                    setSelectedBooking(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Are you sure you want to{" "}
                  <span className="font-medium">{actionType === "confirmed" ? "accept" : "decline"}</span> the booking
                  for <span className="font-medium">"{selectedBooking.listing?.title}"</span>?
                </p>

                {actionType === "confirmed" ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-green-700 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>The renter will be notified and can proceed with pickup</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-red-700 text-sm">
                      <AlertTriangle className="w-4 h-4" />
                      <span>The renter will be notified and the booking will be cancelled</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowConfirmModal(false)
                    setSelectedBooking(null)
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleStatusChange(selectedBooking._id, actionType)}
                  disabled={processing}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                    actionType === "confirmed"
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  {processing ? "Processing..." : actionType === "confirmed" ? "Accept Booking" : "Decline Booking"}
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

export default OwnerBookings
