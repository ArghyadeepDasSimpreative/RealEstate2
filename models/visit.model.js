import mongoose from "mongoose";

const propertyVisitSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    visitorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requestedDateTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "rescheduled"],
      default: "pending",
    },
    responseMessage: {
      type: String,
      default: "",
    },
    finalVisitDateTime: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const PropertyVisit = mongoose.model("PropertyVisit", propertyVisitSchema);
