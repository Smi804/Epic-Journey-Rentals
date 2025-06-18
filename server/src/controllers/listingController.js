import Listing from '../models/Listing.js';

export const createListing = async (req, res) => {
  try {
    const newListing = await Listing.create({ ...req.body, owner: req.user.id });
    if (!newListing) {
      return res.status(400).json({ message: 'Failed to create listing' });
    }
    res.status(201).json({ message: 'Listing created successfully', listing: newListing });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



export const getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find().populate('owner', 'name email');
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
    const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedListing) {
      return res.status(404).json({ message: 'Listing not found' });
    } 
    res.json({ message: 'Listing updated successfully', listing: updatedListing });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

export const getListingsByOwner = async (req, res) => {
  try {
    console.log("Looking for listings for owner:", req.user)

    const listings = await Listing.find({owner: req.user.id});
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
