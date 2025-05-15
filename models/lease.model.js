import mongoose from "mongoose";

const leaseSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  leaseStartDate: {
    type: Date,
    required: true,
  },
  leaseEndDate: {
    type: Date,
    required: true,
  },
  monthlyRent: {
    type: Number,
    required: true,
  },
  securityDeposit: {
    type: Number,
    required: true,
  },
  terms: {
    type: String,
    default: "",
  },
  documents: {
    type: [String], // Array of file paths or URLs
    default: [],
  },
  isAgreedByTenant: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["active", "terminated", "completed"],
    default: "active",
  }
}, { timestamps: true });

const Lease = mongoose.model("Lease", leaseSchema);

export default Lease;
