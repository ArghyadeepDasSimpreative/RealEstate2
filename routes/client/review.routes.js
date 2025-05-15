import express from "express";
import { authorizeRole } from "../../middlewares/authorize.js";
import { addReview, getAllReviewsForProperty } from "../../controllers/client/review.controller.js";
import { uploadMultipleFiles } from "../../middlewares/fileupload.js";

const clientReviewRoutes = express.Router();

clientReviewRoutes.post("/:propertyId", authorizeRole("client"), uploadMultipleFiles("image"), addReview );
clientReviewRoutes.get("/:propertyId", authorizeRole("client"), getAllReviewsForProperty);

export default clientReviewRoutes;