import { useEffect, useState } from "react";
import { Trash2, Loader, Bell } from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../Comps/Navbar";
import Footer from "../Comps/Footer";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        setNotifications(Array.isArray(data) ? data : []);
        if (data.length === 0) {
          toast.info("No notifications found");
        }
      } else {
        toast.error(data.message || "Failed to load notifications");
      }
    } catch (err) {
      toast.error("Error fetching notifications");
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/api/notifications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Notification deleted");
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6 min-h-screen bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Bell className="w-6 h-6 text-blue-600" />
          Your Notifications
        </h1>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-500">
            <Loader className="w-6 h-6 animate-spin mr-2" /> Loading...
          </div>
        ) : notifications.length === 0 ? (
          <p className="text-gray-500">You have no notifications.</p>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`flex justify-between items-start p-4 rounded-lg shadow-sm border bg-white transition ${
                  !notification.isRead ? "bg-blue-50" : ""
                }`}
              >
                <div>
                  <p className="text-gray-800">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteNotification(notification._id)}
                  className="text-red-500 hover:text-red-700 transition"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default NotificationsPage;
