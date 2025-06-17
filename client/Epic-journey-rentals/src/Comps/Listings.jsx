import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { MapPin, Loader } from "lucide-react"
import toast from "react-hot-toast"

const Listings = () => {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/listings")
        const data = await res.json()
        setListings(data)
      } catch (err) {
        toast.error("Failed to load listings")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader className="animate-spin w-8 h-8 text-blue-600" />
        <span className="ml-2 text-gray-500">Loading listings...</span>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Available Listings</h1>

      {listings.length === 0 ? (
        <p className="text-gray-500">No listings found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <Link
              to={`/items/${listing._id}`}
              key={listing._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={listing.images?.[0] || "https://via.placeholder.com/400x250.png?text=No+Image"}
                alt={listing.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">{listing.title}</h2>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{listing.description}</p>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  {listing.location || "Unknown"}
                </div>
                <div className="mt-3 font-bold text-blue-600 text-lg">
                  Rs {listing.price}/day
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Listings
