import express from "express";
import { authorizeRole } from "../../middlewares/authorize.js";
import { getAllUsers } from "../../controllers/admin/user.controllers.js";

const adminUserRoutes = express.Router();

adminUserRoutes.get("/", authorizeRole("admin"), getAllUsers);

export default adminUserRoutes;