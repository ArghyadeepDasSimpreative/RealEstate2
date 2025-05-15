import express from "express";
import { authorizeRole } from "../../middlewares/authorize.js";
import { addPropertyImages, answerInquiry, createProperty, deletePropertyImage, getAllPropertiesByOwner, getInquiryDetails, getPriceHistory, getPropertyImages, updateFeaturedStatus, updatePropertyAmenities, updatePropertyTags } from "../../controllers/owner/property.controllers.js";
import { uploadMultipleFiles } from "../../middlewares/fileupload.js";
import { getOwnerPropertyViews } from "../../controllers/owner/view.controllers.js";

const ownerProertyRoutes = express.Router();

ownerProertyRoutes.post("/", authorizeRole("owner"), uploadMultipleFiles("images"), createProperty);
ownerProertyRoutes.get("/", authorizeRole("owner"), getAllPropertiesByOwner );
ownerProertyRoutes.put("/amenities/:id", authorizeRole("owner"), updatePropertyAmenities);
ownerProertyRoutes.post("/amenities/:id/image", authorizeRole("owner"), uploadMultipleFiles("image"), addPropertyImages);
ownerProertyRoutes.delete("/amenities/:id/image", authorizeRole("owner"), deletePropertyImage);
ownerProertyRoutes.get("/amenities/:id/image", authorizeRole("owner"), getPropertyImages);
ownerProertyRoutes.put("/amenities/:id/tags", authorizeRole("owner"), updatePropertyTags);
ownerProertyRoutes.get("/amenities/:id/price/history", authorizeRole("owner"), getPriceHistory);
ownerProertyRoutes.get("/:propertyId/inquiry/:inquiryId", authorizeRole("owner"), getInquiryDetails);
ownerProertyRoutes.put("/:propertyId/inquiry/:inquiryId", authorizeRole("owner"), answerInquiry);
ownerProertyRoutes.put("/:id/featured", authorizeRole("owner"), updateFeaturedStatus);
ownerProertyRoutes.get("/:propertyId/views", authorizeRole("owner"), getOwnerPropertyViews);

export default ownerProertyRoutes;