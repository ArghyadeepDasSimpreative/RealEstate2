import express from "express";
import { authorizeRole } from "../../middlewares/authorize.js";
import { clientAgreeToLease } from "../../controllers/client/lease.controller.js";

const clientLeaseRoutes = express.Router();

clientLeaseRoutes.put("/:leaseId", authorizeRole("client"), clientAgreeToLease);

export default clientLeaseRoutes;