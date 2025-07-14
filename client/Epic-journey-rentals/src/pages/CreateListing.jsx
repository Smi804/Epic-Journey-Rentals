import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../Comps/Navbar";
import Footer from "../Comps/Footer";
import { DollarSign, MapPin, Calendar, CheckCircle, Loader } from "lucide-react";

const CreateListing = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    location: "",
    availability: { startDate: "", endDate: "" },
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }
    setImages((prev) => [...prev, ...files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in");
      navigate("/auth");
      return;
    }

    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("category", formData.category);
      form.append("price", formData.price);
      form.append("location", formData.location);
      form.append("availability[startDate]", formData.availability.startDate);
      form.append("availability[endDate]", formData.availability.endDate);

      images.forEach((file) => {
        form.append("images", file);
      });

      const res = await fetch("http://localhost:5000/api/listings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");

      toast.success("Listing created successfully!");
      navigate("/owner/listings");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(`Upload failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen py-10 px-4 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Listing</h1>
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow">
          <div>
            <label className="block font-medium mb-1">Title</label>
            <input
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2"
              rows="4"
              required
            ></textarea>
          </div>
          <div>
            <label className="block font-medium mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2"
              required
            >
              <option value="">Select</option>
              <option value="gear">Gear</option>
              <option value="vehicle">Vehicle</option>
              <option value="room">Room</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Price</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              <input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full pl-10 border border-gray-300 rounded px-4 py-2"
                required
              />
            </div>
          </div>
          <div>
            <label className="block font-medium mb-1">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              <input
                name="location"
                type="text"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full pl-10 border border-gray-300 rounded px-4 py-2"
                required
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Start Date</label>
              <input
                name="availability.startDate"
                type="date"
                value={formData.availability.startDate}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-4 py-2"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">End Date</label>
              <input
                name="availability.endDate"
                type="date"
                value={formData.availability.endDate}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-4 py-2"
                required
              />
            </div>
          </div>
          <div>
            <label className="block font-medium mb-1">Upload Images (max 10)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader className="w-4 h-4 animate-spin" /> Uploading...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Publish Listing
              </span>
            )}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default CreateListing;
