import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: { type: String, enum: ['gear', 'vehicle', 'room'], required: true },
  price: { type: Number, required: true },
  images: [String],
  location: String,
  availability: {
    startDate: Date,
    endDate: Date
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const Listing = mongoose.model('Listing', listingSchema);
export default Listing;
