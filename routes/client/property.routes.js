import express from "express";
import { authorizeRole } from "../../middlewares/authorize.js";
import { addInquiry } from "../../controllers/client/property.controller.js";
import { addPropertyView } from "../../controllers/client/view.controller.js";

const clientPropertyRoutes = express.Router();

clientPropertyRoutes.post("/inquiry/:id", authorizeRole("client"), addInquiry);
clientPropertyRoutes.post("/:propertyId/view",  authorizeRole("client"), addPropertyView);


export default clientPropertyRoutes;