import errorHandler from "../../lib/errorHandler.js";
import Property from "../../models/property.model.js";
import { View } from "../../models/view.model.js";

export const addPropertyView = async (req, res) => {
    try {
        const propertyId = req.params.propertyId;
        if(!propertyId) {
            return res.status(400).json({
                message: "Please add a property ID"
            })
        }
        const viewerId = req.user.userId;
        const ip = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
        const userAgent = req.get("User-Agent");

        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found",
            });
        }

        const ownerId = property.createdBy;

        const alreadyViewed = await View.findOne({ propertyId, viewerId });
        if (alreadyViewed) {
            return res.status(200).json({
                success: true,
                message: "User has already viewed this property",
            });
        }

        const newView = await View.create({
            propertyId,
            viewerId,
            ownerId,
            viewedTime: new Date(),
            ipAddress: ip,
            userAgent,
        });

        res.status(201).json({
            success: true,
            message: "View added"
        });
    } catch (error) {
        errorHandler(error, req, res);
    }
};