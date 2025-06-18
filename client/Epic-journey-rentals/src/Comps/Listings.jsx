import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  MapPin,
  Loader,
  Search,
  Grid3X3,
  List,
  Star,
  Heart,
  SlidersHorizontal,
  Camera,
  Car,
  Home,
  Backpack,
  User,
} from "lucide-react"
import toast from "react-hot-toast"

const Listings = () => {
  const [listings, setListings] = useState([])
  const [filteredListings, setFilteredListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useState(new Set())
  const navigate = useNavigate()

  const categories = [
    { id: "all", name: "All Items", icon: <Grid3X3 className="w-5 h-5" /> },
    { id: "gear", name: "Touring Gear", icon: <Backpack className="w-5 h-5" /> },
    { id: "photography", name: "Photography", icon: <Camera className="w-5 h-5" /> },
    { id: "vehicles", name: "Vehicles", icon: <Car className="w-5 h-5" /> },
    { id: "accommodation", name: "Accommodation", icon: <Home className="w-5 h-5" /> },
  ]

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "popular", label: "Most Popular" },
  ]

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true)
      const token = localStorage.getItem("token") || null
      if (!token) {
        toast.error("You must be logged in to view listings")
        navigate("/auth")
        return
      }
      try {
        const res = await fetch("http://localhost:5000/api/listings", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || "Failed to fetch listings")
        setListings(data)
        setFilteredListings(data)
      } catch (err) {
        toast.error("Failed to load listings")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [navigate])

  // Filter and sort listings
  useEffect(() => {
    let filtered = [...listings]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (listing) =>
          listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          listing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          listing.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((listing) => listing.category === selectedCategory)
    }

    // Price range filter
    if (priceRange.min) {
      filtered = filtered.filter((listing) => listing.price >= Number.parseInt(priceRange.min))
    }
    if (priceRange.max) {
      filtered = filtered.filter((listing) => listing.price <= Number.parseInt(priceRange.max))
    }

    // Sort listings
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt)
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt)
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return (b.averageRating || 0) - (a.averageRating || 0)
        case "popular":
          return (b.viewCount || 0) - (a.viewCount || 0)
        default:
          return 0
      }
    })

    setFilteredListings(filtered)
  }, [listings, searchTerm, selectedCategory, priceRange, sortBy])

  const toggleFavorite = (listingId) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(listingId)) {
      newFavorites.delete(listingId)
      toast.success("Removed from favorites")
    } else {
      newFavorites.add(listingId)
      toast.success("Added to favorites")
    }
    setFavorites(newFavorites)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setPriceRange({ min: "", max: "" })
    setSortBy("newest")
  }

  const ListingCard = ({ listing, isGridView }) => (
    <div
      className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group ${
        isGridView ? "" : "flex"
      }`}
    >
      <div className={`relative ${isGridView ? "h-48" : "w-64 h-48 flex-shrink-0"}`}>
        <img
          src={listing.images?.[0] || "https://via.placeholder.com/400x250.png?text=No+Image"}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={(e) => {
            e.preventDefault()
            toggleFavorite(listing._id)
          }}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
        >
          <Heart className={`w-4 h-4 ${favorites.has(listing._id) ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
        </button>
        {listing.featured && (
          <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
            Featured
          </div>
        )}
        <div className="absolute bottom-3 left-3 flex gap-1">
          {listing.images && listing.images.length > 1 && (
            <div className="bg-black/50 text-white px-2 py-1 rounded text-xs">+{listing.images.length - 1} photos</div>
          )}
        </div>
      </div>

      <div className={`p-4 flex-1 ${isGridView ? "" : "flex flex-col justify-between"}`}>
        <div>
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
              {listing.title}
            </h3>
            {listing.averageRating && (
              <div className="flex items-center gap-1 text-sm">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{listing.averageRating.toFixed(1)}</span>
              </div>
            )}
          </div>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{listing.description}</p>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{listing.location || "Unknown"}</span>
            </div>
            {listing.owner && (
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{listing.owner.fullName || listing.owner.name}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mb-3">
            {listing.category && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                {categories.find((cat) => cat.id === listing.category)?.name || listing.category}
              </span>
            )}
            {listing.availability && (
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Available</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-600">Rs {listing.price?.toLocaleString()}</span>
            <span className="text-gray-500 text-sm">/day</span>
          </div>
          <Link
            to={`/items/${listing._id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <>
        
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <Loader className="animate-spin w-12 h-12 text-blue-600 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Loading amazing listings...</p>
          </div>
        </div>
        
      </>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="bg-white shadow-sm flex items-center justify-between ">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Discover Amazing Rentals</h1>
                <p className="text-gray-600 mt-1">
                  {filteredListings.length} {filteredListings.length === 1 ? "item" : "items"} available for your next
                  adventure
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Filters and Controls */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category.icon}
                    {category.name}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-4 ml-auto">
                {/* Advanced Filters Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </button>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* View Mode Toggle */}
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Min Price (Rs)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Price (Rs)</label>
                    <input
                      type="number"
                      placeholder="10000"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Listings Grid/List */}
          {filteredListings.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search criteria or browse different categories</p>
              <button
                onClick={clearFilters}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div
              className={viewMode === "grid" ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "space-y-4"}
            >
               
              {filteredListings.map((listing) => (
                <ListingCard
                key={listing._id}
                listing={listing}
                isGridView={viewMode === "grid"}
                />
            ))}

            </div>
          )}
        </div>
      </div>
  )
}

export default Listings
