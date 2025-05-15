import express from "express";
import { authorizeRole } from "../../middlewares/authorize.js";
import {
  createState,
  getAllStates,
  getStateById,
  updateStateById,
  deleteStateById,
} from "../../controllers/admin/state.controllers.js";

const stateRoutes = express.Router();

// All routes are protected and only accessible by admin
stateRoutes.post("/", authorizeRole("admin"), createState);
stateRoutes.get("/", authorizeRole("admin"), getAllStates);
stateRoutes.get("/:id", authorizeRole("admin"), getStateById);
stateRoutes.put("/:id", authorizeRole("admin"), updateStateById);
stateRoutes.delete("/:id", authorizeRole("admin"), deleteStateById);

export default stateRoutes;
