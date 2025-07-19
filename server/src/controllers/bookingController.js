import {createNotification} from "./notificationController.js"; 
import Booking from "../models/Booking.js";
import Listing from "../models/Listing.js";

export const createBooking = async (req, res) => {
  const { listingId, startDate, endDate, totalPrice } = req.body;

  try {
    const renterId = req.user.id;

    
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    
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

    
    const newBooking = await Booking.create({
      listing: listingId,
      renter: renterId,
      startDate,
      endDate,
      totalPrice,
    });
    await createNotification({
        userId: listing.owner, 
        type: "booking",
        message: `New booking request for "${listing.title}"`,
        link: "/owner/bookings"
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
      .populate("renter", "_id name email") 
      .populate({
        path: "listing",
        select: "_id title owner",
        populate: {
          path: "owner",
          select: "_id name email",
        },
      }) 

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    const userId = req.user._id.toString()
    const userRole = req.user.role

    const renterId = booking.renter?._id?.toString()
    const ownerId = booking.listing?.owner?._id?.toString()

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

export const getBookingByOwner = async (req, res) => {
  try {
    const ownerId = req.user.id;

    
    const allBookings = await Booking.find()
      .populate({
        path: "listing",
        match: { owner: ownerId }, 
        select: "title price owner", 
      })
      .populate("renter", "fullname email"); 

    
    const ownerBookings = allBookings.filter((booking) => booking.listing !== null);

    res.status(200).json({
      message: "Bookings fetched successfully",
      bookings: ownerBookings,
    });
  } catch (error) {
    console.error("Error fetching bookings for owner:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};



/* export const updateBookingStatus = async (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body;

  // Validate incoming status
  const validStatuses = ["pending", "confirmed", "cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid booking status" });
  }

  try {
    const booking = await Booking.findById(bookingId).populate("listing");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Ensure owner owns this listing
    if (booking.listing.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to update this booking" });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({ message: "Booking status updated", booking });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}; */
export const updateBookingStatus = async (req, res) => {

  try {
     const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId)
     console.log("Received PATCH request for Booking ID:", bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" })

    booking.status = req.body.status
    await booking.save()
      let message;
        if (booking.status === "confirmed") {
          message = `Your booking for "${booking.listing.title}" was confirmed.`;
        } else if (status === "cancelled") {
          message = `Your booking for "${booking.listing.title}" was cancelled.`;
        }

         if (message) {
          await createNotification({
            userId: booking.renter._id,
            type: "booking",
            message,
            link: "/renter/bookings"
          });
        } 


    res.status(200).json({ message: "Booking status updated" })
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
}



