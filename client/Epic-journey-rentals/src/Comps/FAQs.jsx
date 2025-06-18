"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Shield, Zap, Users, CreditCard, MapPin, Star, AlertCircle } from "lucide-react"

const FAQs = () => {
  const [openFAQ, setOpenFAQ] = useState(null)

  const faqCategories = [
    {
      title: "Getting Started",
      icon: <Users className="w-6 h-6" />,
      faqs: [
        {
          question: "How does Epic Journey Rentals work?",
          answer:
            "Epic Journey Rentals is a peer-to-peer rental platform where you can rent touring gear, vehicles, and accommodations from verified owners in your area. Simply browse listings, book what you need, and enjoy your adventure. Owners can list their unused items to earn extra income.",
        },
        {
          question: "Do I need to create an account to rent items?",
          answer:
            "Yes, you need to create an account and verify your identity with official documents (CNIC, passport, or driver's license) to ensure safety and trust in our community. This verification process helps protect both renters and owners.",
        },
        {
          question: "What types of items can I rent?",
          answer:
            "You can rent a wide variety of items including camping gear, photography equipment, vehicles (cars, bikes, motorcycles), and accommodations (rooms, flats, houses). Our AI-powered system validates all listings to ensure quality and authenticity.",
        },
      ],
    },
    {
      title: "Booking & Payments",
      icon: <CreditCard className="w-6 h-6" />,
      faqs: [
        {
          question: "How do I book an item?",
          answer:
            "Browse our listings, select your desired item, choose your rental dates, and click 'Book Now'. You'll need to provide payment information and agree to the rental terms. Once confirmed, you'll receive booking details and owner contact information.",
        },
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept all major credit cards, debit cards, and digital payment methods through our secure payment gateway. All transactions are encrypted and protected for your safety.",
        },
        {
          question: "When am I charged for a rental?",
          answer:
            "Payment is processed immediately upon booking confirmation. For accommodations, you may be charged a security deposit that will be refunded after the rental period, subject to the condition of the property.",
        },
        {
          question: "What if I need to cancel my booking?",
          answer:
            "Cancellation policies vary by owner and item type. Most bookings can be cancelled up to 24-48 hours before the rental period with a full or partial refund. Check the specific cancellation policy on each listing.",
        },
      ],
    },
    {
      title: "Safety & Trust",
      icon: <Shield className="w-6 h-6" />,
      faqs: [
        {
          question: "How do you ensure the safety of rentals?",
          answer:
            "We use AI-powered image recognition to validate all listings, require identity verification from all users, and maintain a comprehensive review system. Our platform also includes secure messaging and 24/7 customer support.",
        },
        {
          question: "What if an item is damaged or not as described?",
          answer:
            "We have a resolution center to handle disputes. Report any issues immediately through our platform. We'll work with both parties to find a fair solution, which may include refunds, replacements, or compensation.",
        },
        {
          question: "Are owners and renters insured?",
          answer:
            "While we encourage users to check their personal insurance policies, Epic Journey Rentals provides basic protection for verified transactions. We recommend discussing insurance coverage with owners for high-value items.",
        },
      ],
    },
    {
      title: "For Owners",
      icon: <Star className="w-6 h-6" />,
      faqs: [
        {
          question: "How do I list my items for rent?",
          answer:
            "Create an owner account, verify your identity, and click 'List Item'. Upload high-quality photos, write a detailed description, set your price, and specify availability. Our AI system will validate your listing before it goes live.",
        },
        {
          question: "How much can I earn from renting my items?",
          answer:
            "Earnings vary based on item type, location, and demand. Our AI-powered dynamic pricing system suggests optimal rental prices based on market conditions, seasonality, and item availability to help maximize your earnings.",
        },
        {
          question: "How do I get paid?",
          answer:
            "Payments are processed securely through our platform and transferred to your bank account within 2-3 business days after the rental period ends, minus our service fee.",
        },
        {
          question: "What if a renter damages my item?",
          answer:
            "Report damage immediately through our platform. We'll facilitate communication between you and the renter, and our resolution center will help determine appropriate compensation based on the damage assessment.",
        },
      ],
    },
    {
      title: "Location & Availability",
      icon: <MapPin className="w-6 h-6" />,
      faqs: [
        {
          question: "In which cities is Epic Journey Rentals available?",
          answer:
            "We're continuously expanding across Pakistan. Currently available in major cities with plans to expand nationwide. Check our platform for availability in your specific location.",
        },
        {
          question: "How do I find items near me?",
          answer:
            "Use our location-based search feature to find items within your preferred distance. You can filter by location, set radius preferences, and view items on an interactive map.",
        },
        {
          question: "Can I rent items for long-term use?",
          answer:
            "Yes! Many owners offer weekly and monthly rates for extended rentals. Contact owners directly through our secure messaging system to discuss long-term arrangements and potential discounts.",
        },
      ],
    },
  ]

  const toggleFAQ = (categoryIndex, faqIndex) => {
    const key = `${categoryIndex}-${faqIndex}`
    setOpenFAQ(openFAQ === key ? null : key)
  }

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about Epic Journey Rentals. Can't find what you're looking for?
            <a href="/contact" className="text-blue-600 hover:text-blue-700 ml-1">
              Contact our support team
            </a>
            .
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Category Header */}
              <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="text-blue-600">{category.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900">{category.title}</h3>
                </div>
              </div>

              {/* FAQ Items */}
              <div className="divide-y divide-gray-100">
                {category.faqs.map((faq, faqIndex) => {
                  const isOpen = openFAQ === `${categoryIndex}-${faqIndex}`
                  return (
                    <div key={faqIndex} className="p-6">
                      <button
                        onClick={() => toggleFAQ(categoryIndex, faqIndex)}
                        className="w-full text-left flex items-center justify-between group"
                      >
                        <h4 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors pr-4">
                          {faq.question}
                        </h4>
                        <div className="flex-shrink-0 text-blue-600">
                          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </button>

                      {isOpen && <div className="mt-4 text-gray-600 leading-relaxed animate-fadeIn">{faq.answer}</div>}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-12 bg-blue-600 rounded-xl p-8 text-center text-white">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-blue-200" />
          <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Our support team is here to help you 24/7. Whether you're a renter looking for the perfect gear or an owner
            wanting to maximize your earnings, we're just a message away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Contact Support
            </a>
            <a
              href="/help"
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Help Center
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </section>
  )
}

export default FAQs
