import errorHandler from "../../lib/errorHandler.js";
import { PropertyVisit } from "../../models/visit.model.js";

export const respondToVisitRequest = async (req, res) => {
  try {
    const { visitId } = req.params;
    const { status, rescheduledDateTime } = req.body;
    const ownerId = req.user.userId;

    const visit = await PropertyVisit.findById(visitId);

    if (!visit) {
      return res.status(404).json({ success: false, message: "Visit request not found" });
    }

    if (visit.ownerId.toString() !== ownerId) {
      return res.status(403).json({ success: false, message: "Unauthorized action" });
    }

    if (!["approved", "rejected", "rescheduled"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    visit.status = status;

    if (status === "rescheduled") {
      if (!rescheduledDateTime) {
        return res.status(400).json({ success: false, message: "Rescheduled time required" });
      }
      visit.rescheduledDateTime = new Date(rescheduledDateTime);
    }

    await visit.save();

    res.status(200).json({ success: true, message: "Visit request updated successfully", data: visit });
  } catch (error) {
    errorHandler(error, req, res);
  }
};
