import Amenity from "../../models/amenity.model.js"

export const addAmenity = async (req, res) => {
    try {
        const { name, description } = req.body;
        const icon = req.file?.filename;

        // Validate required fields
        if (!name || !icon) {
            return res.status(400).json({
                success: false,
                message: "Both 'name' and 'icon' are required fields.",
            });
        }

        // Check if the amenity already exists
        const existingAmenity = await Amenity.findOne({ name });
        if (existingAmenity) {
            return res.status(409).json({
                success: false,
                message: "Amenity already exists with this name.",
            });
        }

        // Create new amenity
        const amenity = new Amenity({
            name,
            description: description || "",
            icon,
        });

        await amenity.save();

        return res.status(201).json({
            success: true,
            message: "Amenity added successfully",
            data: amenity,
        });
    } catch (error) {
        console.error("Error adding amenity:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getAllAmenities = async (req, res) => {
    try {
        const amenities = await Amenity.find({}, "-createdAt -updatedAt"); // Exclude createdAt and updatedAt fields

        return res.status(200).json({
            success: true,
            data: amenities,
        });
    } catch (error) {
        console.error("Error fetching amenities:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getAmenityById = async (req, res) => {
    try {
      const { id } = req.params;
      
      // Find amenity by ID
      const amenity = await Amenity.findById(id, "-createdAt -updatedAt");
      
      if (!amenity) {
        return res.status(404).json({
          success: false,
          message: "Amenity not found.",
        });
      }
  
      return res.status(200).json({
        success: true,
        data: amenity,
      });
    } catch (error) {
      console.error("Error fetching amenity by ID:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  export const updateAmenityById = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      const icon = req.file?.filename;
  
      // Check if the amenity exists
      const amenity = await Amenity.findById(id);
      if (!amenity) {
        return res.status(404).json({
          success: false,
          message: "Amenity not found.",
        });
      }
  
      // Update the amenity
      amenity.name = name || amenity.name;
      amenity.description = description || amenity.description;
      amenity.icon = icon || amenity.icon;
  
      await amenity.save();
  
      return res.status(200).json({
        success: true,
        message: "Amenity updated successfully",
        data: amenity,
      });
    } catch (error) {
      console.error("Error updating amenity:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  export const deleteAmenityById = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Check if the amenity exists
      const amenity = await Amenity.findByIdAndDelete(id);
      if (!amenity) {
        return res.status(404).json({
          success: false,
          message: "Amenity not found.",
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Amenity deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting amenity:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
