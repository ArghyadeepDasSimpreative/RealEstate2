import errorHandler from "../../lib/errorHandler.js";
import { Inquiry } from "../../models/inquiry.model.js";
import Property from "../../models/property.model.js";
import User from "../../models/user.model.js";

export const addInquiry = async (req, res) => {
    try {
      const { id } = req.params;
      const { userId, role } = req.user;

      const property = await Property.findById(id);
      if (!property) {
        return res.status(404).json({
          success: false,
          message: "Property not found",
        });
      }
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
  
      if (role !== "client") {
        return res.status(403).json({
          success: false,
          message: "Only buyers can ask inquiries",
        });
      }
  
      const { question } = req.body;
      if (!question) {
        return res.status(400).json({
          success: false,
          message: "Question field is required",
        });
      }
  
      const newInquiry = new Inquiry({
        propertyId: id,
        enquirer: userId,
        question,
      });
  
      const savedInquiry = await newInquiry.save();
  
      return res.status(201).json({
        success: true,
        message: "Inquiry created successfully",
        data: savedInquiry,
      });
    } catch (error) {
      console.error("Add Inquiry Error:", error.message);
      errorHandler(error, req, res)
    }
  };

  export const searchProperties = async (req, res) => {
  try {
    const {
      minPrice,
      maxPrice,
      isFeatured,
      minSize,
      maxSize,
      minRating,
      maxRating,
      location,
    } = req.query;

    const filter = {};

    if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
    if (isFeatured !== undefined) filter.isFeatured = isFeatured === "true";
    if (minSize) filter.size = { ...filter.size, $gte: Number(minSize) };
    if (maxSize) filter.size = { ...filter.size, $lte: Number(maxSize) };
    if (location) filter.location = { $regex: location, $options: "i" };
    if (minRating || maxRating) {
      filter.averageRating = {};
      if (minRating) filter.averageRating.$gte = Number(minRating);
      if (maxRating) filter.averageRating.$lte = Number(maxRating);
    }

    const properties = await Property.find(filter);
    res.status(200).json(properties);
  } catch (error) {
    errorHandler(error, req, res);
  }
};