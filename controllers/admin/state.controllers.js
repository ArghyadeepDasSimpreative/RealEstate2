import State from "../../models/state.model.js";

// CREATE a new state
export const createState = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "State name is required" });
    }

    // Check for duplicate
    const existingState = await State.findOne({ name: name.trim() });
    if (existingState) {
      return res.status(409).json({ success: false, message: "State already exists" });
    }

    const newState = await State.create({ name: name.trim() });
    return res.status(201).json({ success: true, data: newState });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

// GET all states
export const getAllStates = async (req, res) => {
  try {
    const states = await State.find({}, { createdAt: 0, updatedAt: 0, __v: 0 });
    return res.status(200).json({ success: true, data: states });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

// GET state by ID
export const getStateById = async (req, res) => {
  try {
    const { id } = req.params;
    const state = await State.findById(id, { createdAt: 0, updatedAt: 0, __v: 0 });

    if (!state) {
      return res.status(404).json({ success: false, message: "State not found" });
    }

    return res.status(200).json({ success: true, data: state });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

// UPDATE state by ID
export const updateStateById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;

    const state = await State.findById(id);
    if (!state) {
      return res.status(404).json({ success: false, message: "State not found" });
    }

    if (name) state.name = name.trim();
    if (status) state.status = status;

    await state.save();
    return res.status(200).json({ success: true, data: state });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

// DELETE state by ID
export const deleteStateById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await State.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "State not found" });
    }

    return res.status(200).json({ success: true, message: "State deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};
