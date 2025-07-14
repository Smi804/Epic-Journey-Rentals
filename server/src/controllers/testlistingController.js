/* import TestListing from "../models/TestListing.js";

export const createTestListing = async (req, res) => {
  try {
    console.log("REQ FILE =>", req.file);
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const imageUrl = req.file.path; // If using multer + Cloudinary
    const newListing = await TestListing.create({ image: imageUrl });

    res.status(201).json({ message: "Test listing created", listing: newListing });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
 */
import { v2 as cloudinary } from "cloudinary";
import TestListing from "../models/TestListing.js";

export const createTestListing = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      { folder: "epic-journey-test" }, 
      async (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return res.status(500).json({ message: "Upload failed", error });
        }

        // Save URL to MongoDB
        const newListing = await TestListing.create({
          image: result.secure_url,
        });

        res.status(201).json({ message: "Uploaded successfully", listing: newListing });
      }
    );

    // Send buffer to Cloudinary
    result.end(req.file.buffer);

  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
