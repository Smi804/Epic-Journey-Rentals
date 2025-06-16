import express from 'express';
import verifyToken from '../middleware/auth.js';
import { createListing, getAllListings,getListingById ,deleteListingById,getListingsByAvailability,getListingsByCategory,getListingsByOwner,updateListingById,getListingsByLocation,getListingsByPriceRange, searchListings } from '../controllers/listingController.js';

const router = express.Router();

router.post('/', verifyToken, createListing); // Protected


// 📌 Create new listing (only logged-in users)
router.post('/', verifyToken, createListing);

// 📌 Get all listings
router.get('/', getAllListings);

// 📌 Get listings by category
router.get('/category/:category', getListingsByCategory);

// 📌 Get listing by ID
router.get('/:id', getListingById);

// 📌 Update listing by ID (only logged-in users)
router.put('/:id', verifyToken, updateListingById);

// 📌 Delete listing by ID (only logged-in users)
router.delete('/:id', verifyToken, deleteListingById);

// 📌 Get listings created by logged-in user
router.get('/owner/my', verifyToken, getListingsByOwner);



// 📌 Search listings by title
router.get('/search/query', searchListings);

// 📌 Filter by location
router.get('/search/location', getListingsByLocation);

// 📌 Filter by price range
router.get('/search/price', getListingsByPriceRange);

// 📌 Filter by availability dates
router.get('/search/availability', getListingsByAvailability);  

export default router;
