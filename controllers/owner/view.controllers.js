import Property from "../../models/property.model.js";
import User from "../../models/user.model.js";
import { View } from "../../models/view.model.js";

export const getOwnerPropertyViews = async (req, res) => {
    try {
      const ownerId = req.user.userId;
  
      const views = await View.find({ ownerId }).lean();
  
      const response = await Promise.all(
        views.map(async (view) => {
          const viewer = await User.findById(view.viewerId).lean();
          const property = await Property.findById(view.propertyId).lean();
  
          return {
            viewId: view._id,
            viewedTime: view.viewedAt,
            ipAddress: view.ipAddress,
            userAgent: view.userAgent,
            viewerId: viewer?._id || null,
            viewerName: `${viewer?.firstName} ${viewer?.lastName}` || "",
            viewerEmail: viewer?.email || ""
          };
        })
      );
  
      res.status(200).json({
        success: true,
        data: response,
      });
    } catch (error) {
      errorHandler(error, req, res);
    }
  };