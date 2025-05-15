import express from "express";

import { authorizeRole } from "../../middlewares/authorize.js"
import { getClientVisitRequests, requestPropertyVisit } from "../../controllers/client/visit.controller.js";

const clientVisitRoutes = express.Router();


clientVisitRoutes.post("/:propertyId", authorizeRole("client"), requestPropertyVisit);
clientVisitRoutes.get("/", authorizeRole("client"), getClientVisitRequests);

export default clientVisitRoutes;