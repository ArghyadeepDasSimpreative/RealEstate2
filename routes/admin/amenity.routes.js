import express from "express";
import { authorizeRole } from "../../middlewares/authorize.js";
import { uploadSingleFile } from "../../middlewares/fileupload.js";
import { 
  addAmenity, 
  getAllAmenities, 
  getAmenityById, 
  updateAmenityById, 
  deleteAmenityById 
} from "../../controllers/admin/amenity.controllers.js";

const amenityRoutes = express.Router();

amenityRoutes.post("/", authorizeRole("admin"), uploadSingleFile("icon"), addAmenity);
amenityRoutes.get("/", authorizeRole("admin"), getAllAmenities);
amenityRoutes.get("/:id", authorizeRole("admin"), getAmenityById);
amenityRoutes.put("/:id", authorizeRole("admin"), uploadSingleFile("icon"), updateAmenityById);
amenityRoutes.delete("/:id", authorizeRole("admin"), deleteAmenityById);

export default amenityRoutes;
