import Lease from "../../models/lease.model.js";

export const clientAgreeToLease = async (req, res) => {
    try {
      const { leaseId } = req.params;
      const clientId = req.user.userId;
  
      const lease = await Lease.findById(leaseId);
      if (!lease) {
        return res.status(404).json({
          success: false,
          message: "Lease not found",
        });
      }
  
      // Ensure that the client is the one agreeing to the lease
      if (lease.tenantId.toString() !== clientId.toString()) {
        return res.status(403).json({
          success: false,
          message: "You are not the tenant of this lease",
        });
      }
  
      if(lease.isAgreedByTenant) {
        return res.status(400).json({
            message: "The tenant has already accepted the lease contract."
        })
      }
      lease.isAgreedByTenant = true;
      lease.status = "active";
  
      const updatedLease = await lease.save();
  
      res.status(200).json({
        success: true,
        message: "Lease agreement confirmed by tenant",
        data: updatedLease,
      });
    } catch (error) {
      errorHandler(error, req, res);
    }
  };