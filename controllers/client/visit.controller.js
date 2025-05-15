import mongoose from "mongoose";
import { PropertyVisit } from "../../models/visit.model.js";
import errorHandler from "../../lib/errorHandler.js";
import Property from "../../models/property.model.js";


export const requestPropertyVisit = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { requestedDateTime } = req.body;
    const visitorId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    const existingVisit = await PropertyVisit.findOne({
      propertyId,
      visitorId,
      status: { $in: ["pending", "approved"] },
    });

    if (existingVisit) {
      return res.status(400).json({
        success: false,
        message: "You already have a pending or approved visit for this property",
      });
    }

    const visit = new PropertyVisit({
      propertyId,
      visitorId,
      ownerId: property.createdBy,
      requestedDateTime,
    });

    const savedVisit = await visit.save();

    res.status(201).json({
      success: true,
      message: "Visit request submitted successfully",
      data: savedVisit,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

export const getClientVisitRequests = async (req, res) => {
  try {
    const clientId = req.user.userId;

    const visits = await PropertyVisit.find({ visitorId: clientId })
      .populate("propertyId", "title address")
      .sort({ requestedAt: -1 });

    res.status(200).json({
      success: true,
      message: "Visit requests fetched successfully",
      data: visits,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};
