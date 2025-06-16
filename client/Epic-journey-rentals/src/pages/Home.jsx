import { Link } from "react-router-dom"
import {
  MapPin,
  Shield,
  Star,
  Users,
  Camera,
  Car,
  HomeIcon,
  Backpack,
  DollarSign,
  Clock,
  CheckCircle,
  ArrowRight,
  Zap,
  Heart,
} from "lucide-react"

const Home = () => {
  const categories = [
    { icon: <Backpack className="w-8 h-8" />, name: "Touring Gear", items: "Tents, Backpacks, Camping Equipment" },
    { icon: <Camera className="w-8 h-8" />, name: "Photography", items: "Cameras, Lenses, Tripods" },
    { icon: <Car className="w-8 h-8" />, name: "Vehicles", items: "Cars, Bikes, Motorcycles" },
    { icon: <HomeIcon className="w-8 h-8" />, name: "Accommodations", items: "Rooms, Flats, Houses" },
  ]

  const renterBenefits = [
    {
      icon: <DollarSign className="w-6 h-6 text-green-600" />,
      title: "Save Money",
      description: "Rent instead of buying expensive gear you'll use occasionally",
    },
    {
      icon: <MapPin className="w-6 h-6 text-blue-600" />,
      title: "Local Access",
      description: "Find equipment and accommodations wherever your journey takes you",
    },
    {
      icon: <Shield className="w-6 h-6 text-purple-600" />,
      title: "Verified Items",
      description: "AI-powered validation ensures quality and authenticity",
    },
    {
      icon: <Star className="w-6 h-6 text-yellow-600" />,
      title: "Trusted Reviews",
      description: "Make informed decisions with real user ratings and reviews",
    },
  ]

  const ownerBenefits = [
    {
      icon: <DollarSign className="w-6 h-6 text-green-600" />,
      title: "Earn Extra Income",
      description: "Monetize your unused equipment and properties",
    },
    {
      icon: <Zap className="w-6 h-6 text-orange-600" />,
      title: "Smart Pricing",
      description: "AI-powered dynamic pricing maximizes your earnings",
    },
    {
      icon: <Users className="w-6 h-6 text-blue-600" />,
      title: "Reach More People",
      description: "Connect with travelers and adventurers in your area",
    },
    {
      icon: <Shield className="w-6 h-6 text-purple-600" />,
      title: "Secure Transactions",
      description: "Safe payments and verified renters for peace of mind",
    },
  ]

  const features = [
    { icon: <CheckCircle className="w-5 h-5" />, text: "AI-powered item validation" },
    { icon: <CheckCircle className="w-5 h-5" />, text: "Secure payment gateway" },
    { icon: <CheckCircle className="w-5 h-5" />, text: "Real-time chat support" },
    { icon: <CheckCircle className="w-5 h-5" />, text: "Location-based search" },
    { icon: <CheckCircle className="w-5 h-5" />, text: "Dynamic pricing suggestions" },
    { icon: <CheckCircle className="w-5 h-5" />, text: "Comprehensive review system" },
  ]

  return (
    <>
      <div className="min-h-screen  bg-gradient-to-b from-blue-50 to-white">
        {/* Hero Section */}
        <section className="text-center py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
              Welcome to <span className="text-blue-700">Epic Journey Rentals</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Your ultimate digital companion for adventure. Rent touring gear, vehicles, and accommodations or list
              your unused items to earn extra income. Travel lighter, live flexibly, and experience more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/auth">
                <button className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 font-semibold text-lg shadow-lg">
                  Get Started
                  <ArrowRight className="inline-block ml-2 w-5 h-5" />
                </button>
              </Link>
              
            </div>
            <p className="text-sm text-gray-500 italic">
              "Rent. Ride. Rest. Repeat — One Platform for All Your Adventure Needs."
            </p>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">What You Can Rent & List</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="text-center p-6 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors duration-300"
                >
                  <div className="text-blue-600 mb-4 flex justify-center">{category.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{category.name}</h3>
                  <p className="text-gray-600 text-sm">{category.items}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Helps Renters */}
        <section className="py-16 px-4 bg-blue-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">How We Help Renters</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Access everything you need for your adventure without the commitment of ownership
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {renterBenefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="mb-4">{benefit.icon}</div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Helps Owners */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">How We Help Owners</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Turn your unused equipment and properties into a steady income stream
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {ownerBenefits.map((benefit, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-xl hover:bg-blue-50 transition-colors duration-300">
                  <div className="mb-4">{benefit.icon}</div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-16 px-4 bg-gray-900 text-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Powered by Smart Technology</h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Advanced features that make renting and listing safer, smarter, and more convenient
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="text-green-400">{feature.icon}</div>
                  <span className="text-gray-200">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust & Safety */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4 text-gray-900">Built on Trust & Safety</h2>
              <p className="text-lg text-gray-600 mb-8">
                Every user is verified with official identification documents. Our AI-powered validation ensures
                authentic listings, while secure payments and comprehensive reviews build a trusted community of
                adventurers.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <Users className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Verified Users</h3>
                <p className="text-sm text-gray-600">All users verified with official ID documents</p>
              </div>
              <div>
                <Heart className="w-12 h-12 text-red-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Community Driven</h3>
                <p className="text-sm text-gray-600">Built by adventurers, for adventurers</p>
              </div>
              <div>
                <Clock className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">24/7 Support</h3>
                <p className="text-sm text-gray-600">Real-time chat and instant notifications</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Ready to Start Your Epic Journey?</h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of adventurers who are already traveling smarter and earning more
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <button className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-all duration-300 font-semibold text-lg shadow-lg">
                  Join Epic Journey
                </button>
              </Link>
              <Link to="/about">
                <button className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300 font-semibold text-lg">
                  Learn More
                </button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Home
