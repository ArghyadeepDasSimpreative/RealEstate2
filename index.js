import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import connectToDB from "./database/config.js";
import authRoutes from "./routes/auth/auth.routes.js";
import adminUserRoutes from "./routes/admin/user.routes.js";
import amenityRoutes from "./routes/admin/amenity.routes.js";
import stateRoutes from "./routes/admin/state.routes.js";
import ownerProertyRoutes from "./routes/owner/property.routes.js";
import clientPropertyRoutes from "./routes/client/property.routes.js";
import ownerLeaseRoutes from "./routes/owner/lease.routes.js";
import clientLeaseRoutes from "./routes/client/lease.routes.js";
import clientVisitRoutes from "./routes/client/visit.routes.js";
import ownerVisitRoutes from "./routes/owner/visit.routes.js";
import clientReviewRoutes from "./routes/client/review.routes.js";

dotenv.config();

connectToDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for form-data

// Serve static files (uploaded images)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use("/auth", authRoutes);
app.use("/admin/users", adminUserRoutes);
app.use("/admin/amenities", amenityRoutes);
app.use("/admin/states", stateRoutes);

app.use("/owner/property", ownerProertyRoutes);
app.use("/owner/lease", ownerLeaseRoutes);
app.use("/owner/visit", ownerVisitRoutes);

app.use("/client/property", clientPropertyRoutes);
app.use("/client/lease", clientLeaseRoutes);
app.use("/client/visit", clientVisitRoutes);
app.use("/client/review", clientReviewRoutes);


// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
