import mongoose from "mongoose";

const priceEntrySchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true,
  },
  changedAt: {
    type: Date,
    default: Date.now,
  },
  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const priceHistorySchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true,
    unique: true,
  },
  prices: [priceEntrySchema],
});

const PriceHistory = mongoose.model("PriceHistory", priceHistorySchema);

export default PriceHistory;
