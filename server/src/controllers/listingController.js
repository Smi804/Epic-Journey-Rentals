import Listing from '../models/Listing.js';
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

export const createListing = async (req, res) => {
  try {
    const files = req.files;
    const uploadedImageUrls = [];

    // Upload each image to Cloudinary
    for (const file of files) {
      const result = await cloudinary.uploader.upload_stream(
        { folder: "listings" },
        (error, result) => {
          if (error) throw error;
          uploadedImageUrls.push(result.secure_url);
          if (uploadedImageUrls.length === files.length) {
            finalizeListing();
          }
        }
      );

      // Pipe buffer to Cloudinary stream
      streamifier.createReadStream(file.buffer).pipe(result);
    }

    function finalizeListing() {
      const { title, description, category, price, location, availability } = req.body;

      Listing.create({
        title,
        description,
        category,
        price,
        location,
        availability,
        images: uploadedImageUrls,
        owner: req.user.id,
      })
        .then((listing) =>
          res.status(201).json({ message: "Listing created", listing })
        )
        .catch((err) =>
          res.status(500).json({ message: "DB error", error: err.message })
        );
    }
  } catch (err) {
    console.error("Listing upload error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};




export const getAllListings = async (req, res) => {
  try {
    const mylistings = await Listing.find();
    console.log("Count of listings in DB:", mylistings.length); // Should not be 0

    const listings = await Listing.find().populate('owner', 'name email');
    console.log("Fetched listings:", listings);
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


export const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('owner', 'name email');
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


export const deleteListingById = async (req, res) => {
  try {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.json({ message: 'Listing deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

export const updateListingById = async (req, res) => {
  try {
    const listingId = req.params.id;
    const {
      title,
      description,
      category,
      price,
      location,
      availability,
      existingImages = [],
    } = req.body;

    const uploadedImageUrls = [];

    const uploadPromises = req.files.map(
      (file) =>
        new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "listings" },
            (err, result) => {
              if (err) return reject(err);
              resolve(result.secure_url);
            }
          );
          streamifier.createReadStream(file.buffer).pipe(uploadStream);
        })
    );

    const cloudinaryUrls = await Promise.all(uploadPromises);
    uploadedImageUrls.push(...cloudinaryUrls);

    const allImages = [...existingImages, ...uploadedImageUrls];

    const updatedListing = await Listing.findByIdAndUpdate(
      listingId,
      {
        title,
        description,
        category,
        price,
        location,
        availability: {
          startDate: availability?.startDate,
          endDate: availability?.endDate,
        },
        images: allImages,
      },
      { new: true }
    );

    if (!updatedListing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.json({ message: "Listing updated successfully", listing: updatedListing });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


/* 
export const updateListingById = async (req, res) => {
  try {
    const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedListing) {
      return res.status(404).json({ message: 'Listing not found' });
    } 
    res.json({ message: 'Listing updated successfully', listing: updatedListing });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
} */

export const getListingsByOwner = async (req, res) => {
  try {
    console.log("Looking for listings for owner:", req.user)

    const listings = await Listing.find({owner: req.user.id}).sort({ createdAt: -1 });
    if (!listings || listings.length === 0) { 
      return res.status(404).json({ message: 'No listings found for this owner' });
    }
    res.json(listings)
  } catch (err) {
    console.error(" Error in getListingsByOwner:", err)
    res.status(500).json({ message: "Server error", error: err.message })
  }
}




export const getListingsByCategory = async (req, res) => {
  try {
    const listings = await Listing.find({ category: req.params.category }).populate('owner', 'name email');
    if (!listings.length) {
      return res.status(404).json({ message: 'No listings found for this category' });
    }
    res.status(200).json({message: 'listings Found' ,listings});
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


export const searchListings = async (req, res) => {
  try {
    const { query } = req.query;
    const listings = await Listing.find({ title: new RegExp(query, 'i') }).populate('owner', 'name email');
    if (!listings.length) {
      return res.status(404).json({ message: 'No listings found' });
    }
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


export const getListingsByLocation = async (req, res) => {
  try {
    const { location } = req.query;
    const listings = await Listing.find({ location: new RegExp(location, 'i') }).populate('owner', 'name email');
    if (!listings.length) {
      return res.status(404).json({ message: 'No listings found for this location' });
    }
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getListingsByPriceRange = async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.query;
    const listings = await Listing.find({
      price: { $gte: minPrice, $lte: maxPrice }
    }).populate('owner', 'name email');
    if (!listings.length) {
      return res.status(404).json({ message: 'No listings found in this price range' });
    }
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
export const getListingsByAvailability = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const listings = await Listing.find({
      'availability.startDate': { $lte: new Date(endDate) },
      'availability.endDate': { $gte: new Date(startDate) }
    }).populate('owner', 'name email');
    if (!listings.length) {
      return res.status(404).json({ message: 'No listings available for these dates' });
    }
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
