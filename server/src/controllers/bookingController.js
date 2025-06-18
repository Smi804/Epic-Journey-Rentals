import Booking from "../models/Booking.js";
import Listing from "../models/Listing.js";

export const createBooking = async (req, res) => {
  const { listingId, startDate, endDate, totalPrice } = req.body;

  try {
    const renterId = req.user.id; // ✅ Correct this line

    // Check if listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Check for conflicting booking
    const conflict = await Booking.findOne({
      listing: listingId,
      startDate: { $lte: new Date(endDate) },
      endDate: { $gte: new Date(startDate) },
    });

    if (conflict) {
      return res.status(400).json({
        message: "This listing is already booked for the selected dates",
      });
    }

    // Create new booking
    const newBooking = await Booking.create({
      listing: listingId,
      renter: renterId,
      startDate,
      endDate,
      totalPrice,
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (error) {
    console.error("Booking creation error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
export const getBookingsByRenter = async (req, res) => {
  try {
    const renterId = req.user.id; 
    const bookings = await Booking.find({ renter: renterId })
      .populate("listing", "title price")
      .populate("renter", "name email");

    res.status(200).json({
      message: "Bookings fetched successfully",
      bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


 export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("renter", "_id name email") // this will ensure renter is an object
      .populate({
        path: "listing",
        select: "_id title owner",
        populate: {
          path: "owner",
          select: "_id name email", // nested populate to access listing.owner
        },
      }) 

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    const userId = req.user._id.toString()
    const userRole = req.user.role

    const renterId = booking.renter?._id?.toString()
    const ownerId = booking.listing?.owner?._id?.toString()

    // Allow if the user is the renter
    if (userRole === "renter" && renterId === userId) {
      return res.json(booking)
    }

    // Allow if the user is the listing's owner
    if (userRole === "owner" && ownerId === userId) {
      return res.json(booking)
    }

    return res.status(403).json({
      message: "Access denied. You don't have permission to view this booking.",
    })
  } catch (error) {
    console.error("getBookingById error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}



