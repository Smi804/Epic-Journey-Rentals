import express from 'express';
import verifyToken from '../middleware/auth.js';
import { createListing, getAllListings,getListingById } from '../controllers/listingController.js';

const router = express.Router();

router.post('/', verifyToken, createListing); // Protected


router.get('/', getAllListings);   
router.get('/:id' ,getListingById)         // Public

export default router;
