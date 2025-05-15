import mongoose from "mongoose";
import Property from "../../models/property.model.js";
import Amenity from "../../models/amenity.model.js";
import errorHandler from "../../lib/errorHandler.js";
import PriceHistory from "../../models/pricehistory.model.js";
import { Inquiry } from "../../models/inquiry.model.js";

export const createProperty = async (req, res) => {
  try {
    const {
      title,
      type,
      price,
      area,
      address,
      city,
      state,
    } = req.body;

    const createdBy = req.user.userId;
    const role = req.user.role;

    if (!title || !type || !price || !area || !address || !city || !state) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    if (role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Only owners can create properties",
      });
    }

    const newProperty = new Property({
      title,
      type,
      price,
      area,
      address: {
        line1: address,
        city,
        state: new mongoose.Types.ObjectId(state),
      },
      createdBy,
      amenities: req.body.amenities || [],
      bedrooms: req.body.bedrooms || 0,
      bathrooms: req.body.bathrooms || 0,
      description: req.body.description || "",
      images: req.files?.map(file => file.filename) || [],
    });

    const savedProperty = await newProperty.save();

    // Log the first price entry in PriceHistory
    const priceHistoryEntry = new PriceHistory({
      propertyId: savedProperty._id,
      prices: [{
        price: savedProperty.price,
        changedBy: createdBy,
      }],
    });
    await priceHistoryEntry.save();

    res.status(201).json({
      success: true,
      message: "Property created successfully",
      data: savedProperty,
    });
  } catch (error) {
    console.error("Create Property Error:", error.message);
    errorHandler(error, req, res)
  }
};

export const getAllPropertiesByOwner = async (req, res) => {
  try {
    const ownerId = req.user.userId;

    const properties = await Property.find({ createdBy: ownerId }).select(
      "title description price address images propertyType status"
    );

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const updatePropertyAmenities = async (req, res) => {
  try {
    const { id } = req.params;
    const { add = [], delete: remove = [] } = req.body;

    // Validate input types
    if (!Array.isArray(add) || !Array.isArray(remove)) {
      return res.status(400).json({ message: "add and delete must be arrays" });
    }

    // Fetch property
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const currentAmenities = new Set(property.amenities.map(String));

    // Check that all amenity IDs exist in the Amenity collection
    const amenityIds = [...new Set([...add, ...remove])]; // combine unique
    const foundAmenities = await Amenity.find({ _id: { $in: amenityIds } }).select("_id");

    const foundIds = foundAmenities.map(a => a._id.toString());
    const invalidIds = amenityIds.filter(id => !foundIds.includes(id));
    if (invalidIds.length > 0) {
      return res.status(400).json({
        message: "Some amenity IDs do not exist",
        invalidAmenityIds: invalidIds,
      });
    }

    // Validate that all IDs in `delete` are already in property's amenities
    const notPresent = remove.filter(id => !currentAmenities.has(id));
    if (notPresent.length > 0) {
      return res.status(400).json({
        message: "Some amenities in delete list are not part of this property",
        invalidRemovals: notPresent,
      });
    }

    add.forEach(id => currentAmenities.add(id));
    remove.forEach(id => currentAmenities.delete(id));
    property.amenities = [...currentAmenities];
    await property.save();

    res.status(200).json({
      message: "Amenities updated successfully",
      amenities: property.amenities,
    });
  } catch (error) {
    console.error("Error updating property amenities:", error);
    errorHandler(error, req, res)
  }
};

export const addPropertyImages = async (req, res, next) => {
  try {
    console.log("request is ", req.files)
    if (!req.files) {
      res.status(400).json({
        message: "Please add image(s) of properties."
      })
    }
    const propertyId = req.params.id;
    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: "Property not found" });

    const newImages = req.files?.map((file) => file.filename) || [];
    property.images.push(...newImages);
    await property.save();

    res.status(200).json({ message: "Images added successfully", images: property.images });
  } catch (err) {
    next(err);
  }
};

export const deletePropertyImage = async (req, res, next) => {
  try {
    const propertyId = req.params.id;
    const { filename } = req.body;
    if (!filename) return res.status(400).json({ message: "Filename is required" });

    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: "Property not found" });

    if (!property.images.includes(filename)) {
      return res.status(400).json({ message: "Image not found in property" });
    }

    // Remove from DB
    property.images = property.images.filter((img) => img !== filename);
    await property.save();

    // Delete file
    const imagePath = path.join("uploads", filename);
    fs.unlink(imagePath, (err) => {
      if (err && err.code !== "ENOENT") {
        return next(err); // real fs error
      }
    });

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export const getPropertyImages = async (req, res, next) => {
  try {
    const { id } = req.params;

    const property = await Property.findById(id).select("images");

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    return res.status(200).json({
      message: "Images fetched successfully",
      images: property.images || [],
    });
  } catch (err) {
    next(err);
  }
};

