import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, MessageCircle, User, Shield, AlertCircle } from "lucide-react"
import ChatBox from "../Comps/ChatBox"
import Navbar from "../Comps/Navbar"
import Footer from "../Comps/Footer"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const ChatPage = () => {
  const { ownerId } = useParams()
  const navigate = useNavigate()
  const [otherUserInfo, setOtherUserInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  const user = JSON.parse(localStorage.getItem("user"))
  const currentUserId = user?._id || user?.id

  useEffect(() => {
    if (!currentUserId || !ownerId) {
      toast.error("Invalid chat session. Please log in.")
      navigate("/auth")
      return
    }

    // You might want to fetch other user's info here
    // For now, we'll use a placeholder
    setOtherUserInfo({
      id: ownerId,
      name: `User ${ownerId.slice(-4)}`, // Display last 4 chars of ID
      avatar: null,
      isOnline: false,
      lastSeen: new Date(),
    })
    setLoading(false)
  }, [currentUserId, ownerId, navigate])

  if (!currentUserId || !ownerId) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Invalid Chat Session</h3>
              <p className="text-gray-600 mb-6">Please log in to continue your conversation.</p>
              <button
                onClick={() => navigate("/auth")}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="animate-pulse">
                <div className="border-b border-gray-200 p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                    </div>
                  </div>
                </div>
                <div className="h-96 bg-gray-50"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-4">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Chat Header */}
          <div className="bg-white rounded-t-xl shadow-sm border border-gray-200 border-b-0">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => navigate("/inbox")}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      {otherUserInfo?.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>

                    <div>
                      <h1 className="text-lg font-semibold text-gray-900">{otherUserInfo?.name}</h1>
                      <p className="text-sm text-gray-600">
                        {otherUserInfo?.isOnline ? (
                          <span className="text-green-600">Online</span>
                        ) : (
                          `Last seen ${otherUserInfo?.lastSeen?.toLocaleDateString()}`
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    <Shield className="w-3 h-3" />
                    <span>Secure Chat</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Safety Notice */}
            <div className="px-6 py-3 bg-blue-50 border-b border-gray-200">
              <div className="flex items-start space-x-2">
                <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Stay Safe</p>
                  <p className="text-blue-700">
                    Keep conversations on Epic Journey Rentals. Never share personal information or payment details.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Content */}
          <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 border-t-0 overflow-hidden">
            <ChatBox currentUserId={currentUserId} otherUserId={ownerId} />
          </div>

          {/* Chat Tips */}
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <MessageCircle className="w-5 h-5 mr-2 text-blue-600" />
              Chat Tips
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p>Be clear about pickup/return times and locations</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p>Ask questions about the item's condition and features</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p>Confirm booking details before finalizing</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p>Report any issues to our support team</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default ChatPage
