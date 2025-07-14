import mongoose from "mongoose";

const testListingSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const TestListing = mongoose.model("TestListing", testListingSchema);
export default TestListing;
