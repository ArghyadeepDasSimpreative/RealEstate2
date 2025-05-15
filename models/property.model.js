import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        description: {
            type: String,
        },
        type: {
            type: String,
            enum: ["apartment", "villa", "independent house", "plot", "commercial", "office", "shop", "warehouse"],
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        address: {
            line1: String,
            line2: String,
            city: String,
            state: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "State",
                required: true,
            },
            pincode: String,
        },
        bedrooms: Number,
        bathrooms: Number,
        area: {
            type: Number,
            required: true,
        },
        amenities: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Amenity",
            },
        ],
        images: [String],
        tags: {
            type: [String],
            default: [],
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // only users with role 'owner' can create
            required: true,
        },
        status: {
            type: String,
            enum: ["available", "sold", "rented", "inactive"],
            default: "available",
        },
        isFeatured: {
            type: Boolean,
            default: false
        },
        featuredUntil: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true,
    }
);

const Property = mongoose.model("Property", propertySchema);

export default Property;
