import Listing from '../models/Listing.js';

export const createListing = async (req, res) => {
  try {
    const newListing = await Listing.create({ ...req.body, owner: req.user.id });
    res.status(201).json(newListing);
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