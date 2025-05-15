import errorHandler from "../../lib/errorHandler.js";
import Property from "../../models/property.model.js";
import { Review } from "../../models/review.model.js";

export const addReview = async (req, res) => {
  try {
    const { rating, reviewText } = req.body;
    const { propertyId } = req.params;
    const userId = req.user.userId;

    if (!propertyId || !rating || !reviewText) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const images = req.files?.map(file => file.path) || [];

    const review = new Review({
      propertyId,
      userId,
      rating,
      reviewText,
      images,
    });

    await review.save();

    res.status(201).json({ message: "Review added successfully", review });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

export const getAllReviewsForProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const reviews = await Review.find({ propertyId })
      .populate({
        path: "userId",
        select: "name email",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ reviews });
  } catch (error) {
    errorHandler(error, req, res);
  }
};