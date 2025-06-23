
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { MessageCircle, Send, InboxIcon, User, Clock, MoreVertical, Search } from "lucide-react"
import toast from "react-hot-toast"
import Navbar from "../Comps/Navbar"
import Footer from "../Comps/Footer"

const Inbox = () => {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem("user"))
  const currentUserId = user?._id || user?.id

  useEffect(() => {
    const fetchInbox = async () => {
      if (!currentUserId) {
        toast.error("Please log in to view your inbox")
        navigate("/auth")
        return
      }

      try {
        setLoading(true)
        const response = await axios.get(`http://localhost:5000/api/messages/inbox/${currentUserId}`)
        setConversations(response.data)
      } catch (err) {
        console.error("Failed to fetch inbox:", err)
        toast.error("Failed to load inbox")
      } finally {
        setLoading(false)
      }
    }

    fetchInbox()
  }, [currentUserId, navigate])

  const openChat = (msg) => {
    const otherUserId = msg.senderId === currentUserId ? msg.receiverId : msg.senderId
    navigate(`/chat/${otherUserId}`)
  }

  const displayedConversations = conversations

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffInHours < 168) {
      return date.toLocaleDateString([], { weekday: "short" })
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  const getConversationPreview = (msg) => {
    const isSender = msg.senderId === currentUserId
    const otherUserId = isSender ? msg.receiverId : msg.senderId
    const displayName = otherUserId // You might want to fetch actual names

    return {
      name: displayName,
      isSender,
      preview: msg.content,
      timestamp: msg.timestamp,
      isRead: true, // You might want to track read status
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-4">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                ))}
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
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <InboxIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Inbox</h1>
                  <p className="text-gray-600">
                    {conversations.length} conversation{conversations.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Conversations List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {displayedConversations.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
                <p className="text-gray-600 mb-6">Start a conversation by contacting a listing owner or renter</p>
                { (
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Browse Listings
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Conversation Items */}
                <div className="divide-y divide-gray-200">
                  {displayedConversations.map((msg, index) => {
                    const conversation = getConversationPreview(msg)

                    return (
                      <div
                        key={index}
                        className={`relative flex items-center p-6 hover:bg-gray-50 cursor-pointer transition-colors`}
                        onClick={() => openChat(msg)}
                      >
                        {/* Avatar */}
                        <div className="flex-shrink-0 mr-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                        </div>

                        {/* Conversation Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="text-sm font-medium text-gray-900 truncate">{conversation.name}</h3>
                              {conversation.isSender && (
                                <div className="flex items-center text-xs text-gray-500">
                                  <Send className="w-3 h-3 mr-1" />
                                  <span>You</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500 flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {formatTime(conversation.timestamp)}
                              </span>
                              {!conversation.isRead && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                            </div>
                          </div>

                          <p className="text-sm text-gray-600 truncate">
                            {conversation.isSender && "You: "}
                            {conversation.preview}
                          </p>
                        </div>

                        {/* Actions Menu */}
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="ml-2 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>

          {/* Stats Footer */}
          {conversations.length > 0 && (
            <div className="mt-6 text-center text-sm text-gray-500">
              {conversations.length} conversation{conversations.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Inbox

