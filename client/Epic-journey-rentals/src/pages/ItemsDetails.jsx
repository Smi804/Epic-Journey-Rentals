"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import {
  Loader,
  MapPin,
  User2,
  Star,
  Heart,
  Share2,
  Shield,
  CheckCircle,
  Clock,
  ArrowLeft,
  Camera,
  MessageCircle,
  Phone,
  ChevronLeft,
  ChevronRight,
  Zap,
  Award,
  AlertCircle,
} from "lucide-react"
import toast from "react-hot-toast"
import Navbar from "../Comps/Navbar"
import Footer from "../Comps/Footer"

const ItemsDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [bookingDates, setBookingDates] = useState({
    startDate: "",
    endDate: "",
  })

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          toast.error("Please login to view item details")
          navigate("/auth")
          return
        }

        const res = await fetch(`http://localhost:5000/api/listings/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await res.json()

        if (!res.ok) throw new Error(data.message || "Error fetching listing")

        setListing(data)
      } catch (err) {
        toast.error(err.message || "Listing not found")
        navigate("/listings")
      } finally {
        setLoading(false)
      }
    }

    fetchListing()
  }, [id, navigate])

  const handlePreviousImage = () => {
    if (listing?.images?.length > 1) {
      setCurrentImageIndex((prev) => (prev === 0 ? listing.images.length - 1 : prev - 1))
    }
  }

  const handleNextImage = () => {
    if (listing?.images?.length > 1) {
      setCurrentImageIndex((prev) => (prev === listing.images.length - 1 ? 0 : prev + 1))
    }
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites")
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing.title,
          text: listing.description,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard!")
    }
  }

  const handleBooking = () => {
    if (!bookingDates.startDate || !bookingDates.endDate) {
      toast.error("Please select booking dates")
      return
    }
    toast.success("Booking request sent! Owner will contact you soon.")
    setShowBookingModal(false)
  }

  const calculateDays = () => {
    if (bookingDates.startDate && bookingDates.endDate) {
      const start = new Date(bookingDates.startDate)
      const end = new Date(bookingDates.endDate)
      const diffTime = Math.abs(end - start)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays || 1
    }
    return 1
  }

  const totalPrice = listing ? listing.price * calculateDays() : 0

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <Loader className="animate-spin w-12 h-12 text-blue-600 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Loading item details...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (!listing) {
    return (
      <>
        <Navbar />
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Item Not Found</h2>
            <p className="text-gray-600 mb-6">The item you're looking for has been removed or doesn't exist.</p>
            <Link
              to="/listings"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Other Items
            </Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const { title, description, price, location, images, availability, owner, category } = listing

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        {/* Breadcrumb */}
       
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Listings
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Images and Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="relative">
                  <img
                    src={images?.[currentImageIndex] || "https://via.placeholder.com/800x500?text=No+Image"}
                    alt={title}
                    className="w-full h-96 object-cover"
                  />

                  {/* Image Navigation */}
                  {images && images.length > 1 && (
                    <>
                      <button
                        onClick={handlePreviousImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>

                      {/* Image Indicators */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                        {images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              index === currentImageIndex ? "bg-white" : "bg-white/50"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={toggleFavorite}
                      className="bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                    >
                      <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
                    </button>
                    <button
                      onClick={handleShare}
                      className="bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                    >
                      <Share2 className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  {/* Photo Count */}
                  {images && images.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      <Camera className="w-4 h-4" />
                      {images.length} photos
                    </div>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                {images && images.length > 1 && (
                  <div className="p-4 flex gap-2 overflow-x-auto">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                          index === currentImageIndex ? "border-blue-500" : "border-gray-200"
                        }`}
                      >
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`${title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Item Details */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium capitalize">
                        {category}
                      </span>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {location}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">Rs {price?.toLocaleString()}</div>
                    <div className="text-gray-500">per day</div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{description}</p>
                </div>

                {/* Features */}
                <div className="border-t border-gray-100 pt-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Included</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Quality Guaranteed
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Shield className="w-4 h-4 text-green-500" />
                      Verified Item
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Zap className="w-4 h-4 text-green-500" />
                      Instant Booking
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Award className="w-4 h-4 text-green-500" />
                      Trusted Owner
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MessageCircle className="w-4 h-4 text-green-500" />
                      24/7 Support
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-green-500" />
                      Flexible Timing
                    </div>
                  </div>
                </div>
              </div>

              {/* Owner Information */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Meet Your Host</h3>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <User2 className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-gray-900">{owner?.fullName || owner?.name}</h4>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>4.8 (24 reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Verified Host</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mt-3">
                      Experienced host with a passion for adventure gear. I ensure all my items are well-maintained and
                      ready for your next journey.
                    </p>
                    <div className="flex gap-3 mt-4">
                      <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        Message
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Phone className="w-4 h-4" />
                        Call
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-blue-600">Rs {price?.toLocaleString()}</div>
                  <div className="text-gray-500">per day</div>
                </div>

                {/* Availability */}
                {availability && (
                  <div className="mb-6 p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700 mb-2">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Available</span>
                    </div>
                    <div className="text-sm text-green-600">
                      {availability.startDate?.slice(0, 10)} to {availability.endDate?.slice(0, 10)}
                    </div>
                  </div>
                )}

                {/* Booking Form */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date</label>
                    <input
                      type="date"
                      value={bookingDates.startDate}
                      onChange={(e) => setBookingDates({ ...bookingDates, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Date</label>
                    <input
                      type="date"
                      value={bookingDates.endDate}
                      onChange={(e) => setBookingDates({ ...bookingDates, endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Price Breakdown */}
                {bookingDates.startDate && bookingDates.endDate && (
                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>
                        Rs {price?.toLocaleString()} × {calculateDays()} days
                      </span>
                      <span>Rs {(price * calculateDays())?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Service fee</span>
                      <span>Rs {Math.round(totalPrice * 0.1)?.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>Rs {(totalPrice + Math.round(totalPrice * 0.1))?.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setShowBookingModal(true)}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
                >
                  Book Now
                </button>

                <p className="text-center text-sm text-gray-500 mt-4">You won't be charged yet</p>

                {/* Trust Indicators */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span>Secure</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Verified</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4 text-green-500" />
                      <span>Trusted</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Booking</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Item:</span>
                  <span className="font-medium">{title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dates:</span>
                  <span className="font-medium">
                    {bookingDates.startDate} to {bookingDates.endDate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{calculateDays()} days</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-blue-600">
                    Rs {(totalPrice + Math.round(totalPrice * 0.1))?.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBooking}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Confirm Booking
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

export default ItemsDetails
