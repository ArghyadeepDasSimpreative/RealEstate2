import express from "express";
import { authorizeRole } from "../../middlewares/authorize.js";
import { createLease } from "../../controllers/owner/lease.controllers.js";

const ownerLeaseRoutes = express.Router();

ownerLeaseRoutes.post("/:propertyId", authorizeRole("owner"), );

export default ownerLeaseRoutes;