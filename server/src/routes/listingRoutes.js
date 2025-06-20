import express from 'express'
import verifyToken from '../middleware/auth.js'
import { requireRole } from '../middleware/role.js'
import upload from '../middleware/multer.js'
import {
  createListing,
  getAllListings,
  getListingById,
  deleteListingById,
  getListingsByAvailability,
  getListingsByCategory,
  getListingsByOwner,
  updateListingById,
  getListingsByLocation,
  getListingsByPriceRange,
  searchListings,
} from '../controllers/listingController.js'

const router = express.Router()


router.post('/', verifyToken, requireRole('owner'),upload.array("images", 5), createListing)

router.get('/', getAllListings)
router.get('/category/:category', getListingsByCategory)
router.get('/:id', getListingById)

router.put('/:id', verifyToken, requireRole('owner'), updateListingById)
router.delete('/:id', verifyToken, requireRole('owner'), deleteListingById)
router.get('/owner/listings', verifyToken,requireRole('owner'), getListingsByOwner)

router.get('/search/query', searchListings)
router.get('/search/location', getListingsByLocation)
router.get('/search/price', getListingsByPriceRange)
router.get('/search/availability', getListingsByAvailability)

export default router
