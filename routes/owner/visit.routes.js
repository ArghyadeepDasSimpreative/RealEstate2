import express from "express";
import { authorizeRole } from "../../middlewares/authorize.js";
import { respondToVisitRequest } from "../../controllers/owner/visit.controllers.js";

const ownerVisitRoutes = express.Router();

ownerVisitRoutes.put("/:visitId", authorizeRole("owner"), respondToVisitRequest);

export default ownerVisitRoutes;