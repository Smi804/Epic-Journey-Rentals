// src/Comps/Footer.jsx

import { Link } from "react-router-dom"
import {
  Github,
  Linkedin,
  Instagram,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
} from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white px-6 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Info */}
        <div>
          <h2 className="text-2xl font-bold text-blue-400 mb-2">Epic Journey</h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            Explore the world with comfort. Epic Journey Rentals connects you to
            the best gear, vehicles, and places to stay — anywhere, anytime.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-blue-400 flex items-center gap-1">
                <ArrowRight size={16} /> Home
              </Link>
            </li>
            <li>
              <Link to="/listings" className="hover:text-blue-400 flex items-center gap-1">
                <ArrowRight size={16} /> Listings
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-blue-400 flex items-center gap-1">
                <ArrowRight size={16} /> About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-blue-400 flex items-center gap-1">
                <ArrowRight size={16} /> Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2 text-gray-300">
              <MapPin size={16} /> Rawalpindi ,Pakistan
            </li>
            <li className="flex items-center gap-2 text-gray-300">
              <Phone size={16} /> +92 343 5769521
            </li>
            <li className="flex items-center gap-2 text-gray-300">
              <Mail size={16} /> support@epicjourney.pk
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Follow Us</h3>
          <div className="flex space-x-4">
            <a
              href="https://github.com/smi804"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <Github size={20} />
            </a>
            <a
              href="https://linkedin.com/in/sami-abbas-8a9a41268"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="https://instagram.com/isyedsami014"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <Instagram size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-10 pt-4 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} Epic Journey Rentals. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
