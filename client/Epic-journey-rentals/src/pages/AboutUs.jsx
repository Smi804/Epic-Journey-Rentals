import { useState } from "react"
import {
  Shield,
  Users,
  Star,
  Zap,
  Heart,
  Award,
  MapPin,
  Camera,
  Car,
  Home,
  Backpack,
  Target,
  Eye,
  Lightbulb,
  ArrowRight,
  Quote,
  Globe,
} from "lucide-react"
import { Link } from "react-router-dom"
import Navbar from "../Comps/Navbar"
import Footer from "../Comps/Footer"

const AboutUs = () => {
  const [activeTab, setActiveTab] = useState("story")

  const stats = [
    { number: "10,000+", label: "Happy Users", icon: <Users className="w-6 h-6" /> },
    { number: "5,000+", label: "Items Listed", icon: <Star className="w-6 h-6" /> },
    { number: "50+", label: "Cities Covered", icon: <MapPin className="w-6 h-6" /> },
    { number: "98%", label: "Satisfaction Rate", icon: <Heart className="w-6 h-6" /> },
  ]

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "AI-Powered Validation",
      description: "Advanced image recognition ensures authentic listings and quality standards.",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Transactions",
      description: "Bank-level security with encrypted payments and verified user identities.",
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Dynamic Pricing",
      description: "Smart pricing algorithms help owners maximize earnings and renters get fair rates.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Driven",
      description: "Built by adventurers, for adventurers. Real reviews from real experiences.",
    },
  ]

  const team = [
    {
      name: "Sakhawat Alam Sheikh",
      role: "Co-Founder & Lead Developer",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Passionate about creating technology that connects people with adventures. Expert in full-stack development and AI integration.",
      registration: "21143256355",
    },
    {
      name: "Syed Sami Abbas",
      role: "Co-Founder & Product Manager",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Adventure enthusiast with a vision for sustainable travel. Focuses on user experience and community building.",
      registration: "21133256388",
    },
  ]

  const values = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Trust & Safety",
      description: "Every user is verified, every transaction is secure, and every experience is protected.",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Sustainability",
      description: "Promoting shared economy to reduce waste and environmental impact through reuse.",
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Community First",
      description: "Building genuine connections between adventurers and creating lasting relationships.",
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Innovation",
      description: "Continuously improving with AI, machine learning, and cutting-edge technology.",
    },
  ]

  const milestones = [
    {
      year: "2024",
      title: "Project Inception",
      description: "Started as a university project with a vision to revolutionize rentals",
    },
    {
      year: "2024",
      title: "AI Integration",
      description: "Implemented advanced image recognition and dynamic pricing algorithms",
    },
    {
      year: "2024",
      title: "Beta Launch",
      description: "Launched beta version with core features and user verification system",
    },
    {
      year: "2025",
      title: "Full Launch",
      description: "Planning nationwide expansion with mobile app and advanced features",
    },
  ]

  const categories = [
    { name: "Touring Gear", icon: <Backpack className="w-6 h-6" />, count: "1,200+" },
    { name: "Photography", icon: <Camera className="w-6 h-6" />, count: "800+" },
    { name: "Vehicles", icon: <Car className="w-6 h-6" />, count: "600+" },
    { name: "Accommodation", icon: <Home className="w-6 h-6" />, count: "400+" },
  ]

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                About <span className="text-blue-200">Epic Journey</span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
                Connecting adventurers with everything they need for their next journey. We're building the future of
                travel through smart technology and community trust.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/dashboard"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Start Exploring
                </Link>
                <Link
                  to="/contact"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-blue-600 mb-3 flex justify-center">{stat.icon}</div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <section className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-1">
              {[
                { id: "story", label: "Our Story" },
                { id: "mission", label: "Mission & Vision" },
                { id: "team", label: "Meet the Team" },
                { id: "features", label: "What Makes Us Special" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 font-medium transition-colors ${activeTab === tab.id
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            {/* Our Story */}
            {activeTab === "story" && (
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
                  <p className="text-lg text-gray-600">
                    How two university students turned a simple idea into a revolutionary platform
                  </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-8 mb-12">
                  <div className="flex items-start gap-4 mb-6">
                    <Quote className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-lg text-gray-700 leading-relaxed mb-4">
                        "In today's fast-paced, experience-driven world, owning everything you need for travel or
                        temporary living is no longer practical—or necessary. We saw an opportunity to connect people
                        with the gear and accommodations they need, when they need them."
                      </p>
                      <p className="text-gray-600">- Sakhawat & Sami, Founders</p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <Lightbulb className="w-8 h-8 text-yellow-500 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">The Problem</h3>
                    <p className="text-gray-600">
                      Travelers and adventurers were spending thousands on gear they'd use only occasionally, while
                      others had unused equipment gathering dust. There had to be a better way.
                    </p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <Zap className="w-8 h-8 text-blue-500 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">The Solution</h3>
                    <p className="text-gray-600">
                      Epic Journey Rentals was born - a smart platform that uses AI to connect renters with verified
                      owners, making adventures more accessible and sustainable.
                    </p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-white rounded-2xl shadow-sm p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Journey</h3>
                  <div className="space-y-8">
                    {milestones.map((milestone, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 font-bold">{milestone.year}</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">{milestone.title}</h4>
                          <p className="text-gray-600">{milestone.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Mission & Vision */}
            {activeTab === "mission" && (
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Mission & Vision</h2>
                  <p className="text-lg text-gray-600">
                    Driving the future of sustainable travel and community sharing
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
                    <Target className="w-12 h-12 text-blue-600 mb-6" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                    <p className="text-gray-700 leading-relaxed">
                      To create a comprehensive, smart rental platform that empowers individuals to monetize their
                      unused equipment and properties while providing travelers with convenient, affordable, and
                      flexible access to everything they need for their adventures.
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8">
                    <Eye className="w-12 h-12 text-green-600 mb-6" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                    <p className="text-gray-700 leading-relaxed">
                      To become the ultimate digital companion for anyone looking to travel lighter, live flexibly, and
                      experience more—without boundaries. We envision a world where sharing is the norm, sustainability
                      is prioritized, and adventures are accessible to all.
                    </p>
                  </div>
                </div>

                {/* Values */}
                <div className="bg-white rounded-2xl shadow-sm p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Core Values</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    {values.map((value, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <div className="text-blue-600">{value.icon}</div>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h4>
                          <p className="text-gray-600">{value.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Team */}
            {activeTab === "team" && (
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
                  <p className="text-lg text-gray-600">The passionate minds behind Epic Journey Rentals</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                  {team.map((member, index) => (
                    <div key={index} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                      <div className="h-64 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-4xl font-bold">{member.name.charAt(0)}</span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                        <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                        <p className="text-sm text-gray-500 mb-4">Registration: {member.registration}</p>
                        <p className="text-gray-600 leading-relaxed">{member.bio}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Supervisor */}
                <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                  <Award className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Under the Supervision of</h3>
                  <p className="text-lg font-semibold text-blue-600 mb-1">Miss Narmeen Khalid</p>
                  <p className="text-gray-600 mb-2">Department of Information Technology</p>
                  <p className="text-gray-600">Govt. Graduate Gordon College, Rawalpindi</p>
                </div>
              </div>
            )}

            {/* Features */}
            {activeTab === "features" && (
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">What Makes Us Special</h2>
                  <p className="text-lg text-gray-600">Advanced technology meets community trust</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                  {features.map((feature, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                      <div className="text-blue-600 mb-4">{feature.icon}</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  ))}
                </div>

                {/* Categories */}
                <div className="bg-white rounded-2xl shadow-sm p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">What You Can Find</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {categories.map((category, index) => (
                      <div key={index} className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <div className="text-blue-600">{category.icon}</div>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-1">{category.name}</h4>
                        <p className="text-sm text-gray-600">{category.count} items</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Epic Journey?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of adventurers who are already traveling smarter and earning more
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/auth"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center justify-center"
              >
                Get Started Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/listings"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Browse Listings
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}

export default AboutUs
