"use client"

import { useState } from "react"
import { Mail, Send, CheckCircle, MapPin, Camera, Car, Home } from "lucide-react"
import toast from "react-hot-toast"

const Newsletter = () => {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email) {
      toast.error("Please enter your email address")
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address")
      return
    }

    setLoading(true)

    try {
      // Simulate API call - replace with your actual newsletter API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Here you would typically make an API call to your newsletter service
      console.log("Newsletter subscription:", email)

      setSubscribed(true)
      toast.success("Successfully subscribed to our newsletter!")
      setEmail("")
    } catch (error) {
      toast.error("Failed to subscribe. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (subscribed) {
    return (
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">Welcome to the Adventure!</h2>
            <p className="text-blue-100 text-lg mb-6">
              You're now part of the Epic Journey community. Get ready for exclusive deals, travel tips, and the latest
              gear recommendations!
            </p>
            <div className="flex justify-center space-x-8 text-blue-200">
              <div className="text-center">
                <MapPin className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Travel Tips</p>
              </div>
              <div className="text-center">
                <Camera className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Gear Reviews</p>
              </div>
              <div className="text-center">
                <Car className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Exclusive Deals</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-4">Stay Connected with Epic Journey</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Get the latest travel tips, exclusive rental deals, and be the first to know about new gear and destinations
            in your area.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="relative mb-6">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-200 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full pl-12 pr-4 py-4 bg-white/20 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-blue-600 py-4 px-6 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
                  Subscribing...
                </>
              ) : (
                <>
                  Subscribe to Newsletter
                  <Send className="ml-2 w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="text-blue-100">
              <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Travel Insights</h3>
              <p className="text-sm">Discover hidden gems and get insider tips for your next adventure</p>
            </div>
            <div className="text-blue-100">
              <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Gear Reviews</h3>
              <p className="text-sm">Expert reviews and recommendations for the best rental equipment</p>
            </div>
            <div className="text-blue-100">
              <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Home className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Exclusive Deals</h3>
              <p className="text-sm">Special discounts and early access to premium listings</p>
            </div>
          </div>

          <p className="text-center text-blue-200 text-sm mt-6">
            We respect your privacy. Unsubscribe at any time. No spam, just epic adventures.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Newsletter
