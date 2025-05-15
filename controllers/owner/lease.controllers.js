import Property from "../../models/property.model.js";
import Lease from "../../models/lease.model.js";
import User from "../../models/user.model.js";
import errorHandler from "../../lib/errorHandler.js";

export const createLease = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const { startDate, endDate, rentAmount, securityDeposit, tenantEmail } = req.body;

        if (!propertyId || !startDate || !endDate || !rentAmount || !securityDeposit || !tenantEmail) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }

        const propertyFound = await Property.findById(propertyId);
        if (!propertyFound) {
            return res.status(404).json({
                message: "Property is not found."
            })
        }

        const tenant = await User.findOne({ email: tenantEmail });
        if (!tenant) {
            return res.status(404).json({
                success: false,
                message: "Tenant not found",
            });
        }

        const leaseData = {
            propertyId,
            tenantId: tenant._id,
            ownerId: req.user.userId, // Assuming `req.user.userId` is available (owner info)
            leaseStartDate: startDate,
            leaseEndDate: endDate,
            monthlyRent: rentAmount,
            securityDeposit
        };

        const newLease = new Lease(leaseData);
        const savedLease = await newLease.save();

        res.status(201).json({
            success: true,
            message: "Lease created successfully, waiting for tenant's agreement",
            data: savedLease,
        });
    } catch (error) {
        errorHandler(error, req, res);
    }
};