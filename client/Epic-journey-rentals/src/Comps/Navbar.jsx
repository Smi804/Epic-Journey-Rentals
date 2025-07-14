import { Link, useLocation, useNavigate } from "react-router-dom"
import { use, useEffect, useState } from "react"
import logo from "../assets/logo.png"
import {
  Menu,
  X,
  User,
  LogOut,
  Settings,
  Heart,
  Bell,
  Search,
  ListCollapse,
  ChevronDown,
  MapPin,
  Star,
  Shield,
  Plus,
  List,
  Calendar,
  Home,
  Car,
  Camera,
  Backpack,
  MessageCircle,
} from "lucide-react"
import toast from "react-hot-toast"

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [loadingNotifications, setLoadingNotifications] = useState(true)

  const navigate = useNavigate()
  const location = useLocation()

  const isHomePage = location.pathname === "/"

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("token")
      if (!token) return;

      try {
        const res = await fetch("http://localhost:5000/api/notifications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch notifications");
        }
        setNotifications(data.notifications.reverse() || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast.error("Failed to load notifications. Please reload and check internet.");
      } finally {
        setLoadingNotifications(false);
      }

    };
    fetchNotifications()
  }, [])


  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])



  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowUserMenu(false)
      setShowNotifications(false)
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    window.location.href = "/auth";
  };


  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/listings?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery("")
      setShowSearch(false)
    }
  }

  const commonLinks = [
    { name: "Home", path: "/dashboard", icon: <Home className="w-4 h-4" /> },
    { name: "About", path: "/about", icon: <Shield className="w-4 h-4" /> },
    { name: "Contact", path: "/contact", icon: <MapPin className="w-4 h-4" /> },
  ]

  const ownerLinks = [
    { name: "My Listings", path: "/owner/listings", icon: <List className="w-4 h-4" /> },
    { name: "Add Listing", path: "/owner/create", icon: <Plus className="w-4 h-4" /> },
    { name: "Bookings", path: "/owner/bookings", icon: <Calendar className="w-4 h-4" /> },
    { name: "Analytics", path: "/owner/analytics", icon: <Star className="w-4 h-4" /> },
    { name: "Inbox", path: "/inbox", icon: <MessageCircle className="w-4 h-4" /> },
  ]

  const renterLinks = [
    { name: "My Bookings", path: "/renter/bookings", icon: <Calendar className="w-4 h-4" /> },
    { name: "Favorites", path: "/renter/favorites", icon: <Heart className="w-4 h-4" /> },
    { name: "Explore", path: "/listings", icon: <Search className="w-4 h-4" /> },
    { name: "Inbox", path: "/inbox", icon: <MessageCircle className="w-4 h-4" /> },
  ]

  const categories = [
    { name: "Touring Gear", icon: <Backpack className="w-4 h-4" />, path: "/listings?category=touring-gear" },
    { name: "Photography", icon: <Camera className="w-4 h-4" />, path: "/listings?category=photography" },
    { name: "Vehicles", icon: <Car className="w-4 h-4" />, path: "/listings?category=vehicles" },
    { name: "Accommodation", icon: <Home className="w-4 h-4" />, path: "/listings?category=accommodation" },
  ]



  const roleBasedLinks = user?.role === "owner" ? ownerLinks : user?.role === "renter" ? renterLinks : []

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Navbar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <img src={logo} className="h-10 w-10" alt="logo" />
            <div className="hidden sm:block">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Epic Journey
              </span>
              <div className="text-xs text-gray-500 -mt-1">Rentals</div>
            </div>
          </Link>


          <nav className="hidden lg:flex items-center space-x-1">
            {commonLinks.slice(0, 3).map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${location.pathname === link.path
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                  }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}


          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for gear, vehicles, places..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="md:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {user ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowNotifications(!showNotifications)
                    }}
                    className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {notifications.some((n) => !n.isRead) && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
                      <div className="p-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {loadingNotifications ? (
                          <div className="p-4 text-sm text-gray-500">Loading...</div>
                        ) : notifications.length === 0 ? (
                          <div className="p-4 text-sm text-gray-500">No notifications</div>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification._id}
                              className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!notification.isRead ? "bg-blue-50" : ""
                                }`}
                            >
                              <p className="text-sm text-gray-900">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(notification.timestamp).toLocaleString()}
                              </p>
                            </div>
                          ))
                        )}

                      </div>
                      <div className="p-3 border-t border-gray-100">
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                          View all notifications
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowUserMenu(!showUserMenu)
                    }}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {(user.fullName || user.name)?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium text-gray-900">{user.fullName || user.name}</div>
                      <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {/* User Dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">
                              {(user.fullName || user.name)?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{user.fullName || user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            <div className="flex items-center space-x-1 mt-1">
                              <Shield className="w-3 h-3 text-green-500" />
                              <span className="text-xs text-green-600 capitalize">{user.role}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-2">
                        {roleBasedLinks.map((link) => (
                          <Link
                            key={link.name}
                            to={link.path}
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          >
                            <div className="text-blue-600">{link.icon}</div>
                            <span>{link.name}</span>
                          </Link>
                        ))}

                        <hr className="my-2 border-gray-100" />

                        <Link
                          to="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          <User className="w-4 h-4 text-blue-600" />
                          <span>Profile Settings</span>
                        </Link>

                        <Link
                          to="/settings"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          <Settings className="w-4 h-4 text-blue-600" />
                          <span>Account Settings</span>
                        </Link>
                      </div>

                      <div className="p-2 border-t border-gray-100">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/auth"
                  className="hidden sm:block px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showSearch && (
          <div className="md:hidden py-3 border-t border-gray-100">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for gear, vehicles, places..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4">
            <div className="space-y-1">
              {commonLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === link.path
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                    }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              ))}

              {/* Categories in Mobile */}
              <div className="px-3 py-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Categories</div>
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    to={category.path}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <div className="text-blue-600">{category.icon}</div>
                    <span>{category.name}</span>
                  </Link>
                ))}
              </div>

              {/* Role-based links in mobile */}
              {user && roleBasedLinks.length > 0 && (
                <div className="px-3 py-2 border-t border-gray-100 mt-4">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    {user.role === "owner" ? "Owner Dashboard" : "My Account"}
                  </div>
                  {roleBasedLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <div className="text-blue-600">{link.icon}</div>
                      <span>{link.name}</span>
                    </Link>
                  ))}
                </div>
              )}

              {/* User info and logout in mobile */}
              {user && (
                <div className="px-3 py-4 border-t border-gray-100 mt-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {(user.fullName || user.name)?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{user.fullName || user.name}</div>
                      <div className="text-sm text-gray-500 capitalize">{user.role}</div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar
