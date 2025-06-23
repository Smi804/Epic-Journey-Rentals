import { useEffect, useState, useRef } from "react"
import io from "socket.io-client"
import axios from "axios"
import { Send, Smile, Paperclip, Check, CheckCheck, Clock, AlertCircle } from "lucide-react"
import toast from "react-hot-toast"

const socket = io("http://localhost:5000")

const ChatBox = ({ currentUserId, otherUserId }) => {
  const [chat, setChat] = useState([])
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [otherUserTyping, setOtherUserTyping] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState("connecting")
  const [sendingMessage, setSendingMessage] = useState(false)
  const messagesEndRef = useRef(null)
  const chatContainerRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chat])

  useEffect(() => {
    if (!currentUserId || !otherUserId) return

    // Socket connection management
    socket.emit("joinRoom", currentUserId)

    socket.on("connect", () => {
      setConnectionStatus("connected")
    })

    socket.on("disconnect", () => {
      setConnectionStatus("disconnected")
    })

    // Fetch existing messages
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/messages/${currentUserId}/${otherUserId}`)
        if (Array.isArray(response.data)) {
          setChat(response.data)
        } else {
          setChat([])
        }
      } catch (err) {
        console.error("Fetch messages error:", err)
        setChat([])
        toast.error("Failed to load chat history")
      }
    }

    fetchMessages()

    // Socket event listeners
    socket.on("receiveMessage", (data) => {
      if (data.senderId === otherUserId) {
        setChat((prev) => [...prev, { ...data, timestamp: new Date() }])
      }
    })

    socket.on("userTyping", (data) => {
      if (data.userId === otherUserId) {
        setOtherUserTyping(true)
        setTimeout(() => setOtherUserTyping(false), 3000)
      }
    })

    socket.on("userStoppedTyping", (data) => {
      if (data.userId === otherUserId) {
        setOtherUserTyping(false)
      }
    })

    return () => {
      socket.off("receiveMessage")
      socket.off("userTyping")
      socket.off("userStoppedTyping")
      socket.off("connect")
      socket.off("disconnect")
    }
  }, [currentUserId, otherUserId])

  const handleTyping = (value) => {
    setMessage(value)

    if (!isTyping) {
      setIsTyping(true)
      socket.emit("typing", { userId: currentUserId, receiverId: otherUserId })
    }

    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

   
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      socket.emit("stopTyping", { userId: currentUserId, receiverId: otherUserId })
    }, 1000)
  }

  const sendMessage = async () => {
    if (!message.trim() || sendingMessage) return

    setSendingMessage(true)

    const newMessage = {
      senderId: currentUserId,
      receiverId: otherUserId,
      content: message.trim(),
      timestamp: new Date(),
    }

    try {
      
      socket.emit("sendMessage", newMessage)

      // Add to local chat immediately for better UX
      setChat((prev) => [...prev, { ...newMessage, status: "sending" }])

      // Save to database
      await axios.post("http://localhost:5000/api/messages", newMessage)

      // Update message status to sent
      setChat((prev) =>
        prev.map((msg, index) =>
          index === prev.length - 1 && msg.senderId === currentUserId ? { ...msg, status: "sent" } : msg,
        ),
      )

      setMessage("")
      setIsTyping(false)
      socket.emit("stopTyping", { userId: currentUserId, receiverId: otherUserId })
    } catch (err) {
      console.error("Send message error:", err)
      toast.error("Failed to send message")
      // Remove failed message from chat
      setChat((prev) => prev.slice(0, -1))
    } finally {
      setSendingMessage(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return ""
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return ""
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  const groupMessagesByDate = (messages) => {
    const groups = []
    let currentDate = null
    let currentGroup = []

    messages.forEach((message) => {
      const messageDate = new Date(message.timestamp).toDateString()
      if (messageDate !== currentDate) {
        if (currentGroup.length > 0) {
          groups.push({ date: currentDate, messages: currentGroup })
        }
        currentDate = messageDate
        currentGroup = [message]
      } else {
        currentGroup.push(message)
      }
    })

    if (currentGroup.length > 0) {
      groups.push({ date: currentDate, messages: currentGroup })
    }

    return groups
  }

  const messageGroups = groupMessagesByDate(chat)

  return (
    <div className="flex flex-col h-[600px]">
      {/* Connection Status */}
      {connectionStatus !== "connected" && (
        <div className="px-4 py-2 bg-yellow-50 border-b border-yellow-200 text-center">
          <div className="flex items-center justify-center space-x-2 text-sm text-yellow-800">
            <AlertCircle className="w-4 h-4" />
            <span>
              {connectionStatus === "connecting" ? "Connecting..." : "Connection lost. Trying to reconnect..."}
            </span>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messageGroups.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Start the conversation</h3>
            <p className="text-gray-600">Send a message to begin chatting about your rental.</p>
          </div>
        ) : (
          messageGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              {/* Date Separator */}
              <div className="flex items-center justify-center my-4">
                <div className="bg-white px-3 py-1 rounded-full text-xs text-gray-600 border border-gray-200 shadow-sm">
                  {formatDate(group.date)}
                </div>
              </div>

              {/* Messages */}
              {group.messages.map((msg, msgIndex) => {
                const isCurrentUser = msg.senderId === currentUserId
                const showTime =
                  msgIndex === group.messages.length - 1 ||
                  new Date(group.messages[msgIndex + 1]?.timestamp) - new Date(msg.timestamp) > 300000 // 5 minutes

                return (
                  <div key={msgIndex} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-2`}>
                    <div className={`max-w-xs lg:max-w-md ${isCurrentUser ? "order-2" : "order-1"}`}>
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          isCurrentUser
                            ? "bg-blue-600 text-white rounded-br-md"
                            : "bg-white text-gray-900 border border-gray-200 rounded-bl-md"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                      </div>

                      {showTime && (
                        <div
                          className={`flex items-center mt-1 space-x-1 ${isCurrentUser ? "justify-end" : "justify-start"}`}
                        >
                          <span className="text-xs text-gray-500">{formatTime(msg.timestamp)}</span>
                          {isCurrentUser && (
                            <div className="flex items-center">
                              {msg.status === "sending" ? (
                                <Clock className="w-3 h-3 text-gray-400" />
                              ) : msg.status === "sent" ? (
                                <Check className="w-3 h-3 text-gray-400" />
                              ) : (
                                <CheckCheck className="w-3 h-3 text-blue-500" />
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ))
        )}

        {/* Typing Indicator */}
        {otherUserTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-2 max-w-xs">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 bg-white p-4">
        <div className="flex items-end space-x-3">
          {/* Attachment Button */}
          {/* <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Paperclip className="w-5 h-5" />
          </button> */}

          {/* Message Input */}
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => handleTyping(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none max-h-32"
              style={{ minHeight: "44px" }}
            />
          </div>

          {/* Send Button */}
          <button
            onClick={sendMessage}
            disabled={!message.trim() || sendingMessage}
            className={`p-3 rounded-full transition-all ${
              message.trim() && !sendingMessage
                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {sendingMessage ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Character Count */}
        {message.length > 0 && <div className="mt-2 text-xs text-gray-500 text-right">{message.length}/1000</div>}
      </div>
    </div>
  )
}

export default ChatBox
