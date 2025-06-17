import { Link, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const location = useLocation() // 👈 detect current route

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    navigate("/auth")
  }

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Listings", path: "/listings" },
    { name: "Rent", path: "/rent" },
    { name: "Lease", path: "/lease" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ]

  const isHomePage = location.pathname === "/"

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Epic Journey
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-gray-700 hover:text-blue-600 transition"
            >
              {link.name}
            </Link>
          ))}

          {!isHomePage && user && (
            <>
              <span className="text-gray-600 text-sm">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-1.5 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          )}

          {isHomePage && !user && (
            <Link
              to="/auth"
              className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 transition"
            >
              Login / Register
            </Link>
          )}
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-600 hover:text-blue-600"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className="block text-gray-700 hover:text-blue-600"
            >
              {link.name}
            </Link>
          ))}

          {!isHomePage && user && (
            <>
              <span className="block text-sm text-gray-500">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          )}

          {isHomePage && !user && (
            <Link
              to="/auth"
              onClick={() => setMenuOpen(false)}
              className="block w-full text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Login / Register
            </Link>
          )}
        </div>
      )}
    </header>
  )
}

export default Navbar