export const updatePropertyTags = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { add = [], delete: remove = [] } = req.body;

    if (!Array.isArray(add) || !Array.isArray(remove)) {
      return res.status(400).json({ message: "add and delete must be arrays" });
    }

    const property = await Property.findById(id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    // Remove tags
    const notPresent = remove.filter(tag => !property.tags.includes(tag));
    if (notPresent.length > 0) {
      return res.status(400).json({ message: `Some tags to delete are not present: ${notPresent.join(", ")}` });
    }
    property.tags = property.tags.filter(tag => !remove.includes(tag));

    // Add new tags (avoid duplicates)
    add.forEach(tag => {
      if (!property.tags.includes(tag)) {
        property.tags.push(tag);
      }
    });

    await property.save();
    res.status(200).json({ message: "Tags updated successfully", tags: property.tags });
  } catch (err) {
    next(err);
  }
};

export const getPriceHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const history = await PriceHistory.findOne({ propertyId: id });

    if (!history) {
      return res.status(404).json({
        success: false,
        message: "Price history not found for this property",
      });
    }

    res.status(200).json({
      success: true,
      message: "Price history fetched successfully",
      data: history,
    });
  } catch (error) {
    console.error("Get Price History Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const answerInquiry = async (req, res) => {
  try {
    const { propertyId, inquiryId } = req.params;
    const { answer } = req.body;
    const userId = req.user.userId;
    const userRole = req.user.role;

    if (!answer) {
      return res.status(400).json({
        success: false,
        message: "Answer is required",
      });
    }

    // Check if the property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    // Check if the inquiry exists
    const inquiry = await Inquiry.findById(inquiryId);
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    // Ensure the property is owned by the logged-in user
    if (property.createdBy.toString() !== userId || userRole !== "owner") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to answer this inquiry",
      });
    }

    // Update the inquiry with the owner's answer
    inquiry.answer = answer;
    inquiry.status = "answered";
    await inquiry.save();

    res.status(200).json({
      success: true,
      message: "Inquiry answered successfully"
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

export const getInquiryDetails = async (req, res) => {
  try {
    const { inquiryId } = req.params;
    const { propertyId } = req.params;  // Extract propertyId from request params

    // Check if both inquiryId and propertyId are provided
    if (!inquiryId || !propertyId) {
      return res.status(400).json({ success: false, message: "Both inquiry ID and property ID are required" });
    }

    // Find the inquiry by ID and populate necessary fields
    const inquiry = await Inquiry.findById(inquiryId)
      .populate('enquirer', 'name email phone')  // Populate 'enquirer' with User fields: name, email, phone
      .populate('propertyId', 'title address')  // Optionally, populate the 'propertyId' with title and address fields
      .exec();

    if (!inquiry) {
      return res.status(404).json({ success: false, message: "Inquiry not found" });
    }

    console.log("property r id ", propertyId, " and enquiry r proeprty id holo ", inquiry.propertyId.toString());


    if (inquiry.propertyId._id.toString() !== propertyId) {
      return res.status(400).json({ success: false, message: "Property ID does not match the inquiry's property" });
    }

    if (!inquiry.enquirer) {
      return res.status(404).json({ success: false, message: "Enquirer details not found" });
    }
    if (!inquiry.propertyId) {
      return res.status(404).json({ success: false, message: "Property details not found" });
    }

    res.status(200).json({ success: true, data: inquiry });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

export const updateFeaturedStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isFeatured, featuredUntil } = req.body;
    if(isFeatured == null) {
      return res.status(400).json({
        message: "Please make sure to provide proper value of the isFeatured field"
      })
    }
    else if(isFeatured) {
      if(!featuredUntil) {
        return res.status(400).json({
          message: "Please make sure to provide proper value of the featuredUntil field"
        })
      }
    }

    if (typeof isFeatured !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isFeatured must be a boolean",
      });
    }

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    property.isFeatured = isFeatured;
    property.featuredUntil = isFeatured ? new Date(featuredUntil) : null;

    await property.save();

    res.status(200).json({
      success: true,
      message: "Featured status updated successfully",
      data: property,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};